"use client";

import * as z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS, buildApiUrl } from "@/config/api";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<ResetPasswordFormValues | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Kiểm tra token ngay khi trang được load
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setError("Link đặt lại mật khẩu không hợp lệ");
        setIsValidating(false);
        return;
      }

      try {
        // Gọi API để kiểm tra tính hợp lệ của token
        const response = await fetch(
          buildApiUrl(
            `${API_ENDPOINTS.AUTH.VALIDATE_RESET_TOKEN}?token=${token}`
          ),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        // Kiểm tra kết quả từ API
        if (data.code === 1000) {
          setIsTokenValid(data.result);
        } else {
          setIsTokenValid(false);
          setError("Không thể xác minh tính hợp lệ của link đặt lại mật khẩu");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
        setError("Đã xảy ra lỗi khi kiểm tra tính hợp lệ của link");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  // Xử lý sự kiện submit form
  const handleFormSubmit = (values: ResetPasswordFormValues) => {
    setPendingValues(values);
    setShowConfirmDialog(true);
  };

  // Thực hiện việc đặt lại mật khẩu sau khi người dùng đã xác nhận
  const resetPassword = async () => {
    if (!token || !isTokenValid || !pendingValues) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            newPassword: pendingValues.password,
          }),
        }
      );

      const data = await response.json();

      if (data.code === 1000) {
        setIsSuccess(true);
        form.reset();
      } else if (data.code === 1011) {
        setIsTokenValid(false);
        setError("Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ");
      } else if (data.code === 1003) {
        setError("Mật khẩu phải có ít nhất 8 ký tự");
      } else if (data.code === 1009) {
        setError("Mật khẩu mới không được trùng với mật khẩu cũ");
      } else {
        setError(data.message || "Đã xảy ra lỗi khi đặt lại mật khẩu");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Đã xảy ra lỗi khi kết nối đến máy chủ");
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị trạng thái đang kiểm tra token
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Đang xác thực
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-center text-muted-foreground">
              Đang kiểm tra tính hợp lệ của link đặt lại mật khẩu...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {isSuccess
              ? "Đặt lại mật khẩu thành công"
              : isTokenValid
              ? "Đặt lại mật khẩu"
              : "Link đã hết hạn"}
          </CardTitle>
          {!isSuccess && isTokenValid && (
            <CardDescription className="text-center">
              Nhập mật khẩu mới của bạn
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="py-4">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Mật khẩu đã được đặt lại thành công
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Bạn có thể đăng nhập bằng mật khẩu mới của mình ngay bây
                        giờ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : isTokenValid ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu mới"
                          disabled={isLoading}
                          className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập lại mật khẩu mới"
                          disabled={isLoading}
                          className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div>
                  <div>
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-amber-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-amber-800">
                        Link đặt lại mật khẩu đã hết hạn
                      </h3>
                    </div>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        Link đặt lại mật khẩu của bạn đã hết hạn hoặc đã được sử
                        dụng. Vui lòng yêu cầu một link mới từ trang đăng nhập.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Bạn có thể yêu cầu gửi lại link đặt lại mật khẩu tại trang Quên
                mật khẩu.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            asChild
          >
            <Link href={isTokenValid === false ? "/forgot-password" : "/login"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isTokenValid === false
                ? "Yêu cầu link mới"
                : "Quay lại trang đăng nhập"}
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog xác nhận đặt lại mật khẩu */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đặt lại mật khẩu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đặt lại mật khẩu không? Mật khẩu mới sẽ được
              kích hoạt ngay lập tức.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false);
                resetPassword();
              }}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
