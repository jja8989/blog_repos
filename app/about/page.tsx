"use client"; // 클라이언트 컴포넌트로 지정

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

const imageNames = ['최진우.jpeg', '박정진.jpg', '신성구.jpg', '김유연.jpg'];

export default function AboutUs() {
  
  // image load...
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // 이미지 이름을 쿼리 매개변수로 전달
        const response = await fetch(`/api/load-profile-image?names=${encodeURIComponent(imageNames.join(','))}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }

        const data = await response.json();
        setImages(data.images); // API에서 반환된 이미지 데이터 설정
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  // member calls
  const teamMembers = [
    {
      name: "최진우",
      interest: "Visualization",
      email: "jja8989@snu.ac.kr",
      image: "최진우.jpg", // Example image path
      comment: "아무거나 한마디 부탁함다!"
    },
    {
      name: "박정진",
      interest: "GNN",
      email: "pkmon1d@snu.ac.kr",
      image: "박정진.jpg",
      comment: "아무거나 한마디 부탁함다!"
    },
    {
      name: "신성구",
      interest: "Business Analysis",
      email: "ksofg@snu.ac.kr",
      image: "신성구.jpg",
      comment: "졸업하고 싶슴다! 인텔 아마존 CNS 가고 싶슴다!"
    },
    {
      name: "김유연",
      interest: "Visualization",
      email: "swannekim@snu.ac.kr",
      image: "김유연.jpg",
      comment: "아무거나 한마디 부탁함다!"
    }
    // Add more team members...
  ];
  
  // layouts
  return (
    <Layout>
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-gray-600">
          Meet our talented team dedicated to pushing the boundaries of
          innovation.
        </p>
      </section>
      <section>
        <br></br>
        <br></br>
        <h2 className="text-2xl font-bold mb-4">Masters</h2>
        <p>(석사라는 뜻 X, 블로그 주인장들)</p>
        <br></br>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {teamMembers.map((member) => {
          const memberImage = images.find((img) => img.name === member.image);
          return (
          <div
            key={member.name}
            className="bg-white shadow-md p-6 rounded-md text-center"
          >
            <div className="relative w-96 mx-auto pb-[100%] mb-4">
              {" "}
              {/* Set a fixed width */}
              <img
                  src={memberImage ? memberImage.url : "./placeholder.jpg"} // 이미지 URL이 있으면 사용, 없으면 플레이스홀더
                  alt={member.name}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                />
            </div>
            <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.email}</p>
            <p className="text-gray-600 mt-2">{member.interest}</p>
            <p className="text-gray-600 mt-2">{member.comment}</p>
          </div>
          );
        })}
      </section>
    </Layout>
  );
}
