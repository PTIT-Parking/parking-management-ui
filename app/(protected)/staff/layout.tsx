"use client";

import Navbar from "@/components/Navbar";
import StaffSidebar from "@/components/StaffSidebar";

const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
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