"use client"; // 클라이언트 컴포넌트로 지정

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

interface Post {
  title: string;
  sha: string;
  commitDate: string; // 연도 추가
  tags: string[]; // 태그 추가
  imageUrl: string;
}

const RecentPosts: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const router = useRouter(); // router 훅

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 서버에서 최근 포스트 데이터를 가져오는 API 호출
        const response = await fetch('/api/recent-post')
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("불러온 데이터: ", data);
        const recentPosts = data.posts;
        setRecentPosts(recentPosts);
        console.log("저장된 state-posts", recentPosts);
      }      
      catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">최근 게시물</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentPosts.length > 0 ? (
          recentPosts.map((recentPost, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
              onClick={() => router.push(`/blog/${recentPost.title}`)}
            >
              <div
                className="w-full h-48 bg-cover bg-center"
                style={{
                  backgroundImage: recentPost.imageUrl
                    ? `url(${recentPost.imageUrl})`
                    : "none",
                }}
              ></div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{recentPost.title}</h2>
                <div className="text-sm text-gray-500 mb-2">
                  {recentPost.tags.join(", ")}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                {recentPost.commitDate.split("T")[0]}
                </div>
              </div>
            </div>
          ))
        ):(
          <p>No recent posts</p>
        )}
      </div>
      {/* "more+" 버튼을 카드 외부에 위치시킴 */}
      <div className="mt-4 text-center">
        <button
          onClick={() => router.push("/blog")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          more+
        </button>
      </div>
    </div>
  );
};

export default RecentPosts;
