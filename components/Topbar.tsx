import Link from "next/link";

const Topbar = () => {
  return (
    <header className="bg-[#1F2938] p-4 shadow">
      <nav className="flex justify-between items-center px-4 md:px-10">
        {/* VIBA button links to the home page */}
        <div className="flex">
          <Link
            href="/"
            className="text-white text-xl font-bold hover:underline"
          >
            VIBA
          </Link>
        </div>

        {/* Centered buttons */}
        <div className="flex-1 flex justify-center space-x-4">
          <Link href="/blog" className="text-white hover:underline">
            Blog
          </Link>
          <Link href="/events" className="text-white hover:underline">
            Events
          </Link>
          <Link href="/about" className="text-white hover:underline">
            About Us
          </Link>
        </div>

        {/* Search button stays on the right */}
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Search
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Topbar;
