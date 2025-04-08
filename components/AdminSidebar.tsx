"use client";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  Users,
  History,
  PoundSterling,
  LayoutDashboard,
} from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Hàm để xử lý điều hướng và đóng sidebar trên mobile
  const handleNavigation = (href: string) => {
    router.push(href);
    // Tạo và dispatch event để đóng sidebar trên mobile
    const customEvent = new CustomEvent("closeMobileSidebar");
    document.dispatchEvent(customEvent);
  };

  return (
    <div className="h-full py-4 flex flex-col border-r bg-slate-50">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold tracking-tight">ADMIN PAGE</h2>
      </div>

      <div className="space-y-1 flex-1 px-4">
        {/* Dashboard - Trang chủ */}
        <div
          className={cn(
            "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
            isActive("/admin/dashboard") &&
              "bg-slate-100 text-slate-900 font-medium"
          )}
          onClick={() => handleNavigation("/admin/dashboard")}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </div>

        <Accordion type="single" collapsible className="w-full border-0">
          <AccordionItem value="staff" className="border-0">
            <AccordionTrigger
              className={cn(
                "py-2 text-sm hover:bg-slate-100 hover:no-underline rounded-md",
                isActive("/admin/staff") && "bg-slate-100 font-medium"
              )}
            >
              <span className="flex w-full items-center">
                <Users className="mr-2 h-4 w-4" />
                Quản lý nhân viên
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-6 py-0">
              <div
                className={cn(
                  "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
                  isActive("/admin/staff/staff-list") &&
                    "bg-slate-100 text-slate-900 font-medium"
                )}
                onClick={() => handleNavigation("/admin/staff/staff-list")}
              >
                Danh sách nhân viên
              </div>
              <div
                className={cn(
                  "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
                  isActive("/admin/staff/add-staff") &&
                    "bg-slate-100 text-slate-900 font-medium"
                )}
                onClick={() => handleNavigation("/admin/staff/add-staff")}
              >
                Thêm nhân viên mới
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="history" className="border-0">
            <AccordionTrigger
              className={cn(
                "py-2 text-sm hover:bg-slate-100 hover:no-underline rounded-md",
                isActive("/admin/history") && "bg-slate-100 font-medium"
              )}
            >
              <span className="flex w-full items-center">
                <History className="mr-2 h-4 w-4" />
                Lịch sử
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-6 py-0">
              <div
                className={cn(
                  "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
                  isActive("/admin/history/parking-records") &&
                    "bg-slate-100 text-slate-900 font-medium"
                )}
                onClick={() =>
                  handleNavigation("/admin/history/parking-records")
                }
              >
                Xe ra vào
              </div>

              <div
                className={cn(
                  "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
                  isActive("/admin/history/monthly-cards") &&
                    "bg-slate-100 text-slate-900 font-medium"
                )}
                onClick={() => handleNavigation("/admin/history/monthly-cards")}
              >
                Đăng ký thẻ tháng
              </div>

              <div
                className={cn(
                  "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
                  isActive("/admin/history/missing-reports") &&
                    "bg-slate-100 text-slate-900 font-medium"
                )}
                onClick={() =>
                  handleNavigation("/admin/history/missing-reports")
                }
              >
                Báo cáo mất xe
              </div>

              <div
                className={cn(
                  "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
                  isActive("/admin/history/payments") &&
                    "bg-slate-100 text-slate-900 font-medium"
                )}
                onClick={() => handleNavigation("/admin/history/payments")}
              >
                Giao dịch
              </div>
            </AccordionContent>
          </AccordionItem>

          <div
            className={cn(
              "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
              isActive("/admin/prices") &&
                "bg-slate-100 text-slate-900 font-medium"
            )}
            onClick={() => handleNavigation("/admin/prices")}
          >
            <PoundSterling className="mr-2 h-4 w-4" />
            Quản lý giá xe
          </div>

          <AccordionItem value="statistics" className="border-0">
            <AccordionTrigger
              className={cn(
                "py-2 text-sm hover:bg-slate-100 hover:no-underline rounded-md",
                isActive("/admin/statistic") && "bg-slate-100 font-medium"
              )}
            >
              <span className="flex w-full items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                Thống kê
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-6 py-0">
              <div
                className={cn(
                  "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
                  isActive("/admin/statistic/revenue") &&
                    "bg-slate-100 text-slate-900 font-medium"
                )}
                onClick={() => handleNavigation("/admin/statistic/revenue")}
              >
                Doanh thu tháng
              </div>
              <div
                className={cn(
                  "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md cursor-pointer",
                  isActive("/admin/statistic/traffic") &&
                    "bg-slate-100 text-slate-900 font-medium"
                )}
                onClick={() => handleNavigation("/admin/statistic/traffic")}
              >
                Lượt xe ra vào
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default AdminSidebar;
