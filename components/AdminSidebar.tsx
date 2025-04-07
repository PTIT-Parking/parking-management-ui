"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="h-full py-4 flex flex-col border-r bg-slate-50/50 dark:bg-slate-900/50">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold tracking-tight">ADMIN PAGE</h2>
      </div>

      <div className="space-y-1 flex-1 px-4">
        {/* Dashboard - Trang chủ */}
        <Link href="/admin/dashboard">
          <div
            className={cn(
              "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
              isActive("/admin/dashboard") &&
                "bg-slate-100 text-slate-900 font-medium"
            )}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </div>
        </Link>

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
              <Link href="/admin/staff/staff-list">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    pathname === "/admin/staff" &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Danh sách nhân viên
                </div>
              </Link>
              <Link href="/admin/staff/add-staff">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/admin/staff/new") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Thêm nhân viên mới
                </div>
              </Link>
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
              <Link href="/admin/history/parking-records">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/admin/history/parking-records") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Xe ra vào
                </div>
              </Link>

              <Link href="/admin/history/monthly-cards">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/admin/history/monthly-cards") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Đăng ký thẻ tháng
                </div>
              </Link>

              <Link href="/admin/history/missing-reports">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/admin/history/missing-reports") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Báo cáo mất xe
                </div>
              </Link>

              <Link href="/admin/history/payments">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/admin/history/payments") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Giao dịch
                </div>
              </Link>
            </AccordionContent>
          </AccordionItem>

          <Link href="/admin/prices">
          <div
            className={cn(
              "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
              isActive("/admin/prices") &&
                "bg-slate-100 text-slate-900 font-medium"
            )}
          >
            <PoundSterling className="mr-2 h-4 w-4" />
            Quản lý giá xe
          </div>
        </Link>

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
              <Link href="/admin/statistic/revenue">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/admin/statistic/revenue") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Doanh thu tháng
                </div>
              </Link>
              <Link href="/admin/statistic/traffic">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/admin/statistic/traffic") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Lượt xe ra vào
                </div>
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default AdminSidebar;
