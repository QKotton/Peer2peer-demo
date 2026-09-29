import {
  baiGiangs,
  buoiOnThis,
  danhGias,
  khoas,
  monDangHoc,
  monHocs,
  taiLieus,
  truongs,
  tutorMons,
  tutors,
  type BaiGiang,
  type MonHoc,
  type TaiLieu,
  type Tutor,
  type TutorMon,
} from "../data/mockData";
import { taiLieuConfig } from "../data/taiLieuConfig";
import { videoConfig } from "../data/videoConfig";

// ---------- Quy tắc cốt lõi ----------

/** Tutor chỉ được dạy một môn khi GPA tích luỹ ≥ 3.6 VÀ điểm môn đó là A hoặc A+. */
export function duDieuKienDay(tutor: Tutor, tutorMon: TutorMon): boolean {
  return tutor.gpa >= 3.6 && (tutorMon.diem === "A" || tutorMon.diem === "A+");
}

export type TutorVaMon = { tutor: Tutor; tm: TutorMon };

/** Mọi cặp tutor–môn hợp lệ. Mọi danh sách "tutor dạy môn X" đều lấy từ đây. */
function capHopLe(): TutorVaMon[] {
  return tutorMons.flatMap((tm) => {
    const tutor = tutors.find((t) => t.id === tm.tutorId);
    return tutor && duDieuKienDay(tutor, tm) ? [{ tutor, tm }] : [];
  });
}

export function tutorsDayMon(monId: string): TutorVaMon[] {
  return capHopLe().filter((x) => x.tm.monId === monId);
}

export function monNhanDay(tutorId: string): { mon: MonHoc; tm: TutorMon }[] {
  return capHopLe()
    .filter((x) => x.tutor.id === tutorId)
    .map(({ tm }) => ({ mon: layMon(tm.monId)!, tm }));
}


export function tutorsCoTheDay(): Tutor[] {
  return tutors.filter((t) => monNhanDay(t.id).length > 0);
}



export function danhGiaCuaMon(tutorId: string, monId: string) {
  return danhGias.filter((d) => d.tutorId === tutorId && d.monId === monId);
}

export function saoTrungBinh(tutorId: string, monId: string): { tb: number; soLuot: number } {
  const ds = danhGiaCuaMon(tutorId, monId);
  if (ds.length === 0) return { tb: 0, soLuot: 0 };
  return { tb: ds.reduce((s, d) => s + d.soSao, 0) / ds.length, soLuot: ds.length };
}

export function giaThapNhat(tm: TutorMon): number {
  return Math.min(tm.giaBaiGiang, tm.giaCoach, tm.giaLopChung);
}

const nf = new Intl.NumberFormat("vi-VN");
export const dinhDangTien = (n: number) => `${nf.format(n)}đ`;

// ---------- Tra cứu ----------

export const layTruong = (id: string) => truongs.find((x) => x.id === id);
export const layKhoa = (id: string) => khoas.find((x) => x.id === id);
export const layMon = (id: string) => monHocs.find((x) => x.id === id);
export const layTutor = (id: string) => tutors.find((x) => x.id === id);

export function truongCuaMon(mon: MonHoc) {
  const khoa = layKhoa(mon.khoaId)!;
  return { khoa, truong: layTruong(khoa.truongId)! };
}

/** Bài giảng có sẵn + bài giảng tutor vừa upload, sắp theo số chương. */
export function baiGiangCua(tutorId: string, monId: string, uploadThem: BaiGiang[]): BaiGiang[] {
  return [...baiGiangs, ...uploadThem]
    .filter((b) => b.tutorId === tutorId && b.monId === monId)
    .sort((a, b) => a.chuongSo - b.chuongSo);
}

// ---------- Video ----------

export type NguonVideo = { loai: "youtube"; src: string } | { loai: "file"; src: string } | null;

export function nguonVideo(bg: BaiGiang): NguonVideo {
  if (bg.videoUrl?.startsWith("blob:")) return { loai: "file", src: bg.videoUrl };
  const url = bg.videoUrl ?? videoConfig[bg.id];
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? { loai: "youtube", src: `https://www.youtube-nocookie.com/embed/${m[1]}` } : null;
}

// ---------- Trang chủ: feed video + lịch ôn thi ----------

/** Video trên trang chủ: chương xem thử của mọi cặp tutor–môn hợp lệ + chương vừa upload (mới nhất lên đầu). */
export function videoTrangChu(uploadThem: BaiGiang[]): { bg: BaiGiang; tutor: Tutor; mon: MonHoc }[] {
  const hopLe = capHopLe();
  const coSan = baiGiangs.filter((b) => b.xemThu);
  return [...[...uploadThem].reverse(), ...coSan].flatMap((bg) => {
    const x = hopLe.find((c) => c.tutor.id === bg.tutorId && c.tm.monId === bg.monId);
    return x ? [{ bg, tutor: x.tutor, mon: layMon(bg.monId)! }] : [];
  });
}

/** Buổi ôn thi của tutor đủ điều kiện, sắp theo thời gian. */
export function buoiOnThiSapToi() {
  const hopLe = capHopLe();
  return buoiOnThis
    .flatMap((b) => {
      const x = hopLe.find((c) => c.tutor.id === b.tutorId && c.tm.monId === b.monId);
      return x ? [{ buoi: b, tutor: x.tutor, tm: x.tm, mon: layMon(b.monId)! }] : [];
    })
    .sort((a, b) => a.buoi.batDau.localeCompare(b.buoi.batDau));
}

/** Các môn người học đang tham gia (chỉ giữ cặp tutor–môn hợp lệ). */
export function cacMonDangHoc() {
  return monDangHoc.flatMap(({ monId, tutorId }) => {
    const x = tutorsDayMon(monId).find((c) => c.tutor.id === tutorId);
    const mon = layMon(monId);
    return x && mon ? [{ mon, tutor: x.tutor, truong: truongCuaMon(mon).truong }] : [];
  });
}

/** Gắn file khai báo trong taiLieuConfig (thư mục public/tai-lieu) và tự nhận định dạng theo đuôi file. */
function ganFile(tl: TaiLieu): TaiLieu {
  const ten = taiLieuConfig[tl.id];
  if (tl.fileUrl || !ten) return tl;
  const duoi = ten.split(".").pop()?.toLowerCase() ?? "";
  const dinhDang: TaiLieu["dinhDang"] =
    duoi === "pdf" ? "PDF" : ["png", "jpg", "jpeg", "webp", "gif"].includes(duoi) ? "Ảnh" : duoi.startsWith("ppt") ? "PPTX" : duoi.startsWith("doc") ? "DOCX" : tl.dinhDang;
  // Đường dẫn tương đối: chạy được cả khi dev lẫn trên GitHub Pages
  return { ...tl, dinhDang, fileUrl: `tai-lieu/${ten}` };
}

/** Tài liệu hiển thị cho người học: có sẵn + tutor vừa upload, chỉ giữ cặp tutor–môn hợp lệ, mới nhất lên đầu. */
export function taiLieuHienThi(uploadThem: TaiLieu[]) {
  const hopLe = capHopLe();
  return [...uploadThem, ...taiLieus.map(ganFile)]
    .flatMap((tl) => {
      const x = hopLe.find((c) => c.tutor.id === tl.tutorId && c.tm.monId === tl.monId);
      const mon = layMon(tl.monId);
      return x && mon ? [{ tl, tutor: x.tutor, mon, ...truongCuaMon(mon) }] : [];
    })
    .sort((a, b) => b.tl.ngayDang.localeCompare(a.tl.ngayDang));
}
