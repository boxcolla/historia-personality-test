import { getD1, getOrderSyncSecret, sha256 } from "../../../../lib/access";

type OrderInput = { orderNumber?:string; status?:"active"|"revoked"; expiresAt?:number|null };

export async function POST(request: Request) {
  const expected = getOrderSyncSecret();
  const provided = request.headers.get("x-order-sync-secret") ?? "";
  if (!expected || await sha256(provided) !== await sha256(expected)) {
    return Response.json({ error:"Unauthorized" }, { status:401 });
  }
  const payload = await request.json().catch(() => ({})) as { orders?:OrderInput[] };
  const orders = payload.orders ?? [];
  if (orders.length === 0 || orders.length > 200) return Response.json({ error:"orders must contain 1-200 items" }, { status:400 });
  const db = getD1();
  if (!db) return Response.json({ error:"Database unavailable" }, { status:503 });
  const now = Date.now();
  const statements = [];
  for (const order of orders) {
    const orderNumber = order.orderNumber?.trim() ?? "";
    if (!/^[A-Za-z0-9-]{8,40}$/.test(orderNumber)) return Response.json({ error:"Invalid order number" }, { status:400 });
    const orderHash = await sha256(orderNumber);
    statements.push(db.prepare(
      "INSERT INTO access_orders (order_hash, status, created_at, expires_at) VALUES (?, ?, ?, ?) ON CONFLICT(order_hash) DO UPDATE SET status = excluded.status, expires_at = excluded.expires_at",
    ).bind(orderHash, order.status ?? "active", now, order.expiresAt ?? null));
  }
  await db.batch(statements);
  return Response.json({ ok:true, count:orders.length });
}
