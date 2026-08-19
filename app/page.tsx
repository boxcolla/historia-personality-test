import type { Metadata } from "next";
import { headers } from "next/headers";
import { HistoriaApp } from "./HistoriaApp";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  const title = "HISTORIA｜历史人物原型";
  const description = "从十二个历史瞬间，照见你的选择。";
  return {
    title,
    description,
    openGraph: { title, description, images:[{ url:image, width:1792, height:933 }] },
    twitter: { card:"summary_large_image", title, description, images:[image] },
  };
}

export default function Home() {
  return <HistoriaApp />;
}
