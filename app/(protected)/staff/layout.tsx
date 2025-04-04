"use client";

import Navbar from "@/components/Navbar";
import StaffSidebar from "@/components/StaffSidebar";

const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0"
          rel="stylesheet"
        />
      </head>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <div className="hidden md:block w-[300px]">
            {/* Wrapper để tạo không gian cho sidebar, chiếm vị trí trong layout */}
            <div className="sticky top-0 max-h-screen overflow-y-auto">
              <StaffSidebar />
            </div>
          </div>
          <div className="w-full flex-1 p-5 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
};

export default StaffLayout;
