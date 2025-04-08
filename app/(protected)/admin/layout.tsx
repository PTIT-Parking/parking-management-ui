"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Xử lý sự kiện đóng sidebar khi click vào menu item trên mobile
  useEffect(() => {
    const handleCloseSidebar = () => {
      setShowMobileSidebar(false);
    };

    document.addEventListener("closeMobileSidebar", handleCloseSidebar);

    return () => {
      document.removeEventListener("closeMobileSidebar", handleCloseSidebar);
    };
  }, []);

  return (
    <>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0"
          rel="stylesheet"
        />
      </head>
      <div className="flex flex-col min-h-screen">
        <Navbar>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </Navbar>

        <div className="flex flex-1 relative">
          {/* Mobile sidebar overlay */}
          {showMobileSidebar && (
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          {/* Mobile sidebar */}
          <div
            className={`
              ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"}
              fixed md:hidden left-0 top-[56px] h-[calc(100vh-56px)] 
              w-[280px] z-40 transition-transform duration-300 ease-in-out
              bg-slate-50 shadow-lg
            `}
          >
            <div className="relative h-full overflow-y-auto">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setShowMobileSidebar(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <AdminSidebar />
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden md:block w-[300px]">
            <div className="sticky top-0 max-h-screen overflow-y-auto">
              <AdminSidebar />
            </div>
          </div>

          {/* Main content */}
          <div className="w-full flex-1 p-5 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
