import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { slug } = await request.json();

  const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
  if (!GITHUB_ACCESS_TOKEN) {
    return NextResponse.json(
      { message: "GitHub Access Token missing" },
      { status: 500 }
    );
  }

  // GitHub 저장소에서 전체 파일 목록 가져오기
  const res = await fetch(
    `https://api.github.com/repos/jja8989/blog_repos/contents/post/2024`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorDetails = await res.json();
    return NextResponse.json(
      { message: errorDetails.message },
      { status: res.status }
    );
  }

  const files = await res.json();

  // 파일 목록에서 슬러그에 맞는 파일 찾기 (파일명 비교)
  const matchingFile = files.find((file: any) => file.name === `${slug}.md`);

  if (!matchingFile) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  // 해당 파일의 내용을 다시 요청
  const fileRes = await fetch(matchingFile.url, {
    headers: {
      Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!fileRes.ok) {
    const errorDetails = await fileRes.json();
    return NextResponse.json(
      { message: errorDetails.message },
      { status: fileRes.status }
    );
  }

  const fileData = await fileRes.json();

  if (!fileData.content) {
    return NextResponse.json({ message: "Content not found" }, { status: 404 });
  }

  // Base64 인코딩된 마크다운 파일의 내용을 UTF-8로 디코딩
  const content = Buffer.from(fileData.content, "base64").toString("utf-8");

  return NextResponse.json({ content });
}
