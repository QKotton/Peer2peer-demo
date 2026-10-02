// Màu cố định của từng môn – dùng chung cho ảnh bìa video (trang chủ) và ô vuông kênh môn (diễn đàn).
// Môn mới chưa có màu sẽ dùng màu xám.

export const MAU_MON: Record<string, string> = {
  "Kinh tế lượng": "#1d4ed8",
  "Toán cao cấp": "#059669",
  "Tài chính doanh nghiệp": "#d97706",
  "Nguyên lý kế toán": "#e11d48",
  "Kế toán tài chính": "#a21caf",
  "Kinh tế vi mô": "#0e7490",
  "Lý thuyết xác suất và thống kê": "#6d28d9",
  "Thống kê kinh tế": "#4d7c0f",
  "Quản trị chất lượng": "#0369a1",
  "Quản trị chiến lược 2": "#b91c1c",
  "Quản trị vận hành 2": "#0f766e",
  "Khởi sự kinh doanh": "#ea580c",
  "Quản trị chuỗi cung ứng": "#4338ca",
  "Quản trị chi phí kinh doanh": "#7e22ce",
};

export const mauMon = (tenMon: string) => MAU_MON[tenMon] ?? "#475569";

/** Nền ảnh bìa: chuyển từ màu môn sang sắc nhạt hơn của chính màu đó. */
export const nenAnhBia = (tenMon: string) => {
  const m = mauMon(tenMon);
  return `linear-gradient(135deg, ${m}, color-mix(in srgb, ${m} 60%, white))`;
};
