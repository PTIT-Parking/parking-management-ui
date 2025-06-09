"use client";

import Image from "next/image";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../../img/PTIT-parking-removebg-preview.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react"; // Thêm AlertCircle icon
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { cn } from "@/lib/utils"; 

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Tên đăng nhập không được để trống.",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu không được để trống.",
  }),
});

const LoginForm = () => {
  const router = useRouter();
  const { login, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setLoginError(null);

      const response = await login(data.username, data.password);

      if (response && response.code === 1000) {
        const userRole = response.result?.role;
        if (userRole === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/staff/dashboard");
        }
      } else {
        setLoginError(response?.message || "Thông tin đăng nhập không chính xác. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Login error: ", error);
      setLoginError(
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định khi đăng nhập."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl bg-gray-900 text-white border border-gray-800">
        <CardHeader className="text-center pb-4">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="flex items-center justify-center mb-2 bg-gray-800 rounded-xl p-3">
              <Image
                src={logo}
                alt="PTIT Parking Logo"
                width={160} 
                height={65}
                priority
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">Hệ thống quản lý bãi đỗ xe thông minh</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-12">
          {(loginError || authError) && (
            <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{loginError || authError}</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-300">
                      Tên đăng nhập
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-800 border border-gray-700 focus:border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0 placeholder:text-gray-500 text-white py-2.5 px-4 rounded-lg shadow-inner"
                        placeholder="Nhập tên đăng nhập của bạn"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-300">
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0 pr-10"
                        placeholder="Nhập mật khẩu"
                        disabled={isLoading}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={cn(
                  "w-full py-2.5 text-lg font-bold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105",
                  "bg-yellow-500 hover:bg-yellow-600 text-gray-950 shadow-lg",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-gray-950" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center pt-6">
          <Link href="/forgot-password">
            <Button
              variant="link"
              className="text-sm text-gray-400 hover:text-white hover:underline focus:text-white focus:underline px-0 transition-colors duration-200"
            >
              Quên mật khẩu?
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;