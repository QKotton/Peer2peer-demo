// Các tab ở trang quản lý của tutor (dùng chung cho trang và thanh chức năng bên trái)
export const TAB_TUTOR = [
  { id: "thong-tin", nhan: "Thông tin chung", icon: "user" },
  { id: "mon-day", nhan: "Môn dạy", icon: "book" },
  { id: "minh-chung", nhan: "Minh chứng", icon: "shield" },
  { id: "bai-giang", nhan: "Bài giảng", icon: "video" },
] as const;

export type TabTutorId = (typeof TAB_TUTOR)[number]["id"];
