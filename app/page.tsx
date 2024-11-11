// app/page.tsx

"use client"; // To ensure client-side rendering

import { useState } from "react";
import Layout from "@/components/Layout";
import dynamic from 'next/dynamic';

const P5Canvas = dynamic(() => import('../components/P5Canvas'), {
  ssr: false
});
// import P5Canvas from "@/components/P5Canvas";

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
    </Layout>
  );
}
