// Gắn file thật cho tài liệu trong Kho tài liệu.
// 1. Đặt file vào thư mục public/tai-lieu/ (vd public/tai-lieu/tom-tat-kinh-te-luong.pdf)
// 2. Thêm một dòng bên dưới: "<id tài liệu>": "<tên file>"
//    id tài liệu xem ở mảng taiLieus trong mockData.ts (tl1, tl2, …).
//
// Định dạng (PDF / ảnh / Word / PowerPoint) tự nhận theo đuôi file.
// PDF và ảnh xem trước được ngay trên web; Word / PowerPoint thì người học bấm "Tải xuống".
// Tài liệu chưa có file sẽ hiện trang minh hoạ.

export const taiLieuConfig: Record<string, string> = {
  // tl1: "tom-tat-kinh-te-luong.pdf",
  // tl5: "so-tay-cong-thuc-toan-cao-cap.pdf",
};
