# HISTORIA 历史人物原型测试

面向小红书数字商品的移动端测试网站。购买者使用小红书订单号验证，首次验证后绑定当前设备；题目和计分均由服务端提供，未授权访客无法读取题卷。

## 当前内容

- 小红书订单号验证与设备绑定
- 26 道原创历史场景题，每次差异化出卷20题
- 女性、男性、合卷三种不同题卷，重测随机替换6题
- 8 个历史人物原型和六维画像
- “优势—代价—边界—建议”长报告
- 本地历史记录与系统分享
- D1 订单授权表、退款禁用状态和90天会话
- 单设备朋友体验码，24小时有效且最多完成3次
- 受密钥保护的订单同步接口

## 本地预览

```bash
pnpm install
pnpm run dev
```

本地演示订单号：`202608170001`。这个号码仅在 `localhost` 生效，部署环境不会接受。

## 上线前配置

部署环境需要配置三个密钥：

- `SESSION_SECRET`：用于签发访问会话，建议使用至少32字节随机值。
- `ORDER_SYNC_SECRET`：用于保护订单同步接口。
- `FRIEND_TRIAL_CODE`：朋友体验码，建议使用不易猜测的字母数字组合。

D1 迁移位于 `drizzle/`。订单系统或自动化流程在付款、退款后调用：

```http
POST /api/orders/sync
X-Order-Sync-Secret: <ORDER_SYNC_SECRET>
Content-Type: application/json

{
  "orders": [
    { "orderNumber": "小红书订单号", "status": "active" }
  ]
}
```

退款时把 `status` 改为 `revoked`。数据库只保存订单号的 SHA-256 哈希，不保存订单明文。

## 验证

```bash
pnpm run build
pnpm test
```

本项目是娱乐性自我观察产品，不应宣传为心理诊断或科学人格测量。
