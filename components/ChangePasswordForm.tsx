"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth";
import { API_ENDPOINTS, buildApiUrl } from "@/config/api";

// Schema validation với Zod
const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Mật khẩu cũ không được để trống"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
    confirmPassword: z
      .string()
      .min(1, "Xác nhận mật khẩu không được để trống"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function ChangePasswordForm() {
  const { fetchWithAuth, loading: apiLoading } = useFetchWithAuth();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  // Khởi tạo form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Xử lý khi submit form - hiển thị dialog xác nhận
  const handleSubmit = (values: FormValues) => {
    setPendingValues(values);
    setShowConfirmDialog(true);
  };

  // Xử lý khi xác nhận đổi mật khẩu
  const handleConfirmChangePassword = async () => {
    if (!pendingValues) return;

    try {
      setLoading(true);
      setShowConfirmDialog(false);

      const apiUrl = buildApiUrl(API_ENDPOINTS.AUTH.CHANGE_PASSWORD);
      const data = await fetchWithAuth<{ code: number; result?: string; message?: string }>(
        apiUrl,
        {
          method: "PUT",
          body: JSON.stringify({
            oldPassword: pendingValues.oldPassword,
            newPassword: pendingValues.newPassword,
          }),
        }
      );

      if (data.code === 1000) {
        toast.success("Đổi mật khẩu thành công");
        form.reset();
      } else if (data.code === 1008) {
        form.setError("oldPassword", {
          type: "manual",
          message: "Mật khẩu cũ không chính xác",
        });
        toast.error("Mật khẩu cũ không chính xác");
      } else {
        toast.error(data.message || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      toast.error("Đã xảy ra lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
      setPendingValues(null);
    }
  };

  const isLoading = loading || apiLoading;

  return (
    <div className="max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Đổi mật khẩu</CardTitle>
          <CardDescription>
            Nhập mật khẩu cũ và mật khẩu mới để thay đổi mật khẩu của bạn
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-5">
              {/* Trường mật khẩu cũ */}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu cũ</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu hiện tại"
                          disabled={isLoading}
                          {...field}
                          className="pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        tabIndex={-1}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trường mật khẩu mới */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          disabled={isLoading}
                          {...field}
                          className="pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trường xác nhận mật khẩu mới */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu mới"
                          disabled={isLoading}
                          {...field}
                          className="pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="pt-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Đổi mật khẩu
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Dialog xác nhận đổi mật khẩu */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đổi mật khẩu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đổi mật khẩu không? Sau khi đổi, bạn sẽ cần sử dụng mật khẩu mới để đăng nhập.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={loading}>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmChangePassword} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}