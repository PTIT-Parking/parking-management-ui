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
      <Navbar />
      <div className="flex">
        <div className="hidden md:block h-[100vh] w-[300px]">
          <StaffSidebar />
        </div>
        <div className="p-5 w-full">{children}</div>
      </div>
    </>
  );
};

export default StaffLayout;
