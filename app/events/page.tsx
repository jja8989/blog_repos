import Layout from "@/components/Layout";

export default function Events() {
  return (
    <Layout>
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Events</h1>
        <p className="text-xl text-gray-600">
          Discover our upcoming events and join us!
        </p>
      </section>

      {/* Add event-related content here */}
      {/* 구글 캘린더 임베드 */}
      <div className="flex justify-center">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=ksofg%40snu.ac.kr&ctz=Asia%2FSeoul" // 여기에 복사한 구글 캘린더 임베드 링크를 삽입
          style={{ border: "0" }}
          width="800"
          height="600"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </div>
    
    </Layout>
  );
}
