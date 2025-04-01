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
  Car,
  CalendarDays,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react";

const StaffSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="h-full py-4 flex flex-col border-r bg-slate-50/50 dark:bg-slate-900/50">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold tracking-tight">STAFF PAGE</h2>
      </div>

      <div className="space-y-1 flex-1 px-4">
        {/* Dashboard - Trang chủ */}
        <Link href="/staff/dashboard">
          <div
            className={cn(
              "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
              isActive("/staff/dashboard") &&
                "bg-slate-100 text-slate-900 font-medium"
            )}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </div>
        </Link>

        <Accordion type="single" collapsible className="w-full border-0">
          <AccordionItem value="parking" className="border-0">
            <AccordionTrigger
              className={cn(
                "py-2 text-sm hover:bg-slate-100 hover:no-underline rounded-md",
                isActive("/staff/parking") && "bg-slate-100 font-medium"
              )}
            >
              <span className="flex w-full items-center">
                <Car className="mr-2 h-4 w-4" />
                Quản lý xe
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-6 py-0">
              <Link href="/staff/parking/entry">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/staff/parking/entry") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Ghi nhận xe vào
                </div>
              </Link>
              <Link href="/staff/parking/exit">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/staff/parking/exit") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Ghi nhận xe ra
                </div>
              </Link>
              <Link href="/staff/parking/records">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/staff/parking/records") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Xe đang trong bãi
                </div>
              </Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="monthly" className="border-0">
            <AccordionTrigger
              className={cn(
                "py-2 text-sm hover:bg-slate-100 hover:no-underline rounded-md",
                isActive("/staff/monthly") && "bg-slate-100 font-medium"
              )}
            >
              <span className="flex w-full items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                Thẻ tháng
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-6 py-0">
              <Link href="/staff/monthly/register">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/staff/monthly/create") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Đăng ký thẻ tháng
                </div>
              </Link>
              <Link href="/staff/monthly/list">
                <div
                  className={cn(
                    "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
                    isActive("/staff/monthly/list") &&
                      "bg-slate-100 text-slate-900 font-medium"
                  )}
                >
                  Danh sách thẻ tháng
                </div>
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Missing Vehicle Reports - đơn giản hóa */}
        <Link href="/staff/missing">
          <div
            className={cn(
              "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
              isActive("/staff/missing") &&
                "bg-slate-100 text-slate-900 font-medium"
            )}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Báo mất thẻ xe
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StaffSidebar;
