// components/Topbar.tsx
import Link from "next/link";

const Topbar = () => {
  return (
    <header className="bg-primary text-primary-content p-4 shadow">
      <nav className="flex justify-between items-center px-4 md:px-10">
        <div className="flex">
          <Link href="/" className="text-xl font-bold hover:text-accent">
            ViBA
          </Link>
        </div>
        <div className="flex-1 flex justify-center space-x-4">
          <Link href="/blog" className="hover:text-accent">
            Blog
          </Link>
          <Link href="/events" className="hover:text-accent">
            Events
          </Link>
          <Link href="/about" className="hover:text-accent">
            About Us
          </Link>
          <Link href="/bamboo" className="hover:text-accent">
            .
          </Link>
        </div>

        {/* Search button stays on the right */}
        <div>
          <button className="btn btn-secondary px-4 py-2 hover:btn-accent">
            Search
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Topbar;
