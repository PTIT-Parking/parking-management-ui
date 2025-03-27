import Image from "next/image";
import Link from "next/link";
import logo from "../img/PTIT-parking-removebg-preview.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import ThemeToggler from "./ThemeToggler";

const Navbar = () => {
  const username = "Admin";

  return (
    <div className="bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between">
      <Link href="/">
        <Image src={logo} alt="Ptit Parking" width={100}></Image>
      </Link>

      <div className="flex items-center">
        <ThemeToggler />
        <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
          <User className="h-5 w-5" />
          <span>{username}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile" className="w-full">
              Hồ sơ
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500 cursor-pointer">
            <Link href="/auth" className="w-full">
              Đăng xuất
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      
    </div>
  );
};

export default Navbar;
