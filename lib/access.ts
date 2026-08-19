import { env } from "cloudflare:workers";

type RuntimeEnv = { DB?: D1Database; SESSION_SECRET?: string; ORDER_SYNC_SECRET?: string; FRIEND_TRIAL_CODE?: string };
export type SessionPayload = { orderHash: string; deviceHash: string; exp: number; accessType?: "order" | "trial" };

const encoder = new TextEncoder();
const COOKIE_NAME = "historia_session";
const LOCAL_SECRET = "historia-local-preview-only";

function runtime(): RuntimeEnv {
  return env as unknown as RuntimeEnv;
}

export function isLocalRequest(request: Request) {
  const host = new URL(request.url).hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function base64Url(value: string) {
  const bytes = encoder.encode(value);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

async function signingKey(local: boolean) {
  const secret = runtime().SESSION_SECRET || (local ? LOCAL_SECRET : "");
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSession(payload: SessionPayload, local: boolean) {
  const encoded = base64Url(JSON.stringify(payload));
  const signature = await crypto.subtle.sign("HMAC", await signingKey(local), encoder.encode(encoded));
  const signed = [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${encoded}.${signed}`;
}

export function sessionCookie(value: string, local = false) {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; ${local ? "" : "Secure; "}SameSite=Lax; Max-Age=7776000`;
}

function readCookie(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1) ?? "";
}

function equalHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

export async function readSession(request: Request): Promise<SessionPayload | null> {
  const token = readCookie(request);
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expectedBytes = await crypto.subtle.sign("HMAC", await signingKey(isLocalRequest(request)), encoder.encode(encoded));
  const expected = [...new Uint8Array(expectedBytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (!equalHex(expected, signature)) return null;
  try {
    const payload = JSON.parse(decodeBase64Url(encoded)) as SessionPayload;
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export async function authorizeSession(request: Request) {
  const session = await readSession(request);
  if (!session) return null;
  if (isLocalRequest(request)) return session;

  const db = runtime().DB;
  if (!db) return null;
  const row = await db.prepare(
    "SELECT status, expires_at, access_type, completed_count, max_completions FROM access_orders WHERE order_hash = ? AND device_hash = ? LIMIT 1",
  ).bind(session.orderHash, session.deviceHash).first() as { status:string; expires_at:number|null; access_type:string; completed_count:number; max_completions:number|null } | null;
  const withinCompletionLimit = row?.access_type !== "trial" || row.max_completions === null || row.completed_count < row.max_completions;
  return row?.status === "active" && (!row.expires_at || row.expires_at > Date.now()) && withinCompletionLimit ? session : null;
}

export async function recordTestCompletion(session: SessionPayload, request: Request) {
  if (session.accessType !== "trial" || isLocalRequest(request)) return true;
  const db = runtime().DB;
  if (!db) return false;
  const result = await db.prepare(
    "UPDATE access_orders SET completed_count = completed_count + 1 WHERE order_hash = ? AND device_hash = ? AND access_type = 'trial' AND status = 'active' AND expires_at > ? AND completed_count < max_completions",
  ).bind(session.orderHash, session.deviceHash, Date.now()).run();
  return Boolean(result.success && result.meta?.changes === 1);
}

export function getD1() {
  return runtime().DB;
}

export function getOrderSyncSecret() {
  return runtime().ORDER_SYNC_SECRET ?? "";
}

export function getFriendTrialCode() {
  return runtime().FRIEND_TRIAL_CODE?.trim() ?? "";
}
