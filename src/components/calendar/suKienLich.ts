import { useApp } from "../../context/AppContext";
import { buoiOnThiSapToi, cacMonDangHoc, layTruong } from "../../lib/rules";

export type LoaiLich = "on-thi" | "goi-y" | "ca-nhan" | "thi";

/** Một sự kiện hiển thị trên lịch (gộp từ buổi ôn thi + sự kiện cá nhân). */
export type SuKienLich = {
  id: string;
  tieuDe: string;
  batDau: Date;
  ketThuc: Date;
  loai: LoaiLich;
  diaDiem?: string;
  ghiChu?: string;
  buoiId?: string;
  tutorId?: string;
  tutorTen?: string;
  monId?: string;
  monTen?: string;
  conCho?: number;
};

export const LICH: { loai: LoaiLich; ten: string; mau: string; nen: string }[] = [
  { loai: "on-thi", ten: "Buổi ôn thi đã đăng ký", mau: "bg-blue-600", nen: "bg-blue-600 text-white" },
  { loai: "goi-y", ten: "Gợi ý cho môn bạn học", mau: "bg-sky-300", nen: "border border-dashed border-blue-500 bg-white text-blue-700" },
  { loai: "ca-nhan", ten: "Lịch cá nhân", mau: "bg-emerald-600", nen: "bg-emerald-600 text-white" },
  { loai: "thi", ten: "Lịch thi & hạn nộp", mau: "bg-rose-600", nen: "bg-rose-600 text-white" },
];
export const kieuLich = (loai: LoaiLich) => LICH.find((l) => l.loai === loai)!;

/**
 * Gom mọi sự kiện của người học:
 * - buổi ôn thi đã đăng ký (chỉ buổi của tutor đủ điều kiện – buoiOnThiSapToi đã lọc)
 * - buổi ôn thi GỢI Ý: các buổi của những môn người học đang học mà chưa đăng ký
 * - sự kiện cá nhân tự thêm
 */
export function useSuKienLich(): SuKienLich[] {
  const { buoiDaDangKy, suKien } = useApp();
  const monDangHoc = new Set(cacMonDangHoc().map((x) => x.mon.id));

  const tuBuoi = buoiOnThiSapToi().flatMap(({ buoi, tutor, mon }) => {
    const daDK = buoiDaDangKy.includes(buoi.id);
    if (!daDK && !monDangHoc.has(mon.id)) return [];
    const batDau = new Date(buoi.batDau);
    return [
      {
        id: `buoi-${buoi.id}`,
        tieuDe: buoi.tieuDe,
        batDau,
        ketThuc: new Date(batDau.getTime() + buoi.thoiLuongPhut * 60000),
        loai: (daDK ? "on-thi" : "goi-y") as LoaiLich,
        diaDiem: buoi.hinhThuc,
        buoiId: buoi.id,
        tutorId: tutor.id,
        tutorTen: tutor.hoTen,
        monId: mon.id,
        monTen: `${mon.ten} – ${layTruong(tutor.truongId)?.tenVietTat}`,
        conCho: buoi.soCho - buoi.daDangKy - (daDK ? 1 : 0),
      },
    ];
  });

  const caNhan = suKien.map((s) => ({
    id: s.id,
    tieuDe: s.tieuDe,
    batDau: new Date(s.batDau),
    ketThuc: new Date(s.ketThuc),
    loai: s.loai as LoaiLich,
    ghiChu: s.ghiChu,
  }));

  return [...tuBuoi, ...caNhan].sort((a, b) => a.batDau.getTime() - b.batDau.getTime());
}
