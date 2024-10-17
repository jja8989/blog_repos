"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

// 동적 로딩을 사용하여 클라이언트 측에서만 마크다운 에디터를 로드
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false, // 서버 사이드 렌더링을 비활성화
});

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<string | undefined>(""); // MDEditor와의 호환성을 위해 타입 수정
  const [tags, setTags] = useState(""); // 태그 필드 추가
  const [isDarkMode, setIsDarkMode] = useState(false); // 다크 모드 상태 추가
  const [imageURLs, setImageURLs] = useState<
    { url: string; name: string; path: string; sha: string }[]
  >([]); // 업로드된 이미지 URL, 이름, 경로, sha 저장
  const router = useRouter();

  // 다크 모드 토글 함수
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute(
      "data-color-mode",
      isDarkMode ? "light" : "dark"
    );
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileName = `${Date.now()}-${files[0].name}`;
    const filePath = `images/${fileName}`;

    const formData = new FormData();
    formData.append("image", files[0]);
    formData.append("filePath", filePath); // filePath를 추가로 전달

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      const fileSha = data.sha; // 업로드 후 GitHub에서 반환되는 sha 값

      console.log("filePath:", filePath); // 로그로 경로 확인
      console.log("SHA:", fileSha); // 로그로 sha 값 확인

      setImageURLs((prevURLs) => [
        ...prevURLs,
        { url: data.url, name: fileName, path: filePath, sha: fileSha }, // sha 값 저장
      ]);

      // 마크다운 콘텐츠에 이미지 URL 추가
      setContent((prevContent) => `${prevContent}\n\n![Image](${data.url})`);
    } else {
      alert("Image upload failed");
    }
  };

  // 이미지 삭제 함수
  // 이미지 삭제 함수
  const handleImageDelete = async (path: string, sha: string) => {
    console.log("Deleting image with path:", path, "and sha:", sha); // 로그 추가

    const res = await fetch("/api/delete-image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imagePath: path, sha }), // imagePath와 sha 값이 제대로 전달되고 있는지 확인
    });

    if (res.ok) {
      setImageURLs((prevURLs) =>
        prevURLs.filter((image) => image.path !== path)
      );
    } else {
      const data = await res.json();
      console.error("Image deletion failed:", data);
      alert(`Image deletion failed: ${data.message}`);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const tagsArray = tags.split(",").map((tag) => tag.trim()); // ","로 태그를 분리하여 배열로 변환

    const markdownContent = `---
title: "${title}"
date: "${new Date().toISOString().split("T")[0]}"
description: "${description}"
tags: [${tagsArray.map((tag) => `"${tag}"`).join(", ")}] 
---

${content}
`;

    const res = await fetch("/api/create-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content: markdownContent,
      }),
    });

    if (res.ok) {
      alert("Post created successfully!");
      router.push("/blog");
    } else {
      alert("Error creating post");
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <label className="block mb-2">Content</label>
            <button
              className="bg-gray-500 text-white px-1 py-1 rounded"
              onClick={toggleDarkMode}
              type="button"
            >
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>

          <div className="border p-2 w-full wmde-markdown-var">
            <MDEditor value={content} onChange={setContent} height={400} />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Tags (comma separated)</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., tech, career, ai"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          {/* 업로드된 이미지 목록 */}
          {imageURLs.length > 0 && (
            <div className="mb-4">
              <h2 className="font-bold mb-2">Uploaded Images</h2>
              <ul>
                {imageURLs.map((image, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between mb-2"
                  >
                    <span>{image.name}</span>
                    <button
                      type="button" // 여기에 type="button" 추가
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleImageDelete(image.path, image.sha)} // sha 값 전달
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit Post
          </button>
        </form>
      </div>
    </Layout>
  );
}
