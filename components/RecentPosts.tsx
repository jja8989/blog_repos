"use client"; // 클라이언트 컴포넌트로 지정

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

interface Post {
  title: string;
  sha: string;
  year: string; // 연도 추가
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {recentPosts.length > 0 ? (
          recentPosts.map((recentPost, index) => (
            
            <div

              key={index} // 슬러그가 없을 경우 인덱스를 키로 사용
              onClick={() => router.push(`/blog/${recentPost.title}`)}
              className="relative border rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              style={{
                width: "90%",
                paddingBottom: "60%",
                backgroundImage: recentPost.imageUrl
                  ? `url(${recentPost.imageUrl})`
                  : "none", // 이미지 미리보기 적용
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} // 카드 크기 조정 및 이미지 배경
            >
              <h2 className="text-lg font-bold">{recentPost.title}</h2>

            </div>

          ))
        ):(
          <p>No recent posts</p>
        )
        }

      </div>
    </div>
  );
};

export default RecentPosts;
