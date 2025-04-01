import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useFetchWithAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUnauthorized = useCallback(() => {
    // Hiển thị thông báo
    toast.warning("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại", {
      duration: 5000,
    });
    
    // Làm sạch dữ liệu đăng nhập
    localStorage.removeItem("token");
    
    // Lưu URL hiện tại để quay lại sau khi đăng nhập
    const currentPath = window.location.pathname;
    localStorage.setItem("redirectAfterLogin", currentPath);
    
    // Chuyển hướng đến trang đăng nhập
    router.push("/login");
  }, [router]);

  const fetchWithAuth = useCallback(async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        handleUnauthorized();
        throw new Error("Unauthorized: No token available");
      }
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Xử lý 401 Unauthorized
      if (response.status === 401) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }
      
      // Đọc response body dù status code là gì
      const responseData = await response.json() as T;
      
      // trả về dữ liệu API để component xử lý
      return responseData;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  return { fetchWithAuth, loading };
}