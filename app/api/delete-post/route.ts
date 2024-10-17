import { NextResponse } from "next/server";
import { Octokit } from "@octokit/core";

export async function DELETE(request: Request) {
  try {
    // 요청에서 slug, sha, year 값 추출
    const { slug, sha, year } = await request.json();

    // year, slug, sha 값 확인
    if (!slug || !sha || !year) {
      return NextResponse.json(
        { message: "Slug, SHA, and Year are required" },
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

    // year를 문자열로 처리
    const filePath = `post/${String(year)}/${slug}.md`;

    // Octokit 인스턴스 생성
    const octokit = new Octokit({
      auth: GITHUB_ACCESS_TOKEN,
    });

    // GitHub API로 파일 삭제 요청
    const response = await octokit.request(
      "DELETE /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "jja8989",
        repo: "blog_repos",
        path: filePath, // 파일 경로
        message: `Deleted post: ${slug}`, // 커밋 메시지
        sha: sha, // 파일의 SHA 값
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    // 로그로 GitHub API 응답 확인
    console.log("GitHub API Response:", response);

    if (response.status === 200) {
      return NextResponse.json(
        { message: "Post deleted successfully", details: response },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Error deleting post", details: response },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error during API request:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
