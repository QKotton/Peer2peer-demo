// Diễn đàn kiểu Discord: mỗi trường một "server", mỗi môn một kênh.
// Vai trò (màu tên) tính theo từng kênh và luôn đi qua duDieuKienDay (qua tutorsDayMon / monNhanDay).
import { khoas, monHocs, truongs, tutors, type TacGia } from "../data/mockData";
import { layKhoa, layTutor, monNhanDay, tutorsDayMon } from "./rules";

export type Kenh = {
  id: string;
  truongId: string;
  ten: string;
  loai: "chung" | "tim-nhom" | "mon";
  monId?: string;
  nhom: string; // tiêu đề nhóm trong cột kênh
};

export function cacKenh(truongId: string): Kenh[] {
  const chung: Kenh[] = [
    { id: `${truongId}-chung`, truongId, ten: "Chung", loai: "chung", nhom: "Chung" },
    { id: `${truongId}-tim-nhom`, truongId, ten: "Tìm nhóm học", loai: "tim-nhom", nhom: "Chung" },
  ];
  const theoMon = khoas
    .filter((k) => k.truongId === truongId)
    .flatMap((k) => monHocs.filter((m) => m.khoaId === k.id).map((m): Kenh => ({ id: `mon-${m.id}`, truongId, ten: m.ten, loai: "mon", monId: m.id, nhom: k.ten })));
  return [...chung, ...theoMon];
}

export const timKenh = (id: string) => truongs.flatMap((t) => cacKenh(t.id)).find((k) => k.id === id);

// ---------- Vai trò ----------

export type VaiTro = "quan-tri" | "tutor-mon" | "tutor" | "thanh-vien";

export const VAI_TRO: Record<VaiTro, { ten: string; mauChu: string; huyHieu?: string; nenHuyHieu?: string; nenAvatar: string }> = {
  "quan-tri": { ten: "Quản trị", mauChu: "text-rose-600", huyHieu: "Quản trị", nenHuyHieu: "bg-rose-50 text-rose-700", nenAvatar: "bg-rose-100 text-rose-700" },
  "tutor-mon": { ten: "Tutor môn này", mauChu: "text-amber-600", huyHieu: "✓ Tutor A+", nenHuyHieu: "bg-amber-50 text-amber-700", nenAvatar: "bg-amber-100 text-amber-800" },
  tutor: { ten: "Tutor", mauChu: "text-violet-600", huyHieu: "Tutor", nenHuyHieu: "bg-violet-50 text-violet-700", nenAvatar: "bg-violet-100 text-violet-700" },
  "thanh-vien": { ten: "Thành viên", mauChu: "text-slate-900", nenAvatar: "bg-slate-100 text-slate-600" },
};

/**
 * - Tutor đạt chuẩn ĐÚNG môn của kênh (GPA ≥ 3.6 và A/A+) → "tutor-mon" (vàng, ✓ Tutor A+)
 * - Tutor có ít nhất một môn đủ điều kiện, nhưng không phải môn của kênh → "tutor" (tím)
 * - Tutor không đủ điều kiện môn nào → chỉ là thành viên
 */
export function vaiTro(tg: TacGia, kenh: Kenh | undefined): VaiTro {
  if (tg.loai === "quan-tri") return "quan-tri";
  if (tg.loai === "hoc-vien") return "thanh-vien";
  if (kenh?.monId && tutorsDayMon(kenh.monId).some((x) => x.tutor.id === tg.tutorId)) return "tutor-mon";
  return monNhanDay(tg.tutorId).length > 0 ? "tutor" : "thanh-vien";
}

export function tenTacGia(tg: TacGia) {
  if (tg.loai === "quan-tri") return { ten: "Peer2Peer Team", phu: "Ban quản trị", chu: "P2" };
  if (tg.loai === "hoc-vien") {
    const tu = tg.ten.split(/\s+/);
    return { ten: tg.ten, phu: tg.moTa, chu: tu.length > 1 ? (tu[tu.length - 2][0] + tu[tu.length - 1][0]).toUpperCase() : tg.ten[0].toUpperCase() };
  }
  const t = layTutor(tg.tutorId)!;
  return { ten: t.hoTen, phu: `${t.trangThai} · ${layKhoa(t.khoaId)?.ten}`, chu: t.anh };
}

/** Khoá để so sánh "cùng một người" khi gộp tin nhắn liên tiếp. */
export const khoaTacGia = (tg: TacGia) => (tg.loai === "tutor" ? `t:${tg.tutorId}` : tg.loai === "hoc-vien" ? `h:${tg.ten}` : "qt");

/** Trạng thái online minh hoạ, cố định theo tên. */
export const dangOnline = (khoa: string) => [...khoa].reduce((s, c) => s + c.charCodeAt(0), 0) % 3 !== 0;

/** Tutor hiển thị ở cột thành viên của kênh (cùng trường), chia theo vai trò. */
export function tutorTrongKenh(kenh: Kenh) {
  const cuaTruong = tutors.filter((t) => t.truongId === kenh.truongId && monNhanDay(t.id).length > 0);
  const tutorMon = kenh.monId ? cuaTruong.filter((t) => tutorsDayMon(kenh.monId!).some((x) => x.tutor.id === t.id)) : [];
  const tutorKhac = cuaTruong.filter((t) => !tutorMon.includes(t));
  return { tutorMon, tutorKhac };
}
