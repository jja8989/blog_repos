import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
  if (!GITHUB_ACCESS_TOKEN) {
    console.error("GitHub Access Token is missing");
    return NextResponse.json(
      { message: "GitHub Access Token missing" },
      { status: 500 }
    );
  }

  // 쿼리 매개변수에서 이미지 이름 가져오기
  const url = new URL(request.url);
  const imageNamesParam = url.searchParams.get("names");

  // imageNamesParam이 null이 아니면 split, 그렇지 않으면 빈 배열로 설정
  const imageNames = imageNamesParam ? imageNamesParam.split(",") : [];

  if (imageNames.length === 0) {
    return NextResponse.json(
      { message: "No image names provided" },
      { status: 400 }
    );
  }

  const images = [];

  for (const name of imageNames) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/jja8989/blog_repos/contents/images/${encodeURIComponent(name)}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
          },
          cache: "no-store",
        }
      );

      console.log(`Response status for ${name}:`, res.status);
      console.log("Rate limit remaining:", res.headers.get("X-RateLimit-Remaining"));

      if (!res.ok) {
        const errorDetails = await res.json();
        console.error(`Error fetching image ${name}:`, errorDetails);
        continue; // 다음 이미지로 넘어감
      }

      const imageData = await res.json();
      console.log("Fetched image data:", imageData);

      if (imageData && imageData.content) {
        const imageUrl = `data:${imageData.type};base64,${imageData.content}`;
        images.push({
          name: name,
          url: imageUrl,
        });
      }
    } catch (error) {
      console.error(`Unexpected error processing image ${name}:`, error);
    }
  }

  return NextResponse.json({ images }, { status: 200 });
}
