"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Car,
  CalendarDays,
  AlertTriangle,
  CircleDollarSign,
  LayoutDashboard
} from "lucide-react";

const StaffSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="h-full py-4 flex flex-col border-r">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Parking Management
        </h2>
      </div>
      <div className="space-y-1 flex-1">
      <Link href="/staff/dashboard">
          <div 
            className={cn(
              "flex w-full items-center py-2 text-sm transition-all hover:bg-slate-100 rounded-md",
              isActive("/staff/dashboard") && "bg-slate-100 text-slate-900 font-medium"
            )}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </div>
        </Link>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="parking" className="border-0">
            <AccordionTrigger className={cn(
              "px-4 py-2 rounded-md hover:bg-slate-100 hover:no-underline",
              isActive("/staff/parking") && "bg-slate-100"
            )}>
              <span className="flex items-center">
                <Car className="mr-2 h-4 w-4" />
                Parking Management
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-1">
                <Link href="/staff/parking/entry">
                  <Button
                    variant={isActive("/staff/parking/entry") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    Vehicle Entry
                  </Button>
                </Link>
                <Link href="/staff/parking/exit">
                  <Button
                    variant={isActive("/staff/parking/exit") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    Vehicle Exit
                  </Button>
                </Link>
                <Link href="/staff/parking/records">
                  <Button
                    variant={isActive("/staff/parking/records") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    Current Records
                  </Button>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="monthly" className="border-0">
            <AccordionTrigger className={cn(
              "px-4 py-2 rounded-md hover:bg-slate-100 hover:no-underline",
              isActive("/staff/monthly") && "bg-slate-100"
            )}>
              <span className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                Monthly Registration
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-1">
                <Link href="/staff/monthly/create">
                  <Button
                    variant={isActive("/staff/monthly/create") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    Create Registration
                  </Button>
                </Link>
                <Link href="/staff/monthly/list">
                  <Button
                    variant={isActive("/staff/monthly/list") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    View Registrations
                  </Button>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="payment" className="border-0">
            <AccordionTrigger className={cn(
              "px-4 py-2 rounded-md hover:bg-slate-100 hover:no-underline",
              isActive("/staff/payment") && "bg-slate-100"
            )}>
              <span className="flex items-center">
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Payments
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-1">
                <Link href="/staff/payment/process">
                  <Button
                    variant={isActive("/staff/payment/process") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    Process Payment
                  </Button>
                </Link>
                <Link href="/staff/payment/history">
                  <Button
                    variant={isActive("/staff/payment/history") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    Payment History
                  </Button>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Link href="/staff/missing">
          <Button
            variant={isActive("/staff/missing") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Missing Vehicle Reports
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default StaffSidebar;