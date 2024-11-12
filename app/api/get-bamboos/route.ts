import { NextResponse } from 'next/server';

export async function GET() {
  const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

  try {
    const response = await fetch(`https://api.github.com/repos/jja8989/blog_repos/contents/bamboos/comments.json`, {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments from GitHub');
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const comments = JSON.parse(content);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Error fetching comments', error: (error as Error).message }, { status: 500 });
  }
}
