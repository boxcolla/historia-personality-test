import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HISTORIA｜历史人物原型",
  description: "从历史情境选择中，照见与你相近的人物原型。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
