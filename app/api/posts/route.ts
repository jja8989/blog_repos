import { NextResponse } from "next/server";

const parseImageUrl = (content: string): string | null => {
  // Markdown 이미지 형식과 HTML <img> 태그 형식 둘 다 처리
  const markdownImageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (markdownImageMatch) {
    return markdownImageMatch[1]; // Markdown 이미지 URL 반환
  }

  const htmlImageMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (htmlImageMatch) {
    return htmlImageMatch[1]; // HTML <img> 태그에서 이미지 URL 반환
  }

  return null; // 이미지가 없으면 null 반환
};

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

          // 태그 정보 파싱
          const tagsMatch = fileContent.match(/tags:\s*\[([^\]]+)\]/);
          const tags = tagsMatch
            ? tagsMatch[1]
                .split(",")
                .map((tag) => tag.trim().replace(/['"]+/g, ""))
            : [];

          // 이미지 URL 파싱
          const imageUrl = parseImageUrl(fileContent);

          // 각 파일의 커밋 정보를 가져와 작성 시간 정보 추출
          const commitRes = await fetch(
            `https://api.github.com/repos/jja8989/blog_repos/commits?path=post/${year}/${file.name}`,
            {
              headers: {
                Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
              },
            }
          );
          const commitData = await commitRes.json();
          const commitDate = commitData[0]?.commit?.author?.date || "";

          return {
            title: file.name.replace(".md", ""),
            slug: file.name.replace(".md", ""),
            sha: file.sha,
            tags,
            imageUrl,
            commitDate, // 커밋 날짜 추가
          };
        })
    );

    // `commitDate`를 기준으로 최신 순으로 정렬 (같은 날이면 시간 순으로 정렬)
    const sortedPosts = posts.sort(
      (a, b) =>
        new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime()
    );

    if (sortedPosts.length === 0) {
      return NextResponse.json(
        { message: `No posts available for year ${year}` },
        { status: 404 }
      );
    }

    return NextResponse.json(sortedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: `Error fetching posts for year ${year}` },
      { status: 500 }
    );
  }
}
