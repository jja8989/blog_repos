"use client"; // 클라이언트 컴포넌트임을 명시

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // GitHub 스타일의 마크다운 지원
import rehypeRaw from "rehype-raw"; // HTML 태그 지원
import rehypeSlug from "rehype-slug"; // 제목에 슬러그 추가
import rehypeAutoLinkHeadings from "rehype-autolink-headings"; // 제목에 자동 링크 추가
import Layout from "@/components/Layout";
import Giscus from "@giscus/react"; // Giscus React 컴포넌트 추가

import {
  MarkdownHeader,
  MarkdownCode,
  MarkdownTable,
  MarkdownImage, // 추가된 이미지 컴포넌트
} from "@/components/MarkdownComponents";

// API에서 마크다운 파일을 가져오는 함수
async function fetchPost(slug: string): Promise<string> {
  const decodeSlug = decodeURIComponent(slug);

  const res = await fetch("/api/fetch-post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug: decodeSlug }),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(`Error fetching post: ${message}`);
  }

  const { content } = await res.json();
  return content;
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [content, setContent] = useState<string>("");
  const [metaData, setMetaData] = useState({
    title: "",
    date: "",
    description: "",
    tags: [] as string[],
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const fetchedContent = await fetchPost(slug);
        const [meta, ...body] = fetchedContent.split("---\n").slice(1);
        const metaLines = meta.trim().split("\n");

        const metaDataObj = metaLines.reduce((acc: any, line) => {
          const [key, value] = line.split(": ");
          acc[key.trim()] = value.replace(/["']/g, "").trim();
          return acc;
        }, {});

        setMetaData({
          title: metaDataObj.title || "",
          date: metaDataObj.date || "",
          description: metaDataObj.description || "",
          tags: metaDataObj.tags ? metaDataObj.tags.split(", ") : [],
        });

        setContent(body.join("\n---\n"));
      } catch (error) {
        console.error("게시글을 불러오는 중 오류가 발생했습니다:", error);
        setContent("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchContent();
  }, [slug]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-2">{metaData.title}</h1>
      <div className="flex justify-between text-sm text-gray-500 mb-8">
        <p>{metaData.description}</p>
        <p>{metaData.date}</p>
      </div>

      <article className="prose prose-lg max-w-none markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutoLinkHeadings]}
          components={{
            ...MarkdownHeader,
            ...MarkdownCode,
            ...MarkdownTable,
            ...MarkdownImage, // 이미지 스타일 적용
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {metaData.tags.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Tags: {metaData.tags.join(", ")}
        </div>
      )}

      <div className="mt-8">
        <Giscus
          id="comments"
          repo="jja8989/blog_repos"
          repoId="R_kgDONBbtOA"
          category="General"
          categoryId="DIC_kwDONBbtOM4Cjbbt"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme="light"
          lang="ko"
          loading="lazy"
        />
      </div>
    </Layout>
  );
}
