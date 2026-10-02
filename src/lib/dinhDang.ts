// Định dạng & xử lý chuỗi dùng chung.

/** Bỏ dấu tiếng Việt + chữ thường, để tìm "kinh te luong" vẫn ra "Kinh tế lượng". */
export const boDau = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

const nf = new Intl.NumberFormat("vi-VN");
/** 150000 → "150.000đ" */
export const dinhDangTien = (n: number) => `${nf.format(n)}đ`;
/** Rút gọn cho trục biểu đồ: 1,2tr · 850k */
export const tienGon = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}tr` : `${Math.round(n / 1000)}k`);
