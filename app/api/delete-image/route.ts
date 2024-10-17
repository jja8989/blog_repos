import { NextResponse } from "next/server";
import { Octokit } from "@octokit/core";

export async function DELETE(request: Request) {
  try {
    const { imagePath, sha } = await request.json();

    if (!imagePath || !sha) {
      return NextResponse.json(
        { message: "Image path and SHA are required" },
        { status: 400 }
      );
    }
    const decodedPath = decodeURIComponent(imagePath); // URL 인코딩 해제

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

    // GitHub API로 파일 삭제 요청
    const deleteResponse = await octokit.request(
      "DELETE /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "jja8989",
        repo: "blog_repos",
        path: decodedPath, // decode된 경로 전달
        message: `Deleted image: ${decodedPath}`,
        sha: sha,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return NextResponse.json(
      { message: "Image deleted successfully" },
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
