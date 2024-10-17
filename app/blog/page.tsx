"use client";

import Link from "next/link";
import Layout from "@/components/FilterLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";
import Tags from "@/components/Tags"; // 동적으로 태그를 생성하는 Tags 컴포넌트

// Post 타입 정의
interface Post {
  title: string;
  slug: string;
  sha: string;
  year: string; // 연도 추가
  tags: string[]; // 태그 추가
}

// 게시글 삭제 요청 함수
async function deletePost(
  slug: string,
  sha: string,
  year: string, // 필터에서 선택된 연도 전달
  posts: Post[],
  setPosts: (posts: Post[]) => void
) {
  const res = await fetch(`/api/delete-post`, {
    method: "DELETE", // DELETE 메소드 사용
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug, sha, year }), // slug, sha와 함께 필터에서 선택된 year 값을 본문으로 전달
  });

  if (res.ok) {
    alert("Post deleted successfully!");
    // 삭제된 포스트를 제외한 나머지 포스트들로 상태를 갱신
    setPosts(posts.filter((post) => post.slug !== slug));
  } else {
    const errorData = await res.json();
    alert(`Error deleting post: ${errorData.message}`);
  }
}

export default function Blog() {
  const currentYear = new Date().getFullYear().toString(); // 현재 연도 가져오기
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // 필터링된 포스트 목록
  const [selectedYear, setSelectedYear] = useState<string>(currentYear); // 선택된 연도 상태 추가, 초기값을 현재 연도로 설정
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // 선택된 태그 상태 추가
  const [refresh, setRefresh] = useState(false); // 상태 변화 트리거
  const router = useRouter(); // router 훅

  // 게시글 로드 함수
  const loadPosts = async (year: string) => {
    try {
      const res = await fetch(`/api/posts?year=${year}`, {
        headers: {
          "Cache-Control": "no-cache", // 캐시 방지
        },
      });
      const posts = await res.json();
      setPosts(posts);
      filterPosts(posts, selectedTags); // 게시글 로드 시 필터링 적용
    } catch (error) {
      console.error("게시글을 불러오는 중 오류가 발생했습니다:", error);
    }
  };

  // 필터링 함수: 선택된 태그가 모두 포함된 게시글만 표시
  const filterPosts = (posts: Post[], tags: string[]) => {
    if (tags.length === 0) {
      setFilteredPosts(posts); // 태그가 없으면 모든 게시글 표시
    } else {
      const filtered = posts.filter(
        (post) => tags.every((tag) => post.tags.includes(tag)) // 모든 태그가 포함된 게시글만 필터링
      );
      setFilteredPosts(filtered);
    }
  };

  // 연도 또는 태그 필터 변경 시 게시글 재로드
  useEffect(() => {
    loadPosts(selectedYear); // 선택된 연도에 맞는 게시글 로드
  }, [selectedYear, refresh]); // selectedYear 또는 refresh가 변경될 때마다 실행

  // 태그 필터 변경 시 게시글 필터링 적용
  useEffect(() => {
    filterPosts(posts, selectedTags); // 태그가 변경될 때마다 필터 적용
  }, [selectedTags]); // 선택된 태그 변경 시 실행

  // 연도 필터 핸들러
  const handleFilterChange = (year: string) => {
    setSelectedYear(year); // 선택된 연도 업데이트
  };

  // 태그 필터 핸들러
  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags); // 선택된 태그 목록 업데이트
  };

  // 게시글 삭제 요청 함수
  const handleDelete = async (slug: string, sha: string) => {
    const res = await fetch(`/api/delete-post`, {
      method: "DELETE", // DELETE 메소드 사용
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, sha, year: selectedYear }), // 필터에서 선택된 year 값을 본문으로 전달
    });

    if (res.ok) {
      alert("Post deleted successfully!");
      setRefresh(!refresh); // 상태 갱신을 트리거로 데이터 다시 로드
    } else {
      const errorData = await res.json();
      alert(`Error deleting post: ${errorData.message}`);
    }
  };

  return (
    <Layout onFilterChange={handleFilterChange}>
      <h1 className="text-3xl font-bold mb-8 text-center">Blog</h1>

      {/* Tags 필터링 */}
      <Tags posts={posts} onTagChange={handleTagChange} />

      {/* 필터링된 게시글 표시 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.slug}
              className="relative border rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              style={{ width: "90%", paddingBottom: "60%" }} // 카드 크기 조정
              onClick={() => router.push(`/blog/${post.slug}`)} // 카드 클릭 시 해당 포스트로 이동
            >
              <div className="absolute inset-0 p-4">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <button
                  className="absolute top-2 right-2 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭 이벤트 전파 방지 (카드 이동 방지)
                    handleDelete(post.slug, post.sha); // 삭제 핸들러 호출 (필터에서 선택된 연도 사용)
                  }}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>
            No posts available in {selectedYear} for{" "}
            {selectedTags.length > 0 ? selectedTags.join(", ") : "all tags"}
          </p>
        )}
      </div>

      {/* New Post 버튼 */}
      <Link href="/blog/new-post">
        <button
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg z-50"
          style={{ zIndex: 50 }}
        >
          New Post
        </button>
      </Link>
    </Layout>
  );
}
