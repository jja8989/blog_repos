// components/MarkdownComponents.tsx

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ghcolors } from "react-syntax-highlighter/dist/cjs/styles/prism";

// 헤더 컴포넌트
export const MarkdownHeader = {
  h1: ({ node, ...props }: any) => (
    <>
      <h1 className="text-4xl font-bold" {...props} />
      <hr className="border-t border-gray-300 mt-2 mb-6" />
    </>
  ),
  h2: ({ node, ...props }: any) => (
    <>
      <h2 className="text-3xl font-bold" {...props} />
      <hr className="border-t border-gray-300 mt-2 mb-6" />
    </>
  ),
  h3: ({ node, ...props }: any) => (
    <>
      <h3 className="text-2xl font-semibold" {...props} />
      <hr className="border-t border-gray-300 mt-2 mb-6" />
    </>
  ),
  h4: ({ node, ...props }: any) => (
    <h4 className="text-xl font-semibold" {...props} />
  ),
  h5: ({ node, ...props }: any) => (
    <h5 className="text-lg font-semibold" {...props} />
  ),
  h6: ({ node, ...props }: any) => (
    <h6 className="text-base font-semibold" {...props} />
  ),
};

// 코드 블록 렌더링 컴포넌트
export const MarkdownCode = {
  code: (props: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
    const { inline, className, children } = props;
    const match = /language-(\w+)/.exec(className || "");
    return !inline ? (
      <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto">
        <code className={className}>{children}</code>
      </pre>
    ) : (
      <code className="bg-gray-100 text-red-600 p-1 rounded-md">
        {children}
      </code>
    );
  },
};

// 테이블 컴포넌트
export const MarkdownTable = {
  table: ({ node, ...props }: any) => (
    <table
      className="table-auto border-collapse border border-gray-300"
      {...props}
    />
  ),
  thead: ({ node, ...props }: any) => (
    <thead className="bg-gray-100" {...props} />
  ),
  th: ({ node, ...props }: any) => (
    <th className="border border-gray-300 px-4 py-2" {...props} />
  ),
  td: ({ node, ...props }: any) => (
    <td className="border border-gray-300 px-4 py-2" {...props} />
  ),
};

export const MarkdownImage = {
  img: ({ node, ...props }: any) => (
    <img
      style={{ display: "block", margin: "auto", maxWidth: "100%" }} // 가운데 정렬 및 너비 100%
      {...props}
    />
  ),
};
