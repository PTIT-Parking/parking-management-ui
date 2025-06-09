// app/(auth)/reset-password/page.js
// KHÔNG CÓ "use client"; ở đây nữa

import { Suspense } from 'react';
import ResetPasswordForm from './ret'; // Import Client Component vừa tạo
import { Loader2 } from "lucide-react"; // Để sử dụng cho fallback của Suspense

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      {/* Fallback cho trường hợp load */}
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
          <p>Đang tải trang đặt lại mật khẩu...</p>
        </div>
      }>
        <ResetPasswordForm /> {/* Render Client Component ở đây */}
      </Suspense>
    </div>
  );
}