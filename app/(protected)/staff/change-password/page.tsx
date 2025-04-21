"use client";

import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function StaffChangePasswordPage() {
  return (
    <div className="w-full px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Đổi mật khẩu</h1>
        <p className="text-muted-foreground">Cập nhật mật khẩu tài khoản của bạn</p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}