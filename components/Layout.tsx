import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {" "}
      {/* White background and black text */}
      <Topbar />
      <main className="flex-1 px-[20%] py-12">{children}</main>
      <Footer />
    </div>
  );
}
