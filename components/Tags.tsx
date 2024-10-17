"use client";

import React, { useState } from "react";

// Props 정의에 posts 추가
interface TagsProps {
  onTagChange: (tags: string[]) => void;
  posts: { tags: string[] }[]; // 게시글 데이터에서 tags 배열을 받음
}

const Tags: React.FC<TagsProps> = ({ onTagChange, posts }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Ensure that posts is a valid array before using flatMap
  const allTags = Array.from(
    new Set((Array.isArray(posts) ? posts : []).flatMap((post) => post.tags))
  );

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // 태그가 이미 선택되어 있으면 해제
      const updatedTags = selectedTags.filter((t) => t !== tag);
      setSelectedTags(updatedTags);
      onTagChange(updatedTags);
    } else {
      // 태그가 선택되어 있지 않으면 추가
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      onTagChange(updatedTags);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedTags.includes(tag)
              ? "bg-blue-300 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default Tags;
