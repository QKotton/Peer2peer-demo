// Trạng thái phía tutor: sửa hồ sơ, đăng ký môn, minh chứng, bài giảng & tài liệu upload trong phiên demo.
import { useState } from "react";
import { tutorMons, tutors, type BaiGiang, type TaiLieu, type Tutor, type TutorMon } from "../data/mockData";

/** Một file minh chứng tutor đã nộp. Chỉ lưu trong trình duyệt (bản demo). */
export type MinhChung = {
  ten: string;
  kichThuoc: number;
  url: string | null; // object URL để xem trước; null = minh chứng có sẵn trong dữ liệu mẫu
  laAnh: boolean;
  trangThai: "dang-cho" | "da-xac-thuc";
};

/** Khoá minh chứng: "<tutorId>|bang-diem", "<tutorId>|the-sv", "<tutorId>|thanh-tich|<nội dung thành tích>" */
export const khoaMinhChung = (tutorId: string, loai: "bang-diem" | "the-sv" | "thanh-tich", chiTiet = "") =>
  [tutorId, loai, chiTiet].filter(Boolean).join("|");

const THOI_GIAN_XAC_THUC = 2500; // mô phỏng, chưa xác thực thật

/** Thu hồi object URL (blob:) để tránh rò bộ nhớ. */
const thuHoi = (url?: string | null) => {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
};

export function useNoiDungTutor(toast: (msg: string) => void) {
  // Tăng mỗi khi dữ liệu tutor bị sửa để các trang vẽ lại
  const [, setPhienBan] = useState(0);
  const lamMoi = () => setPhienBan((v) => v + 1);

  // Bản demo không có backend: sửa trực tiếp mảng dữ liệu mẫu trong bộ nhớ (mất khi tải lại trang).
  // Mọi danh sách vẫn đi qua duDieuKienDay nên sửa GPA / điểm sẽ thấy tác dụng ngay ở phía người học.
  const capNhatTutor = (id: string, patch: Partial<Tutor>) => {
    const t = tutors.find((x) => x.id === id);
    if (t) Object.assign(t, patch);
    lamMoi();
  };
  const luuTutorMon = (tm: TutorMon) => {
    const i = tutorMons.findIndex((x) => x.tutorId === tm.tutorId && x.monId === tm.monId);
    if (i >= 0) tutorMons[i] = tm;
    else tutorMons.push(tm);
    lamMoi();
  };
  const xoaTutorMon = (tutorId: string, monId: string) => {
    const i = tutorMons.findIndex((x) => x.tutorId === tutorId && x.monId === monId);
    if (i >= 0) tutorMons.splice(i, 1);
    lamMoi();
  };

  // --- Minh chứng ---
  const [minhChung, setMinhChung] = useState<Record<string, MinhChung>>({});
  const layMinhChung = (khoa: string): MinhChung | undefined => {
    if (minhChung[khoa]) return minhChung[khoa];
    // Tutor mẫu đã có huy hiệu → coi như bảng điểm đã nộp và được xác thực từ trước
    const [tutorId, loai] = khoa.split("|");
    if (loai === "bang-diem" && tutors.find((t) => t.id === tutorId)?.daXacThucBangDiem) {
      return { ten: "bang-diem-tich-luy.pdf", kichThuoc: 0, url: null, laAnh: false, trangThai: "da-xac-thuc" };
    }
    return undefined;
  };
  const nopMinhChung = (khoa: string, file: File) => {
    thuHoi(minhChung[khoa]?.url);
    const url = URL.createObjectURL(file);
    setMinhChung((m) => ({ ...m, [khoa]: { ten: file.name, kichThuoc: file.size, url, laAnh: file.type.startsWith("image/"), trangThai: "dang-cho" } }));
    const [tutorId, loai] = khoa.split("|");
    if (loai === "bang-diem") capNhatTutor(tutorId, { daXacThucBangDiem: false });

    // mô phỏng, chưa xác thực thật: sau vài giây chuyển sang "Đã xác thực"
    window.setTimeout(() => {
      setMinhChung((m) => (m[khoa]?.url === url ? { ...m, [khoa]: { ...m[khoa], trangThai: "da-xac-thuc" } } : m));
      if (loai === "bang-diem") capNhatTutor(tutorId, { daXacThucBangDiem: true });
      toast(`Đã xác thực: ${file.name}`);
    }, THOI_GIAN_XAC_THUC);
  };
  const xoaMinhChung = (khoa: string) => {
    thuHoi(minhChung[khoa]?.url);
    setMinhChung((m) => {
      const { [khoa]: _bo, ...conLai } = m;
      return conLai;
    });
  };

  // --- Bài giảng & tài liệu upload ---
  const [baiGiangThem, setBaiGiangThem] = useState<BaiGiang[]>([]);
  const themBaiGiang = (bg: BaiGiang) => setBaiGiangThem((ds) => [...ds, bg]);
  const xoaBaiGiang = (id: string) =>
    setBaiGiangThem((ds) => {
      thuHoi(ds.find((b) => b.id === id)?.videoUrl);
      return ds.filter((b) => b.id !== id);
    });

  const [taiLieuThem, setTaiLieuThem] = useState<TaiLieu[]>([]);
  const themTaiLieu = (tl: TaiLieu) => setTaiLieuThem((ds) => [tl, ...ds]);
  const xoaTaiLieu = (id: string) =>
    setTaiLieuThem((ds) => {
      thuHoi(ds.find((x) => x.id === id)?.fileUrl);
      return ds.filter((x) => x.id !== id);
    });

  return {
    capNhatTutor,
    luuTutorMon,
    xoaTutorMon,
    layMinhChung,
    nopMinhChung,
    xoaMinhChung,
    baiGiangThem,
    themBaiGiang,
    xoaBaiGiang,
    taiLieuThem,
    themTaiLieu,
    xoaTaiLieu,
  };
}
