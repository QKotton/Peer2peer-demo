import { useApp } from "../../context/AppContext";
import { buoiCoachs } from "../../data/mockData";
import { buoiOnThiSapToi, cacMonDangHoc, layMon, layTruong, tutorsDayMon } from "../../lib/rules";

// Người học: on-thi, goi-y, ca-nhan, thi. Tutor: day-nhom, coach.
export type LoaiLich = "on-thi" | "goi-y" | "ca-nhan" | "thi" | "day-nhom" | "coach";

/** Một sự kiện hiển thị trên lịch. */
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
  hocVien?: string; // lịch dạy: "18/30 học viên đã đăng ký" hoặc tên học viên coach
};

type KieuLich = { loai: LoaiLich; ten: string; mau: string; nen: string };

export const LICH_HOC: KieuLich[] = [
  { loai: "on-thi", ten: "Buổi ôn thi đã đăng ký", mau: "bg-blue-600", nen: "bg-blue-600 text-white" },
  { loai: "goi-y", ten: "Gợi ý cho môn bạn học", mau: "bg-sky-300", nen: "border border-dashed border-blue-500 bg-white text-blue-700" },
  { loai: "ca-nhan", ten: "Lịch cá nhân", mau: "bg-emerald-600", nen: "bg-emerald-600 text-white" },
  { loai: "thi", ten: "Lịch thi & hạn nộp", mau: "bg-rose-600", nen: "bg-rose-600 text-white" },
];

export const LICH_DAY: KieuLich[] = [
  { loai: "day-nhom", ten: "Lớp ôn thi (học nhóm)", mau: "bg-indigo-600", nen: "bg-indigo-600 text-white" },
  { loai: "coach", ten: "Coach 1-1", mau: "bg-amber-500", nen: "bg-amber-500 text-white" },
];

export const kieuLich = (loai: LoaiLich) => [...LICH_HOC, ...LICH_DAY].find((l) => l.loai === loai)!;

/** Các lớp lịch theo chế độ đang bật. */
export function useCacLopLich() {
  return useApp().cheDo === "tutor" ? LICH_DAY : LICH_HOC;
}

const tenMon = (monId: string, truongId: string) => `${layMon(monId)?.ten} – ${layTruong(truongId)?.tenVietTat}`;

/**
 * Chế độ NGƯỜI HỌC:
 * - buổi ôn thi đã đăng ký (chỉ buổi của tutor đủ điều kiện – buoiOnThiSapToi đã lọc)
 * - buổi ôn thi GỢI Ý: các buổi của những môn người học đang học mà chưa đăng ký
 * - sự kiện cá nhân tự thêm
 *
 * Chế độ TUTOR: chỉ lịch dạy của tutor đang đóng vai
 * - lớp ôn thi tutor tổ chức (kèm số học viên đã đăng ký)
 * - buổi coach 1-1
 * Cả hai chỉ gồm môn tutor đủ điều kiện dạy.
 */
export function useSuKienLich(): SuKienLich[] {
  const { cheDo, tutorDongVaiId, buoiDaDangKy, suKien } = useApp();
  const sapXep = (ds: SuKienLich[]) => ds.sort((a, b) => a.batDau.getTime() - b.batDau.getTime());

  if (cheDo === "tutor") {
    const lopNhom = buoiOnThiSapToi()
      .filter((x) => x.tutor.id === tutorDongVaiId)
      .map(({ buoi, tutor, mon }): SuKienLich => {
        const batDau = new Date(buoi.batDau);
        const soDK = buoi.daDangKy + (buoiDaDangKy.includes(buoi.id) ? 1 : 0);
        return {
          id: `day-${buoi.id}`,
          tieuDe: buoi.tieuDe,
          batDau,
          ketThuc: new Date(batDau.getTime() + buoi.thoiLuongPhut * 60000),
          loai: "day-nhom",
          diaDiem: buoi.hinhThuc,
          monId: mon.id,
          monTen: tenMon(mon.id, tutor.truongId),
          hocVien: `${soDK}/${buoi.soCho} học viên đã đăng ký`,
        };
      });
    const coach = buoiCoachs
      .filter((c) => c.tutorId === tutorDongVaiId && tutorsDayMon(c.monId).some((x) => x.tutor.id === c.tutorId))
      .map((c): SuKienLich => {
        const batDau = new Date(c.batDau);
        const tutor = tutorsDayMon(c.monId).find((x) => x.tutor.id === c.tutorId)!.tutor;
        return {
          id: `coach-${c.id}`,
          tieuDe: `Coach 1-1 · ${layMon(c.monId)?.ten}`,
          batDau,
          ketThuc: new Date(batDau.getTime() + c.thoiLuongPhut * 60000),
          loai: "coach",
          diaDiem: c.hinhThuc,
          monId: c.monId,
          monTen: tenMon(c.monId, tutor.truongId),
          hocVien: c.hocVien,
        };
      });
    return sapXep([...lopNhom, ...coach]);
  }

  const monDangHoc = new Set(cacMonDangHoc().map((x) => x.mon.id));
  const tuBuoi = buoiOnThiSapToi().flatMap(({ buoi, tutor, mon }): SuKienLich[] => {
    const daDK = buoiDaDangKy.includes(buoi.id);
    if (!daDK && !monDangHoc.has(mon.id)) return [];
    const batDau = new Date(buoi.batDau);
    return [
      {
        id: `buoi-${buoi.id}`,
        tieuDe: buoi.tieuDe,
        batDau,
        ketThuc: new Date(batDau.getTime() + buoi.thoiLuongPhut * 60000),
        loai: daDK ? "on-thi" : "goi-y",
        diaDiem: buoi.hinhThuc,
        buoiId: buoi.id,
        tutorId: tutor.id,
        tutorTen: tutor.hoTen,
        monId: mon.id,
        monTen: tenMon(mon.id, tutor.truongId),
        conCho: buoi.soCho - buoi.daDangKy - (daDK ? 1 : 0),
      },
    ];
  });

  const caNhan = suKien.map(
    (s): SuKienLich => ({
      id: s.id,
      tieuDe: s.tieuDe,
      batDau: new Date(s.batDau),
      ketThuc: new Date(s.ketThuc),
      loai: s.loai,
      ghiChu: s.ghiChu,
    }),
  );

  return sapXep([...tuBuoi, ...caNhan]);
}
