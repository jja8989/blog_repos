"use client";
import Layout from '@/components/Layout';
import React, { useState, useEffect } from 'react';
interface Comment {
  id: number;
  username: string;
  content: string;
  timestamp: string;
}
export default function CommentsBoard() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('/api/get-bamboos');
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched comments:', data); // 디버깅 로그
        const comments = data.comments || [];
        setComments(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      }
    };
    fetchComments();
  }, []);
  const handleAddComment = async () => {
    if (username.trim() && content.trim()) {
      try {
        const response = await fetch('/api/add-bamboos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, content }),
        });
        if (response.ok) {
          // 서버에서 업데이트된 데이터를 다시 가져옴
          const fetchResponse = await fetch('/api/get-bamboos');
          const fetchData = await fetchResponse.json();
          setComments(fetchData.comments || []);
          setUsername('');
          setContent('');
        } else {
          alert('Failed to add comment');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    } else {
      alert('Username and comment content cannot be empty.');
    }
  };
  return (
    <Layout>
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">비-바 대나무숲</h1>
            <h1 className="text-3xl font-bold mb-4">비-바ㅇ 대나무숲</h1>

            <div className="mb-4">
                <input
                type="text"
                placeholder="별명인데 실명 적어도 상관은 없음~"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 mb-2 w-full rounded bg-white"
                />
                <textarea
                placeholder="내뱉은 말은 주워담을 수 없습니다. 그래도 계속 하시겠습니까?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border p-2 w-full rounded h-24 mb-2 bg-white"
                ></textarea>
                <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                할 말은 한다!
                </button>
            </div>
            <div className="mt-8">
                {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-2 mb-4">
                    <h3 className="font-semibold">{comment.username}</h3>
                    <p className="text-gray-700">{comment.content}</p>
                    <p className="text-sm text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
                    </div>
                ))
                ) : (
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    </Layout>
    );
}