import Layout from "@/components/Layout";

const teamMembers = [
  {
    name: "John Doe",
    role: "Lead Developer",
    bio: "John is a seasoned developer with over 10 years of experience in full-stack development.",
    image: "/images/john.jpg", // Example image path
  },
  {
    name: "Jane Smith",
    role: "UI/UX Designer",
    bio: "Jane specializes in user-centered design and has worked on numerous high-profile projects.",
    image: "/images/jane.jpg",
  },
  // Add more team members...
];

export default function AboutUs() {
  return (
    <Layout>
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-gray-600">
          Meet our talented team dedicated to pushing the boundaries of
          innovation.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="bg-white shadow-md p-6 rounded-md text-center"
          >
            <div className="relative w-64 mx-auto pb-[133.33%] mb-4">
              {" "}
              {/* Set a fixed width */}
              <img
                src={member.image}
                alt={member.name}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.role}</p>
            <p className="text-gray-600 mt-2">{member.bio}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}
