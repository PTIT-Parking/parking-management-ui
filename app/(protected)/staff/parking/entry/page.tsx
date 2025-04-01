"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Car, Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth";

// Định nghĩa interface cho loại xe
interface VehicleType {
  id: string;
  name: string;
}

interface VehicleTypesResponse {
  code: number;
  message?: string;
  result?: VehicleType[];
}

// Định nghĩa interface cho kết quả API
interface EntryResponse {
  code: number;
  message?: string;
  result?: {
    recordId: string;
    licensePlate: string;
    identifier: string;
    vehicleType: {
      id: string;
      name: string;
    };
    cardId: number;
    entryTime: string;
    type: string;
    staffIn: {
      accountId: string;
      username: string;
    };
  };
}

// Định nghĩa schema xác thực form dùng Zod (giữ nguyên)
const formSchema = z
  .object({
    licensePlate: z
      .string()
      .refine((val) => val.trim() !== "" || false, {
        message: "Biển số xe không được để trống nếu không dùng identifier",
      })
      .optional()
      .or(z.literal("")),
    identifier: z
      .string()
      .refine((val) => val.trim() !== "" || false, {
        message: "Identifier không được để trống nếu không dùng biển số xe",
      })
      .optional()
      .or(z.literal("")),
    vehicleTypeId: z.string({
      required_error: "Vui lòng chọn loại xe",
    }),
    cardId: z
      .string()
      .refine(
        (val) => {
          if (val === "") return true; // Cho phép để trống

          const num = parseInt(val);
          return !isNaN(num) && num >= 1 && num <= 999;
        },
        {
          message: "Mã số thẻ phải là số nguyên từ 1-999 hoặc để trống",
        }
      )
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.licensePlate || data.identifier, {
    message: "Phải nhập ít nhất một trong hai: Biển số xe hoặc Identifier",
    path: ["licensePlate"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function VehicleEntryPage() {
  // Sử dụng hook useFetchWithAuth
  const { fetchWithAuth, loading: apiLoading } = useFetchWithAuth();

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTypes, setFetchingTypes] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [entryRecord, setEntryRecord] = useState<
    EntryResponse["result"] | null
  >(null);

  // Khởi tạo form (giữ nguyên)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licensePlate: "",
      identifier: "",
      vehicleTypeId: "",
      cardId: "",
    },
    mode: "onSubmit",
  });

  // Watch fields
  const watchLicensePlate = form.watch("licensePlate");
  const watchIdentifier = form.watch("identifier");
  const isLoading = loading || apiLoading;

  // useEffects cho watch fields
  useEffect(() => {
    // Nếu có biển số xe, xóa identifier
    if (watchLicensePlate && form.getValues("identifier")) {
      form.setValue("identifier", "");
    }

    // Nếu có identifier, xóa biển số xe
    if (watchIdentifier && form.getValues("licensePlate")) {
      form.setValue("licensePlate", "");
    }
  }, [watchLicensePlate, watchIdentifier, form]);

  // Fetch danh sách loại xe từ API sử dụng fetchWithAuth
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setFetchingTypes(true);

        const data = await fetchWithAuth<VehicleTypesResponse>(
          "http://localhost:8080/api/parking/vehicle-types"
        );

        // Nếu data là null (có lỗi 401), không cần xử lý tiếp
        if (!data) return;

        if (data.code === 1000 && data.result) {
          setVehicleTypes(data.result);

          // Đặt giá trị mặc định cho loại xe nếu có dữ liệu
          if (data.result.length > 0) {
            form.setValue("vehicleTypeId", data.result[0].id);
          }
        } else {
          throw new Error(data.message || "Không thể lấy danh sách loại xe");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại xe:", error);
        toast.error("Không thể lấy danh sách loại xe");
      } finally {
        setFetchingTypes(false);
      }
    };

    fetchVehicleTypes();
  }, [form, fetchWithAuth]);

  // Refactor: Xử lý submit form sử dụng fetchWithAuth
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu gửi lên server
      const requestBody = {
        licensePlate: values.licensePlate || "",
        identifier: values.identifier || "",
        vehicleTypeId: values.vehicleTypeId,
        cardId: values.cardId ? values.cardId : "",
      };

      if (!values.cardId) {
        // Đặt lỗi cho trường cardId
        form.setError("cardId", {
          type: "manual",
          message: "Mã số thẻ không được để trống",
        });
        setLoading(false);
        return;
      }

      const data = await fetchWithAuth<EntryResponse>(
        "http://localhost:8080/api/parking/entry",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      // Nếu data là null (có lỗi 401), không cần xử lý tiếp
      if (!data) return;

      // Xử lý các mã lỗi cụ thể
      if (data.code !== 1000) {
        if (data.code === 4006) {
          form.setError("licensePlate", {
            type: "manual",
            message: "Biển số này đã tồn tại trong bãi",
          });
        } else if (data.code === 4007) {
          form.setError("identifier", {
            type: "manual",
            message: "Identifier này đã tồn tại trong bãi",
          });
        } else if (data.code === 4005) {
          form.setError("cardId", {
            type: "manual",
            message: "Thẻ này đã được sử dụng cho xe khác",
          });
        } else {
          toast.error(data.message || "Lỗi không xác định");
        }
        return;
      }

      // Xử lý khi request thành công
      if (data.result) {
        setEntryRecord(data.result);
        setShowSuccessDialog(true);
        form.reset(); // Reset form sau khi thành công
      } else {
        toast.error("Ghi nhận xe vào bãi thất bại");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi khi ghi nhận xe vào bãi");
    } finally {
      setLoading(false);
    }
  };

  const handleNewEntry = () => {
    setShowSuccessDialog(false);
    setEntryRecord(null);
  };

  // Cập nhật loading state để kết hợp cả loading từ form và từ API
  if (fetchingTypes) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Phần return UI vẫn giữ nguyên
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Ghi nhận xe vào bãi</CardTitle>
          <CardDescription>
            Nhập thông tin xe để ghi nhận vào bãi đỗ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Form fields giữ nguyên */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                      <FormLabel>Biển số xe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ví dụ: 59A-12345"
                          {...field}
                          disabled={!!watchIdentifier || isLoading}
                          onChange={(e) => {
                            field.onChange(e);
                            // Xóa lỗi khi người dùng bắt đầu nhập
                            form.clearErrors("licensePlate");
                          }}
                          // Thêm sự kiện onFocus để xóa lỗi khi click vào
                          onFocus={() => {
                            form.clearErrors("licensePlate");
                          }}
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                      <FormLabel>Identifier</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập ID nếu không có biển số"
                          {...field}
                          disabled={!!watchLicensePlate || isLoading}
                          onChange={(e) => {
                            field.onChange(e);
                            form.clearErrors("identifier");
                          }}
                          onFocus={() => {
                            form.clearErrors("identifier");
                          }}
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        {" "}
                        {/* Khoảng trống cố định cho thông báo lỗi */}
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleTypeId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                      <FormLabel>Loại xe</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.clearErrors("vehicleTypeId");
                        }}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại xe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                      <FormLabel>Mã số thẻ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập mã số thẻ (1-999)"
                          {...field}
                          type="number"
                          min={1}
                          max={999}
                          disabled={isLoading}
                          onChange={(e) => {
                            field.onChange(e);
                            form.clearErrors("cardId");
                          }}
                          onFocus={() => {
                            form.clearErrors("cardId");
                          }}
                        />
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading} // Thêm apiLoading
              >
                {loading || apiLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Car className="mr-2 h-4 w-4" />
                    Ghi nhận xe vào bãi
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Dialog thông báo thành công giữ nguyên */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-600">
              <Check className="mr-2 h-5 w-5" />
              Ghi nhận thành công
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>Xe đã được ghi nhận vào bãi thành công!</p>

                {entryRecord && (
                  <div className="bg-slate-50 p-4 rounded-md space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-slate-500">ID ghi nhận:</div>
                      <div className="font-medium">{entryRecord.recordId}</div>

                      {entryRecord.licensePlate && (
                        <>
                          <div className="text-slate-500">Biển số:</div>
                          <div className="font-medium">
                            {entryRecord.licensePlate}
                          </div>
                        </>
                      )}

                      {entryRecord.identifier && (
                        <>
                          <div className="text-slate-500">Identifier:</div>
                          <div className="font-medium">
                            {entryRecord.identifier}
                          </div>
                        </>
                      )}

                      <div className="text-slate-500">Loại xe:</div>
                      <div className="font-medium">
                        {entryRecord.vehicleType.name}
                      </div>

                      <div className="text-slate-500">Mã số thẻ:</div>
                      <div className="font-medium">{entryRecord.cardId}</div>

                      <div className="text-slate-500">Thời gian vào:</div>
                      <div className="font-medium">
                        {new Date(entryRecord.entryTime).toLocaleString(
                          "vi-VN"
                        )}
                      </div>

                      <div className="text-slate-500">Loại gửi:</div>
                      <div className="font-medium">
                        {entryRecord.type === "DAILY"
                          ? "Theo ngày"
                          : "Thẻ tháng"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleNewEntry}>
              Nhập xe mới
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
