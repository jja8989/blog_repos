import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  if (!year) {
    return NextResponse.json({ message: "Year is required" }, { status: 400 });
  }

  const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

  if (!GITHUB_ACCESS_TOKEN) {
    return NextResponse.json(
      { message: "GitHub access token not found" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/jja8989/blog_repos/contents/post/${year}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
      }
    );

    if (response.status === 404) {
      return NextResponse.json(
        { message: `No posts found for year ${year}` },
        { status: 404 }
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { message: "Invalid data from GitHub" },
        { status: 500 }
      );
    }

    const posts = await Promise.all(
      data
        .filter((file: any) => file.name.endsWith(".md"))
        .map(async (file: any) => {
          const fileContentRes = await fetch(file.download_url);
          const fileContent = await fileContentRes.text();

          // 여기서 파일의 메타데이터 (태그 정보 등) 파싱
          const tagsMatch = fileContent.match(/tags:\s*\[([^\]]+)\]/);
          const tags = tagsMatch
            ? tagsMatch[1]
                .split(",")
                .map((tag) => tag.trim().replace(/['"]+/g, ""))
            : [];

          return {
            title: file.name.replace(".md", ""),
            slug: file.name.replace(".md", ""),
            sha: file.sha,
            tags, // 태그 정보 포함
          };
        })
    );

    if (posts.length === 0) {
      return NextResponse.json(
        { message: `No posts available for year ${year}` },
        { status: 404 }
      );
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: `Error fetching posts for year ${year}` },
      { status: 500 }
    );
  }
}
