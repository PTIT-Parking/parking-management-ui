"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface VehicleStats {
  motorbike: number;
  scooter: number;
  bicycle: number;
  total: number;
}

interface VehicleRecord {
  licensePlate: string;
  vehicleType: "Bicycle" | "Motorbike" | "Scooter";
  ticketType: "DAILY" | "MONTHLY";
  timestamp: string;
  eventType: "ENTRY" | "EXIT";
}

interface ApiResponse {
  code: number;
  result: VehicleRecord[];
  message: string;
}

const ITEMS_PER_PAGE = 5; // Số lượng record trên mỗi trang

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [currentStats, setCurrentStats] = useState<VehicleStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<VehicleRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy token xác thực từ localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn");
        }

        // Gọi API với token xác thực
        const response = await fetch(
          "http://localhost:8080/api/parking/today",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const data: ApiResponse = await response.json();

        if (data.code === 1000) {
          // Lưu trữ dữ liệu hoạt động
          const sortedActivity = [...data.result].sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          setRecentActivity(sortedActivity);
          setTotalPages(Math.ceil(sortedActivity.length / ITEMS_PER_PAGE));

          // Tính toán số lượng xe hiện tại từ dữ liệu API
          const stats = calculateVehicleStats(data.result);
          setCurrentStats(stats);
        } else {
          throw new Error(
            "Lỗi khi lấy dữ liệu: " + (data.message || "Không xác định")
          );
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hàm tính toán thống kê xe từ dữ liệu API
  const calculateVehicleStats = (records: VehicleRecord[]): VehicleStats => {
    // Khởi tạo đối tượng theo dõi xe trong bãi
    const currentVehicles: Record<string, VehicleRecord> = {};

    // Duyệt qua tất cả các bản ghi theo thứ tự thời gian
    // Chúng ta sắp xếp để đảm bảo xử lý theo đúng thứ tự thời gian
    const sortedRecords = [...records].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    for (const record of sortedRecords) {
      if (record.eventType === "ENTRY") {
        // Xe vào bãi, thêm vào tracking
        currentVehicles[record.licensePlate] = record;
      } else if (record.eventType === "EXIT") {
        // Xe ra khỏi bãi, xóa khỏi tracking
        delete currentVehicles[record.licensePlate];
      }
    }

    // Đếm số lượng xe hiện tại theo loại
    let motorbike = 0;
    let scooter = 0;
    let bicycle = 0;

    Object.values(currentVehicles).forEach((vehicle) => {
      switch (vehicle.vehicleType) {
        case "Motorbike":
          motorbike++;
          break;
        case "Scooter":
          scooter++;
          break;
        case "Bicycle":
          bicycle++;
          break;
      }
    });

    const total = motorbike + scooter + bicycle;

    return {
      motorbike,
      scooter,
      bicycle,
      total,
    };
  };

  // Lấy các record cho trang hiện tại
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return recentActivity.slice(startIndex, endIndex);
  };

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số lượng nút trang tối đa hiển thị

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang nhỏ hơn hoặc bằng số lượng nút tối đa, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Nếu tổng số trang lớn hơn số lượng nút tối đa
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Xử lý sự kiện thay đổi trang
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Format thời gian thân thiện với người dùng
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) {
      return timestamp; // Nếu không parse được, trả về nguyên giá trị
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentData = getPaginatedData();
  const pageNumbers = getPageNumbers();

  // Tính số lượng xe vào và ra hôm nay
  const entriesCount = recentActivity.filter(
    (record) => record.eventType === "ENTRY"
  ).length;
  const exitsCount = recentActivity.filter(
    (record) => record.eventType === "EXIT"
  ).length;

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500">
          Tổng quan tình hình bãi đỗ xe ngày {today}
        </p>
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600 font-medium flex items-center">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </span>
              {error}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Thống kê tổng số xe */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Tổng số xe hiện tại
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Số xe đang có trong bãi
            </p>
          </CardContent>
        </Card>

        {/* Thống kê xe máy */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Xe máy</CardTitle>
            <div className="p-1 rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-blue-600"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 16v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"></path>
                <path d="M18 14c.2 0 3 1.3 3 4v1h-5"></path>
                <path d="M5 19h15a2 2 0 0 0 1.83-2.82L20 10"></path>
                <path d="M6 14c-.2 0-3 1.3-3 4v1h5"></path>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {currentStats?.motorbike || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {entriesCount > 0 && (
                <span className="text-green-600 mr-1 flex items-center text-xs gap-0.5">
                  <TrendingUp className="h-3 w-3" /> {entriesCount} vào
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Thống kê xe tay ga */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Xe tay ga</CardTitle>
            <div className="p-1 rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-green-600"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 19h15a2 2 0 0 0 1.84-2.75L16.5 5"></path>
                <path d="M5 19v-8l2-2h5l2 3h4l.5 1"></path>
                <circle cx="5" cy="19" r="2"></circle>
                <circle cx="15" cy="19" r="2"></circle>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {currentStats?.scooter || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {exitsCount > 0 && (
                <span className="text-red-600 mr-1 flex items-center text-xs gap-0.5">
                  <TrendingDown className="h-3 w-3" /> {exitsCount} ra
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Thống kê xe đạp */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Xe đạp</CardTitle>
            <div className="p-1 rounded-full bg-yellow-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-yellow-600"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="5.5" cy="17.5" r="3.5"></circle>
                <circle cx="18.5" cy="17.5" r="3.5"></circle>
                <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5 1.5-5 4-3-5-1-2 4-4 5"></path>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {currentStats?.bicycle || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {/* Có thể hiển thị thêm thông tin nếu cần */}
              &nbsp;
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription className="mt-1">
              Các xe ra/vào bãi gần đây nhất ({recentActivity.length} hoạt động)
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800">
                  <TableHead className="font-medium py-3 pl-6">
                    Biển số xe
                  </TableHead>
                  <TableHead className="font-medium py-3">Loại xe</TableHead>
                  <TableHead className="font-medium py-3">Thời gian</TableHead>
                  <TableHead className="font-medium py-3">Loại vé</TableHead>
                  <TableHead className="font-medium py-3 pr-6">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Activity className="h-10 w-10 mb-2 opacity-20" />
                        <span>Không có hoạt động nào</span>
                        <span className="text-sm mt-1">
                          Các hoạt động xe ra/vào sẽ hiển thị ở đây
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((record, index) => (
                    <TableRow
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/50 dark:bg-slate-900/50"
                      }
                    >
                      <TableCell className="font-medium pl-6">
                        {record.licensePlate}
                      </TableCell>
                      <TableCell>
                        {record.vehicleType === "Bicycle" && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
                            Xe đạp
                          </span>
                        )}
                        {record.vehicleType === "Motorbike" && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                            Xe máy
                          </span>
                        )}
                        {record.vehicleType === "Scooter" && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                            Xe tay ga
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatTimestamp(record.timestamp)}
                      </TableCell>
                      <TableCell>
                        {record.ticketType === "MONTHLY" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200"
                          >
                            Vé tháng
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 border-blue-200"
                          >
                            Vé ngày
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="pr-6">
                        {record.eventType === "ENTRY" ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m15 14 5-5-5-5"></path>
                              <path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>
                            </svg>
                            Vào
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 10-5 5 5 5"></path>
                              <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                            </svg>
                            Ra
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="py-4 border-t px-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {pageNumbers[0] > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {pageNumbers[0] > 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {pageNumbers.map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={pageNumber === currentPage}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                      {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
