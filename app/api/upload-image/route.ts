import { NextResponse } from "next/server";
import { Octokit } from "@octokit/core";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const filePath = formData.get("filePath") as string; // filePath 받아오기

    if (!imageFile || !filePath) {
      return NextResponse.json(
        { message: "Image file and file path are required" },
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

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString("base64");

    // Octokit 인스턴스 생성
    const octokit = new Octokit({
      auth: GITHUB_ACCESS_TOKEN,
    });

    // GitHub API로 파일 업로드 요청
    const response = await octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "jja8989",
        repo: "blog_repos",
        path: filePath, // 전달받은 filePath 사용
        message: `Upload image: ${filePath}`,
        content: base64Content, // Base64 인코딩된 이미지 데이터
      }
    );

    const result = response.data;

    // GitHub API 응답에서 content가 존재하는지 확인
    if (result.content) {
      return NextResponse.json({
        message: "Image uploaded successfully",
        url: result.content.download_url, // 업로드된 이미지의 URL
        sha: result.content.sha, // sha 값을 반환
      });
    } else {
      return NextResponse.json(
        { message: "Content is missing in the API response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
