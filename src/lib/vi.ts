// Ví – tính toán cho bản demo. Mọi số liệu là minh hoạ, không có giao dịch thật.
import { PHI_NEN_TANG, SO_NGAY_DOI_SOAT, type GiaoDichHocVien } from "../data/mockData";
import { layMon, monNhanDay } from "./rules";

export type LoaiThu = "bai-giang" | "coach" | "lop-chung";

/** Màu cố định theo loại gói (categorical slot 1–3, đã chạy validator). Màu đi theo loại, không theo thứ hạng. */
export const LOAI_THU: { loai: LoaiThu; ten: string; mau: string }[] = [
  { loai: "bai-giang", ten: "Bài giảng quay sẵn", mau: "#2a78d6" },
  { loai: "coach", ten: "Gói coach", mau: "#eb6834" },
  { loai: "lop-chung", ten: "Lớp học chung / ôn thi", mau: "#1baf7a" },
];
export const loaiThu = (l: LoaiThu) => LOAI_THU.find((x) => x.loai === l)!;

export type GiaoDichTutor = {
  id: string;
  ngay: Date;
  kieu: "thu" | "rut";
  loai?: LoaiThu;
  monId?: string;
  moTa: string;
  tongTien: number; // học viên trả (với "thu") hoặc số tiền rút
  phi: number;
  thucNhan: number; // + vào ví, − rút ra
  trangThai: "cho-doi-soat" | "da-doi-soat" | "dang-xu-ly" | "thanh-cong";
};

// PRNG cố định theo tutor để số liệu không đổi mỗi lần tải trang
function taoNgauNhien(hat: string) {
  let a = [...hat].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0), 1779033703);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAM_HOC = ["năm 1", "năm 2", "năm 3"];
const tachPhi = (tong: number) => {
  const phi = Math.round((tong * PHI_NEN_TANG) / 1000) * 1000;
  return { phi, thucNhan: tong - phi };
};

/**
 * Sinh lịch sử thu nhập 6 tháng gần nhất cho một tutor từ các môn đủ điều kiện và bảng giá của họ,
 * cộng thêm giao dịch thật trong phiên demo: người học đăng ký lớp ôn thi của tutor này.
 */
export function giaoDichTutor(tutorId: string, homNay: Date, giaoDichHV: GiaoDichHocVien[], rutThem: GiaoDichTutor[]): GiaoDichTutor[] {
  const rnd = taoNgauNhien(tutorId);
  const nguyen = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
  const cacMon = monNhanDay(tutorId);
  const ds: GiaoDichTutor[] = [];
  const doiSoat = (d: Date) => (homNay.getTime() - d.getTime() < SO_NGAY_DOI_SOAT * 86400000 ? "cho-doi-soat" : "da-doi-soat");

  for (let lui = 5; lui >= 0; lui--) {
    const thang = new Date(homNay.getFullYear(), homNay.getMonth() - lui, 1);
    const soNgay = lui === 0 ? homNay.getDate() : new Date(thang.getFullYear(), thang.getMonth() + 1, 0).getDate();
    const tangTruong = 0.6 + (5 - lui) * 0.12; // thu nhập tăng dần theo tháng
    const ngayNgauNhien = () => {
      const d = new Date(thang.getFullYear(), thang.getMonth(), nguyen(1, soNgay), nguyen(8, 22), nguyen(0, 59));
      // Không để giao dịch nằm ở tương lai (ngày hôm nay nhưng giờ chưa tới)
      return d > homNay ? new Date(homNay.getTime() - nguyen(10, 300) * 60000) : d;
    };

    for (const { mon, tm } of cacMon) {
      const them = (loai: LoaiThu, lan: number, gia: number, moTa: () => string, heSo = 1) => {
        for (let i = 0; i < lan; i++) {
          const ngay = ngayNgauNhien();
          const tong = gia * heSo;
          ds.push({ id: `${tutorId}-${ngay.getTime()}-${ds.length}`, ngay, kieu: "thu", loai, monId: mon.id, moTa: moTa(), tongTien: tong, ...tachPhi(tong), trangThai: doiSoat(ngay) });
        }
      };
      them("bai-giang", Math.round(nguyen(2, 6) * tangTruong), tm.giaBaiGiang, () => `Học viên SV ${NAM_HOC[nguyen(0, 2)]} mua gói bài giảng ${mon.ten}`);
      them("coach", Math.round(nguyen(0, 2) * tangTruong), tm.giaCoach, () => `Học viên SV ${NAM_HOC[nguyen(0, 2)]} đăng ký coach ${mon.ten}`);
      const soBuoi = Math.round(nguyen(1, 3) * tangTruong);
      for (let b = 0; b < soBuoi; b++) {
        const hv = nguyen(4, 12);
        them("lop-chung", 1, tm.giaLopChung, () => `Lớp học chung ${mon.ten} · ${hv} học viên`, hv);
      }
    }

    // Rút tiền định kỳ đầu tháng (trừ tháng đầu tiên)
    if (lui < 5 && homNay.getDate() >= 3) {
      const ngay = new Date(thang.getFullYear(), thang.getMonth(), 3, 9, 0);
      if (ngay <= homNay) ds.push({ id: `${tutorId}-rut-${lui}`, ngay, kieu: "rut", moTa: "Rút tiền về tài khoản ngân hàng", tongTien: 0, phi: 0, thucNhan: 0, trangThai: "thanh-cong" });
    }
  }

  // Người học đăng ký lớp ôn thi của tutor này trong phiên demo → khoản thu mới
  giaoDichHV.forEach((gd, i) => {
    if (gd.loai !== "lop-on-thi" || gd.tutorId !== tutorId) return;
    // Học viên huỷ và được hoàn tiền SAU giao dịch này (theo thứ tự phát sinh) → không tính thu nhập
    if (giaoDichHV.slice(i + 1).some((h) => h.loai === "hoan-tien" && h.buoiId === gd.buoiId)) return;
    const ngay = new Date(gd.ngay);
    const tong = -gd.soTien;
    ds.push({ id: `hv-${gd.id}`, ngay, kieu: "thu", loai: "lop-chung", monId: gd.monId, moTa: `Học viên đăng ký ${gd.moTa.replace("Lớp ôn thi: ", "lớp ")}`, tongTien: tong, ...tachPhi(tong), trangThai: doiSoat(ngay) });
  });

  ds.sort((a, b) => a.ngay.getTime() - b.ngay.getTime());

  // Số tiền mỗi lần rút định kỳ = 70% số dư khả dụng tại thời điểm rút (làm tròn nghìn)
  let soDu = 0;
  for (const gd of ds) {
    if (gd.kieu === "thu") {
      if (gd.trangThai === "da-doi-soat") soDu += gd.thucNhan;
    } else if (gd.tongTien === 0) {
      const rut = Math.floor((soDu * 0.7) / 100000) * 100000;
      gd.tongTien = rut;
      gd.thucNhan = -rut;
      soDu -= rut;
    }
  }

  return [...ds.filter((g) => g.kieu === "thu" || g.tongTien > 0), ...rutThem].sort((a, b) => b.ngay.getTime() - a.ngay.getTime());
}

