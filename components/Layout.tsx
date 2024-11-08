// components/Layout.tsx
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      {" "}
      <Topbar />
      <main className="flex-1 px-[15%] py-12">{children}</main>
      <Footer />
    </div>
  );
}

// // components/Layout.tsx
// import Topbar from "@/components/Topbar";
// import Footer from "@/components/Footer";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex flex-col min-h-screen bg-base-100 text-base-content px-[20%]"> {/* Apply padding to outer div */}
//       <Topbar />
//       <main className="flex-1 py-12">{children}</main> {/* Removed horizontal padding from main */}
//       <Footer />
//     </div>
//   );
// }
