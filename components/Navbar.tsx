"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../img/PTIT-parking-removebg-preview.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, UserCircle, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Hiển thị username trực tiếp
  const displayName = user?.username || "Tài khoản";

  // Xác định đường dẫn dashboard theo role
  const dashboardUrl =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/staff/dashboard";

  const profileUrl =
    user?.role === "ADMIN" ? "/admin/my-info" : "/staff/my-info";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công");
      router.replace("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error("Đã xảy ra lỗi khi đăng xuất");
    }
  };

  return (
    <div className="bg-gray-900 text-white py-2 px-5 flex justify-between items-center z-20">
      <div className="flex items-center bg-gray-900">
        {children}
        <Link href={dashboardUrl} className="flex items-center">
          <Image
            src={logo}
            alt="Ptit Parking"
            width={100}
            height={40}
            priority
          />
        </Link>
      </div>

      <div className="flex items-center ">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center focus:outline-none hover:bg-primary-600/20 py-1 px-2 rounded-md transition-colors hover:text-gray-400">
            <div className="h-8 w-8 rounded-full bg-primary-600/30 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <span className="max-w-[150px] truncate ml-2">{displayName}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-yellow-100  ">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.name || displayName}</span>
                {/* Hiển thị vai trò */}
                {user?.role && (
                  <span className="text-xs text-gray-500">
                    {user.role === "ADMIN" ? "Quản trị viên" : "Nhân viên"}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            
           <DropdownMenuSeparator />

            {user?.role !== "ADMIN" && (
              <> {/* Sử dụng Fragment để nhóm các mục mà không thêm node DOM thừa */}
                <DropdownMenuItem className="focus:bg-yellow-200 dark:hover:bg-yellow-700">
                  <Link href={profileUrl} className="w-full flex items-center ">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                {/* Đường phân cách này chỉ hiển thị nếu "Hồ sơ cá nhân" hiển thị, ví dụ trước các mục cuối cùng (ví dụ: đăng xuất) */}
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem className="focus:bg-yellow-200 dark:hover:bg-yellow-700">
              <Link
                href={
                  user?.role === "ADMIN"
                    ? "/admin/change-password"
                    : "/staff/change-password"
                }
                className="w-full flex items-center"
              >
                <Lock className="mr-2 h-4 w-4" />
                <span>Đổi mật khẩu</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-yellow-200"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
