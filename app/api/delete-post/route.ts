import { NextResponse } from "next/server";
import { Octokit } from "@octokit/core";

// 이미지 URL을 Markdown 파일에서 파싱하는 함수
const parseImageUrls = (content: string): string[] => {
  const markdownImageMatches = content.match(/!\[.*?\]\((.*?)\)/g);
  const htmlImageMatches = content.match(/<img[^>]+src=["']([^"']+)["']/g);

  const markdownImageUrls = markdownImageMatches
    ? markdownImageMatches.map((match) => match.match(/\((.*?)\)/)?.[1] || "")
    : [];

  const htmlImageUrls = htmlImageMatches
    ? htmlImageMatches.map(
        (match) => match.match(/src=["']([^"']+)["']/)?.[1] || ""
      )
    : [];

  return [...markdownImageUrls, ...htmlImageUrls].filter(
    (url) => url.includes("githubusercontent.com") // GitHub 저장소의 이미지인지 확인
  );
};

// 타입 가드: 반환된 객체가 파일 데이터인지 확인
const isFileContent = (data: any): data is { sha: string; content: string } => {
  return (
    data && typeof data.sha === "string" && typeof data.content === "string"
  );
};

export async function DELETE(request: Request) {
  try {
    // 요청에서 slug, sha, year 값 추출
    const { slug, sha, year } = await request.json();

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

    const octokit = new Octokit({
      auth: GITHUB_ACCESS_TOKEN,
    });

    // 파일 경로 생성
    const filePath = `post/${String(year)}/${slug}.md`;

    // 파일 내용을 가져오기 위한 요청
    const fileContentRes = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "jja8989",
        repo: "blog_repos",
        path: filePath,
        ref: "main",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    // 파일 데이터가 맞는지 확인
    if (!isFileContent(fileContentRes.data)) {
      return NextResponse.json(
        { message: "File content or SHA not found" },
        { status: 404 }
      );
    }

    // Base64로 인코딩된 content를 디코딩
    const content = Buffer.from(fileContentRes.data.content, "base64").toString(
      "utf-8"
    );

    // Markdown 파일에서 이미지 URL 추출
    const imageUrls = parseImageUrls(content);

    // 이미지 삭제 요청을 처리
    const deleteImageRequests = imageUrls.map(async (imageUrl) => {
      const imagePath = decodeURIComponent(imageUrl.split("main/")[1]); // 이미지 경로 추출

      // 이미지 SHA 가져오기
      const imageMeta = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: "jja8989",
          repo: "blog_repos",
          path: imagePath,
          ref: "main",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      // 파일 데이터가 맞는지 확인
      if (!isFileContent(imageMeta.data)) {
        console.error(`SHA or content not found for image: ${imagePath}`);
        return;
      }

      // 이미지 삭제 요청
      return octokit.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
        owner: "jja8989",
        repo: "blog_repos",
        path: imagePath,
        message: `Deleted image associated with post: ${slug}`,
        sha: imageMeta.data.sha,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
    });

    // 모든 이미지 삭제 요청을 병렬 처리
    await Promise.all(deleteImageRequests);

    // Markdown 파일 삭제 요청
    const deleteResponse = await octokit.request(
      "DELETE /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "jja8989",
        repo: "blog_repos",
        path: filePath,
        message: `Deleted post: ${slug}`,
        sha: sha,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return NextResponse.json(
      { message: "Post and associated images deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during API request:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
