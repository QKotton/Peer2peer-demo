// Tiện ích ngày giờ cho trang "Lịch của tôi". Tuần bắt đầu từ Thứ 2 (theo thói quen ở Việt Nam).

export const THU_NGAN = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
export const THU_DAI = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export const dauNgay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const congNgay = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes());
export const cungNgay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function dauTuan(d: Date) {
  const x = dauNgay(d);
  const lech = (x.getDay() + 6) % 7; // T2 = 0 … CN = 6
  return congNgay(x, -lech);
}

/** 42 ô (6 tuần) cho lưới tháng, bắt đầu từ Thứ 2. */
export function oThang(d: Date) {
  const dau = dauTuan(new Date(d.getFullYear(), d.getMonth(), 1));
  return Array.from({ length: 42 }, (_, i) => congNgay(dau, i));
}

const hai = (n: number) => String(n).padStart(2, "0");
export const gioPhut = (d: Date) => `${hai(d.getHours())}:${hai(d.getMinutes())}`;
export const ngayISO = (d: Date) => `${d.getFullYear()}-${hai(d.getMonth() + 1)}-${hai(d.getDate())}`;
export const chuoiLocal = (d: Date) => `${ngayISO(d)}T${gioPhut(d)}`;
export const tenThang = (d: Date) => `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
export const ngayDai = (d: Date) => `${THU_DAI[d.getDay()]}, ${d.getDate()} tháng ${d.getMonth() + 1}`;
