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

export async function GET() {
  try {
    const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
    if (!GITHUB_ACCESS_TOKEN) {
      return NextResponse.json(
        { message: "GitHub access token not found" },
        { status: 500 }
      );
    }

    // GitHub API URL 설정 (특정 폴더에서 포스트를 가져오기)
    const response = await fetch(
      "https://api.github.com/repos/jja8989/viba_blog/contents/post/2024",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
      }
    );

    const result = await response.json();

    if (response.ok) {        

      // 각 포스트의 내용을 가져와 Base64 디코딩
      const recentPosts = await Promise.all(
        result
        .filter((file: any) => file.type === "file" && file.name.endsWith(".md"))
        .slice(0, 3)// 날짜 정렬이 필요하면 추가 가능
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
            `https://api.github.com/repos/jja8989/viba_blog/commits?path=post/2024/${file.name}`,
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
            sha: file.sha,
            tags,
            imageUrl,
            commitDate, // 커밋 날짜 추가
          };
        })
      );

      return NextResponse.json({ posts: recentPosts }, { status: 200 });
    } else {
      console.error("GitHub API Error:", result);
      return NextResponse.json(
        { message: "Error fetching posts", details: result },
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
