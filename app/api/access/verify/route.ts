import { createSession, getD1, getFriendTrialCode, isLocalRequest, sessionCookie, sha256 } from "../../../../lib/access";

const LOCAL_DEMO_ORDER = "202608170001";
const ORDER_DURATION = 90 * 24 * 60 * 60 * 1000;
const TRIAL_DURATION = 24 * 60 * 60 * 1000;
const TRIAL_MAX_COMPLETIONS = 3;

type AccessRow = {
  status:string;
  device_hash:string|null;
  expires_at:number|null;
  access_type:string;
  completed_count:number;
  max_completions:number|null;
};

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({})) as { orderNumber?: string; deviceId?: string };
  const orderNumber = payload.orderNumber?.trim() ?? "";
  const deviceId = payload.deviceId?.trim() ?? "";
  if (!/^[A-Za-z0-9-]{8,40}$/.test(orderNumber) || deviceId.length < 12) {
    return Response.json({ error: "请输入完整订单号或体验码" }, { status: 400 });
  }

  const local = isLocalRequest(request);
  const orderHash = await sha256(orderNumber);
  const deviceHash = await sha256(deviceId);
  const trialCode = getFriendTrialCode();
  const isTrial = !local && Boolean(trialCode) && orderHash === await sha256(trialCode);
  const now = Date.now();
  let sessionExpiresAt = now + ORDER_DURATION;
  if (!local) {
    const db = getD1();
    if (!db) return Response.json({ error: "授权服务尚未配置" }, { status: 503 });
    if (isTrial) {
      await db.prepare(
        "INSERT OR IGNORE INTO access_orders (order_hash, status, created_at, expires_at, access_type, completed_count, max_completions) VALUES (?, 'active', ?, ?, 'trial', 0, ?)",
      ).bind(orderHash, now, now + TRIAL_DURATION, TRIAL_MAX_COMPLETIONS).run();
    }
    const row = await db.prepare(
      "SELECT status, device_hash, expires_at, access_type, completed_count, max_completions FROM access_orders WHERE order_hash = ? LIMIT 1",
    ).bind(orderHash).first() as AccessRow | null;
    const validType = isTrial ? row?.access_type === "trial" : row?.access_type === "order";
    if (!row || !validType || row.status !== "active" || (row.expires_at && row.expires_at <= now)) {
      return Response.json({ error: isTrial ? "体验码已失效" : "未找到有效订单，请确认已付款且未退款" }, { status: 403 });
    }
    if (isTrial && row.max_completions !== null && row.completed_count >= row.max_completions) {
      return Response.json({ error: "该体验码的测试次数已用完" }, { status: 403 });
    }
    if (row.device_hash && row.device_hash !== deviceHash) return Response.json({ error: isTrial ? "该体验码已绑定其他设备" : "该订单已绑定其他设备，请联系售后重置" }, { status: 409 });
    if (!row.device_hash) {
      const result = await db.prepare("UPDATE access_orders SET device_hash = ?, activated_at = ? WHERE order_hash = ? AND device_hash IS NULL AND status = 'active'").bind(deviceHash, now, orderHash).run();
      if (!result.success || result.meta?.changes !== 1) return Response.json({ error: "设备绑定失败，请稍后重试" }, { status: 409 });
    }
    sessionExpiresAt = row.expires_at ?? sessionExpiresAt;
  } else if (orderNumber !== LOCAL_DEMO_ORDER) {
    return Response.json({ error: "本地预览请使用项目演示订单号" }, { status: 403 });
  }

  const accessType = isTrial ? "trial" : "order";
  const token = await createSession({ orderHash, deviceHash, exp:sessionExpiresAt, accessType }, local);
  return Response.json({ ok:true, accessType, expiresAt:sessionExpiresAt }, { headers: { "Set-Cookie": sessionCookie(token, local) } });
}
