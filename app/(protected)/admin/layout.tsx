import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <div className="hidden md:block w-[300px]">
            <div className="sticky top-0 max-h-screen overflow-y-auto">
              <AdminSidebar />
            </div>
          </div>
          <div className="w-full flex-1 p-5 overflow-y-auto">{children}</div>
        </div>
      </div>
  );
};

export default AdminLayout;
