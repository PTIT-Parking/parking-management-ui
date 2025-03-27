import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Toaster } from "sonner";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="hidden md:block h-[100vh] w-[300px]">
          <AdminSidebar />
        </div>
        <div className="p-5 w-full md:max-w-[1140px]">{children}</div>
        <Toaster richColors position="top-right" />
      </div>
    </>
  );
};

export default AdminLayout;
