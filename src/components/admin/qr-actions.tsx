"use client";
import { FiDownload, FiPrinter } from "react-icons/fi";

export function QrActions({ url, shopName }: { url: string; shopName: string }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200"><rect width="900" height="1200" fill="#f5f5ff"/><text x="450" y="150" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="52" fill="#171329">${shopName}</text><text x="450" y="220" text-anchor="middle" font-family="sans-serif" font-size="30" fill="#5d587c">Scan to book your appointment</text><rect x="150" y="330" width="600" height="600" rx="28" fill="#fff" stroke="#5425d8" stroke-width="18"/><text x="450" y="650" text-anchor="middle" font-family="monospace" font-size="34" fill="#171329">${url}</text><text x="450" y="1030" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#5d587c">QueueCut</text></svg>`;
  const download = () => { const blob = new Blob([svg], { type: "image/svg+xml" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${shopName.toLowerCase().replace(/\s+/g, "-")}-booking-poster.svg`; link.click(); URL.revokeObjectURL(link.href); };
  return <div className="action-row"><button type="button" onClick={download}><FiDownload />Download SVG poster</button><button type="button" className="ghost" onClick={() => window.print()}><FiPrinter />Print</button></div>;
}
