// Trạng thái lịch & ví: đăng ký lớp ôn thi (trừ tiền ví / hoàn tiền), sự kiện cá nhân, lệnh rút tiền của tutor.
import { useState } from "react";
import {
  buoiDaDangKyMacDinh,
  buoiOnThis,
  giaoDichHocVienMacDinh,
  suKienCaNhanMacDinh,
  tutorMons,
  type GiaoDichHocVien,
  type SuKienCaNhan,
} from "../data/mockData";
import { chuoiLocal } from "../lib/lich";
import type { GiaoDichTutor } from "../lib/vi";

const THOI_GIAN_RUT_TIEN = 3000; // mô phỏng, chưa chuyển tiền thật

const maGD = () => `GD${Date.now().toString().slice(-8)}`;

/** Buổi ôn thi + giá mỗi buổi (giá lớp chung của tutor–môn). */
function giaBuoi(id: string) {
  const b = buoiOnThis.find((x) => x.id === id);
  const tm = b && tutorMons.find((x) => x.tutorId === b.tutorId && x.monId === b.monId);
  return b && tm ? { b, gia: tm.giaLopChung } : null;
}

export function useLichVaVi() {
  // --- Đăng ký lớp ôn thi: trừ tiền ví người học, huỷ thì hoàn tiền ---
  const [buoiDaDangKy, setBuoiDaDangKy] = useState<string[]>(buoiDaDangKyMacDinh);
  const [giaoDichHV, setGiaoDichHV] = useState<GiaoDichHocVien[]>(giaoDichHocVienMacDinh);
  const soDuHV = giaoDichHV.reduce((s, g) => s + g.soTien, 0);

  /** Trả về false nếu số dư ví không đủ */
  const dangKyBuoi = (id: string) => {
    if (buoiDaDangKy.includes(id)) return true;
    const x = giaBuoi(id);
    if (!x || soDuHV < x.gia) return false;
    setBuoiDaDangKy((ds) => [...ds, id]);
    setGiaoDichHV((ds) => [
      ...ds,
      { id: maGD(), ngay: chuoiLocal(new Date()), loai: "lop-on-thi", moTa: `Lớp ôn thi: ${x.b.tieuDe}`, soTien: -x.gia, tutorId: x.b.tutorId, monId: x.b.monId, buoiId: id, phuongThuc: "Ví Peer2Peer" },
    ]);
    return true;
  };
  const huyDangKyBuoi = (id: string) => {
    const x = giaBuoi(id);
    setBuoiDaDangKy((ds) => ds.filter((y) => y !== id));
    if (x)
      setGiaoDichHV((ds) => [
        ...ds,
        { id: maGD(), ngay: chuoiLocal(new Date()), loai: "hoan-tien", moTa: `Hoàn tiền huỷ đăng ký: ${x.b.tieuDe}`, soTien: x.gia, tutorId: x.b.tutorId, monId: x.b.monId, buoiId: id, phuongThuc: "Ví Peer2Peer" },
      ]);
  };

  // --- Sự kiện cá nhân (Lịch của tôi) ---
  const [suKien, setSuKien] = useState<SuKienCaNhan[]>(suKienCaNhanMacDinh);
  const themSuKien = (sk: SuKienCaNhan) => setSuKien((ds) => [...ds, sk]);
  const xoaSuKien = (id: string) => setSuKien((ds) => ds.filter((x) => x.id !== id));

  // --- Ví tutor: lệnh rút tiền tạo trong phiên demo ---
  const [rutTienTutor, setRutTienTutor] = useState<Record<string, GiaoDichTutor[]>>({});
  const rutTien = (tutorId: string, soTien: number) => {
    const id = `rut-${Date.now()}`;
    const gd: GiaoDichTutor = { id, ngay: new Date(), kieu: "rut", moTa: "Rút tiền về tài khoản ngân hàng", tongTien: soTien, phi: 0, thucNhan: -soTien, trangThai: "dang-xu-ly" };
    setRutTienTutor((m) => ({ ...m, [tutorId]: [...(m[tutorId] ?? []), gd] }));
    // mô phỏng, chưa chuyển tiền thật: vài giây sau chuyển sang "Thành công"
    window.setTimeout(() => {
      setRutTienTutor((m) => ({ ...m, [tutorId]: (m[tutorId] ?? []).map((g) => (g.id === id ? { ...g, trangThai: "thanh-cong" } : g)) }));
    }, THOI_GIAN_RUT_TIEN);
  };

  return { buoiDaDangKy, dangKyBuoi, huyDangKyBuoi, suKien, themSuKien, xoaSuKien, giaoDichHV, soDuHV, rutTienTutor, rutTien };
}