export function tongHopVi(ds: GiaoDichTutor[], homNay: Date) {
  const cungThang = (d: Date, lui: number) => {
    const t = new Date(homNay.getFullYear(), homNay.getMonth() - lui, 1);
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth();
  };
  const thu = ds.filter((g) => g.kieu === "thu");
  const tong = (xs: GiaoDichTutor[], k: "thucNhan" | "tongTien" | "phi" = "thucNhan") => xs.reduce((s, g) => s + g[k], 0);
  const khaDung = tong(thu.filter((g) => g.trangThai === "da-doi-soat")) + tong(ds.filter((g) => g.kieu === "rut"));
  return {
    khaDung,
    choDoiSoat: tong(thu.filter((g) => g.trangThai === "cho-doi-soat")),
    thangNay: tong(thu.filter((g) => cungThang(g.ngay, 0))),
    thangTruoc: tong(thu.filter((g) => cungThang(g.ngay, 1))),
    daRut: -tong(ds.filter((g) => g.kieu === "rut")),
    tongDoanhThu: tong(thu, "tongTien"),
    tongPhi: tong(thu, "phi"),
    tongThucNhan: tong(thu),
  };
}

/** Thu nhập thực nhận theo tháng, tách theo loại gói (6 tháng gần nhất). */
export function theoThang(ds: GiaoDichTutor[], homNay: Date) {
  return Array.from({ length: 6 }, (_, i) => {
    const t = new Date(homNay.getFullYear(), homNay.getMonth() - 5 + i, 1);
    const trongThang = ds.filter((g) => g.kieu === "thu" && g.ngay.getFullYear() === t.getFullYear() && g.ngay.getMonth() === t.getMonth());
    const theoLoai = Object.fromEntries(LOAI_THU.map((l) => [l.loai, trongThang.filter((g) => g.loai === l.loai).reduce((s, g) => s + g.thucNhan, 0)])) as Record<LoaiThu, number>;
    return { thang: t, theoLoai, tong: Object.values(theoLoai).reduce((a, b) => a + b, 0) };
  });
}

/** Nguồn tiền: theo loại gói và theo môn (thực nhận, toàn kỳ). */
export function nguonTien(ds: GiaoDichTutor[]) {
  const thu = ds.filter((g) => g.kieu === "thu");
  const tong = thu.reduce((s, g) => s + g.thucNhan, 0) || 1;
  const theoLoai = LOAI_THU.map((l) => {
    const v = thu.filter((g) => g.loai === l.loai).reduce((s, g) => s + g.thucNhan, 0);
    return { ...l, giaTri: v, tyLe: v / tong, soGD: thu.filter((g) => g.loai === l.loai).length };
  });
  const monIds = [...new Set(thu.map((g) => g.monId!))];
  const theoMon = monIds
    .map((id) => {
      const v = thu.filter((g) => g.monId === id).reduce((s, g) => s + g.thucNhan, 0);
      return { monId: id, ten: layMon(id)?.ten ?? id, giaTri: v, tyLe: v / tong };
    })
    .sort((a, b) => b.giaTri - a.giaTri);
  return { theoLoai, theoMon };
}

export { dinhDangTien as tien, tienGon } from "./dinhDang";
