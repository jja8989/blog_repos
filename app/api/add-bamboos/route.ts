import { NextResponse } from 'next/server';

interface Comment {
  id: number;
  username: string;
  content: string;
  timestamp: string;
}

export async function POST(request: Request) {
  const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
  if (!GITHUB_ACCESS_TOKEN) {
    return NextResponse.json(
      { message: 'GitHub Access Token is missing' },
      { status: 500 }
    );
  }
  try {
    // 요청 본문에서 username과 content를 추출
    const { username, content } = await request.json();

    if (!username || !content) {
      return NextResponse.json({ message: 'Username and content are required' }, { status: 400 });
    }

    // 기존 파일 가져오기
    const getResponse = await fetch(`https://api.github.com/repos/jja8989/blog_repos/contents/bamboos/comments.json`, {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
      },
    });

    if (!getResponse.ok) {
      throw new Error('Failed to fetch existing comments');
    }

    const getData = await getResponse.json();
    const existingComments = JSON.parse(Buffer.from(getData.content, 'base64').toString('utf-8'));

    // 새로운 댓글 추가
    const newComment: Comment = {
      id: existingComments.length + 1,
      username,
      content,
      timestamp: new Date().toISOString(),
    };
    const updatedComments = [newComment, ...existingComments];

    // 업데이트된 댓글을 GitHub에 업로드
    const response = await fetch(`https://api.github.com/repos/jja8989/blog_repos/contents/bamboos/comments.json`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Add new comment',
        content: Buffer.from(JSON.stringify(updatedComments)).toString('base64'),
        sha: getData.sha, // 기존 파일의 SHA를 포함해야 함
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update comments on GitHub');
    }

    return NextResponse.json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ message: 'Error adding comment', error: (error as Error).message }, { status: 500 });
  }
}
