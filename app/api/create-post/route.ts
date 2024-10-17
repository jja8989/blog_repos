import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

    if (!GITHUB_ACCESS_TOKEN) {
      return NextResponse.json(
        { message: "GitHub access token not found" },
        { status: 500 }
      );
    }

    const fileName = `${title.replace(/\s+/g, "-").toLowerCase()}.md`;
    const filePath = `post/2024/${fileName}`; // 경로를 'post/2024'로 변경

    // GitHub API로 파일 업로드 요청
    const response = await fetch(
      `https://api.github.com/repos/jja8989/blog_repos/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add new post: ${title}`,
          content: Buffer.from(content).toString("base64"), // Base64 인코딩
        }),
      }
    );

    const result = await response.json();

    // GitHub API 응답을 로그로 출력하여 문제 파악
    console.log("GitHub API 응답:", result);

    if (response.ok) {
      return NextResponse.json(
        { message: "Post created successfully", details: result },
        { status: 200 }
      );
    } else {
      console.error("GitHub API Error:", result);
      return NextResponse.json(
        { message: "Error creating post", details: result },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
