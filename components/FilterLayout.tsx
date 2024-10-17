import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import React, { useState } from "react";

// 연도 필터 옵션 컴포넌트
function YearFilter({
  onFilterChange,
}: {
  onFilterChange: (year: string) => void;
}) {
  const years = ["2024", "2023", "2022", "2021", "2020"]; // 필터할 연도 목록
  const [selectedYear, setSelectedYear] = useState<string>(""); // 초기값 없음

  return (
    <div className="w-full p-4">
      <h2 className="font-bold text-lg mb-4">연도 필터</h2>
      <ul className="space-y-2">
        {years.map((year) => (
          <li key={year}>
            <button
              onClick={() => {
                setSelectedYear(year);
                onFilterChange(year); // 연도 변경 시 필터링 동작
              }}
              className={`${
                selectedYear === year ? "text-blue-500" : "text-black"
              } hover:text-blue-500`}
            >
              {year}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Layout 컴포넌트
export default function Layout({
  children,
  onFilterChange,
}: {
  children: React.ReactNode;
  onFilterChange: (year: string) => void;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Topbar />
      <div className="flex-1 flex">
        {/* Left side (20% width) */}
        <div className="w-[20%] border-r p-4">
          <YearFilter onFilterChange={onFilterChange} />
        </div>

        {/* Right side (remaining width), with right 20% padding */}
        <main className="flex-1 pr-[20%] px-12 py-12">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
