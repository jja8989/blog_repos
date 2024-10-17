const PostGrid = () => {
  const posts = [
    {
      id: 1,
      title: "2024 카카오 겨울 인턴십 코딩테스트 문제해설",
      author: "jack.pot",
      date: "2023.12.27",
      image: "/path/to/image1.jpg",
    },
    {
      id: 2,
      title: "[post Server!] 브런치개발파트에 대한 모든것!",
      author: "ted.song",
      date: "2022.10.31",
      image: "/path/to/image2.jpg",
    },
    // Add more posts as needed
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {post.author} ・ {post.date}
            </p>
            <button className="text-blue-500 hover:underline">Read more</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
