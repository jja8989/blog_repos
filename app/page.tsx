// app/page.tsx

"use client"; // To ensure client-side rendering

import { useState } from "react";
import Layout from "@/components/Layout";
import dynamic from 'next/dynamic';
import RecentPosts from "@/components/RecentPosts";
const P5Canvas = dynamic(() => import('../components/P5Canvas'), {
  ssr: false
});
// import P5Canvas from "@/components/P5Canvas";s

export default function Home() {
  const [showFirstSketch, setShowFirstSketch] = useState(true);

  return (
    <Layout>
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Welcome to VIBA</h1>
        <p className="text-xl text-secondary">
          Explore our Blog and Events for the latest updates!
        </p>
      </section>

      {/* 링크 버튼 섹션 */}
      <section className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => window.open("https://www.notion.so/parklab/32ec67c84fb74b9691ec6cc7a5956c4a?v=12e34fccb7434e55b5290ee4149534b9", "_blank")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-60"
        >
          Weekly Report 쓰러가기
        </button>
        <button
          onClick={() => window.open("https://www.notion.so/parklab/Lab-Seminar-9a35d91f8b2a4e07910c745c4b8812f9", "_blank")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-60"
        >
          Lab Seminar 자료실
        </button>
        <button
          onClick={() => window.open("https://vibalab.org", "_blank")}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition w-60"
        >
          연구실 홈페이지
        </button>
      </section>

      {/* P5 CANVAS */}
      <P5Canvas showFirstSketch={showFirstSketch} />

      {/* Flex container for description and button */}
      <div className="flex items-center justify-between mt-4">
        {/* Left-aligned description */}
        <p className="text-left text-base">
          {showFirstSketch
            ? "Particle animation: click and drag to make connected paths"
            : "Physics simulation: soft body accelerating toward the mouse"}
        </p>

        {/* Right-aligned button */}
        <button
          onClick={() => setShowFirstSketch(!showFirstSketch)}
          className="btn btn-primary hover:btn-accent"
        >
          Switch Canvas
        </button>
      </div>

      <section className="mb-8">
        <RecentPosts />
      </section>
    </Layout>
  );
}
