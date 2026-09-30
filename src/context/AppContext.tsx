import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { GiaoDichTutor } from "../lib/vi";
import {
  buoiDaDangKyMacDinh,
  buoiOnThis,
  giaoDichHocVienMacDinh,
  suKienCaNhanMacDinh,
  tutorMons,
  tutors,
  type BaiGiang,
  type GiaoDichHocVien,
  type SuKienCaNhan,
  type TaiLieu,
  type Tutor,
  type TutorMon,
} from "../data/mockData";

type CheDo = "hoc" | "tutor";

// Giá trị điền sẵn khi mở panel lọc (vd bấm breadcrumb Trường / Khoa)
type BoLoc = { truong: string; khoa: string };

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

type AppState = {
  cheDo: CheDo;
  setCheDo: (c: CheDo) => void;
  tutorDongVaiId: string;
  setTutorDongVaiId: (id: string) => void;
  baiGiangThem: BaiGiang[];
  themBaiGiang: (bg: BaiGiang) => void;
  xoaBaiGiang: (id: string) => void;
  toastMsg: string | null;
  toast: (msg: string) => void;
  boLoc: BoLoc | null; // null = panel lọc đang đóng
  moBoLoc: (dienSan?: Partial<BoLoc>) => void;
  dongBoLoc: () => void;
  sidebarMo: boolean; // drawer sidebar trên mobile
  setSidebarMo: (mo: boolean) => void;
  // --- Chế độ tutor: sửa hồ sơ, đăng ký môn, nộp minh chứng ---
  capNhatTutor: (id: string, patch: Partial<Tutor>) => void;
  luuTutorMon: (tm: TutorMon) => void;
  xoaTutorMon: (tutorId: string, monId: string) => void;
  layMinhChung: (khoa: string) => MinhChung | undefined;
  nopMinhChung: (khoa: string, file: File) => void;
  xoaMinhChung: (khoa: string) => void;
  // --- Lịch của tôi ---
  buoiDaDangKy: string[];
  /** Trả về false nếu số dư ví không đủ */
  dangKyBuoi: (id: string) => boolean;
  huyDangKyBuoi: (id: string) => void;
  suKien: SuKienCaNhan[];
  themSuKien: (sk: SuKienCaNhan) => void;
  xoaSuKien: (id: string) => void;
  // --- Kho tài liệu ---
  taiLieuThem: TaiLieu[];
  themTaiLieu: (tl: TaiLieu) => void;
  xoaTaiLieu: (id: string) => void;
  // --- Ví ---
  giaoDichHV: GiaoDichHocVien[];
  soDuHV: number;
  rutTienTutor: Record<string, GiaoDichTutor[]>;
  rutTien: (tutorId: string, soTien: number) => void;
};

const AppContext = createContext<AppState | null>(null);

// Tutor mặc định khi đóng vai = tutor ca 2 (GPA 3.9, dạy 2 môn)
const TUTOR_MAC_DINH = "t2";
const THOI_GIAN_XAC_THUC = 2500; // mô phỏng, chưa xác thực thật

export function AppProvider({ children }: { children: ReactNode }) {
  const [cheDo, setCheDo] = useState<CheDo>("hoc");
  const [tutorDongVaiId, setTutorDongVaiId] = useState(TUTOR_MAC_DINH);
  const [baiGiangThem, setBaiGiangThem] = useState<BaiGiang[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [boLoc, setBoLoc] = useState<BoLoc | null>(null);
  const [sidebarMo, setSidebarMo] = useState(false);
  const [minhChung, setMinhChung] = useState<Record<string, MinhChung>>({});
  const [buoiDaDangKy, setBuoiDaDangKy] = useState<string[]>(buoiDaDangKyMacDinh);
  const [suKien, setSuKien] = useState<SuKienCaNhan[]>(suKienCaNhanMacDinh);
  // --- Ví người học: đăng ký lớp ôn thi trừ tiền ví, huỷ thì hoàn tiền (bản demo) ---
  const [giaoDichHV, setGiaoDichHV] = useState<GiaoDichHocVien[]>(giaoDichHocVienMacDinh);
  const soDuHV = giaoDichHV.reduce((s, g) => s + g.soTien, 0);
  const giaBuoi = (id: string) => {
    const b = buoiOnThis.find((x) => x.id === id);
    const tm = b && tutorMons.find((x) => x.tutorId === b.tutorId && x.monId === b.monId);
    return b && tm ? { b, gia: tm.giaLopChung } : null;
  };
  const maGD = () => `GD${Date.now().toString().slice(-8)}`;
  const bayGio = () => {
    const d = new Date();
    const hai = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${hai(d.getMonth() + 1)}-${hai(d.getDate())}T${hai(d.getHours())}:${hai(d.getMinutes())}`;
  };
  const dangKyBuoi = (id: string) => {
    if (buoiDaDangKy.includes(id)) return true;
    const x = giaBuoi(id);
    if (!x) return false;
    if (soDuHV < x.gia) return false;
    setBuoiDaDangKy((ds) => [...ds, id]);
    setGiaoDichHV((ds) => [
      ...ds,
      { id: maGD(), ngay: bayGio(), loai: "lop-on-thi", moTa: `Lớp ôn thi: ${x.b.tieuDe}`, soTien: -x.gia, tutorId: x.b.tutorId, monId: x.b.monId, buoiId: id, phuongThuc: "Ví Peer2Peer" },
    ]);
    return true;
  };
  const huyDangKyBuoi = (id: string) => {
    const x = giaBuoi(id);
    setBuoiDaDangKy((ds) => ds.filter((y) => y !== id));
    if (x)
      setGiaoDichHV((ds) => [
        ...ds,
        { id: maGD(), ngay: bayGio(), loai: "hoan-tien", moTa: `Hoàn tiền huỷ đăng ký: ${x.b.tieuDe}`, soTien: x.gia, tutorId: x.b.tutorId, monId: x.b.monId, buoiId: id, phuongThuc: "Ví Peer2Peer" },
      ]);
  };

  // --- Ví tutor: lệnh rút tiền tạo trong phiên demo (mô phỏng, không chuyển tiền thật) ---
  const [rutTienTutor, setRutTienTutor] = useState<Record<string, GiaoDichTutor[]>>({});
  const rutTien = (tutorId: string, soTien: number) => {
    const id = `rut-${Date.now()}`;
    const gd: GiaoDichTutor = { id, ngay: new Date(), kieu: "rut", moTa: "Rút tiền về tài khoản ngân hàng", tongTien: soTien, phi: 0, thucNhan: -soTien, trangThai: "dang-xu-ly" };
    setRutTienTutor((m) => ({ ...m, [tutorId]: [...(m[tutorId] ?? []), gd] }));
    // mô phỏng, chưa chuyển tiền thật: vài giây sau chuyển sang "Thành công"
    window.setTimeout(() => {
      setRutTienTutor((m) => ({ ...m, [tutorId]: (m[tutorId] ?? []).map((g) => (g.id === id ? { ...g, trangThai: "thanh-cong" } : g)) }));
    }, 3000);
  };
  const themSuKien = (sk: SuKienCaNhan) => setSuKien((ds) => [...ds, sk]);
  const xoaSuKien = (id: string) => setSuKien((ds) => ds.filter((x) => x.id !== id));
  const [taiLieuThem, setTaiLieuThem] = useState<TaiLieu[]>([]);
  const themTaiLieu = (tl: TaiLieu) => setTaiLieuThem((ds) => [tl, ...ds]);
  const xoaTaiLieu = (id: string) =>
    setTaiLieuThem((ds) => {
      const tl = ds.find((x) => x.id === id);
      // Thu hồi object URL để tránh rò bộ nhớ
      if (tl?.fileUrl?.startsWith("blob:")) URL.revokeObjectURL(tl.fileUrl);
      return ds.filter((x) => x.id !== id);
    });
  // Tăng mỗi khi dữ liệu tutor bị sửa để các trang vẽ lại
  const [, setPhienBan] = useState(0);
  const lamMoi = () => setPhienBan((v) => v + 1);

  const moBoLoc = useCallback((dienSan?: Partial<BoLoc>) => {
    setSidebarMo(false);
    setBoLoc({ truong: dienSan?.truong ?? "", khoa: dienSan?.khoa ?? "" });
  }, []);
  const dongBoLoc = useCallback(() => setBoLoc(null), []);
  const timer = useRef<number | undefined>(undefined);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const themBaiGiang = useCallback((bg: BaiGiang) => setBaiGiangThem((ds) => [...ds, bg]), []);

  const xoaBaiGiang = useCallback((id: string) => {
    setBaiGiangThem((ds) => {
      const bg = ds.find((b) => b.id === id);
      // Thu hồi object URL để tránh rò bộ nhớ
      if (bg?.videoUrl?.startsWith("blob:")) URL.revokeObjectURL(bg.videoUrl);
      return ds.filter((b) => b.id !== id);
    });
  }, []);

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
    const cu = minhChung[khoa];
    if (cu?.url) URL.revokeObjectURL(cu.url);
    const url = URL.createObjectURL(file);
    setMinhChung((m) => ({
      ...m,
      [khoa]: { ten: file.name, kichThuoc: file.size, url, laAnh: file.type.startsWith("image/"), trangThai: "dang-cho" },
    }));
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
    const cu = minhChung[khoa];
    if (cu?.url) URL.revokeObjectURL(cu.url);
    setMinhChung((m) => {
      const { [khoa]: _bo, ...conLai } = m;
      return conLai;
    });
  };

  return (
    <AppContext.Provider
      value={{
        cheDo,
        setCheDo,
        tutorDongVaiId,
        setTutorDongVaiId,
        baiGiangThem,
        themBaiGiang,
        xoaBaiGiang,
        toastMsg,
        toast,
        boLoc,
        moBoLoc,
        dongBoLoc,
        sidebarMo,
        setSidebarMo,
        capNhatTutor,
        luuTutorMon,
        xoaTutorMon,
        layMinhChung,
        nopMinhChung,
        xoaMinhChung,
        buoiDaDangKy,
        dangKyBuoi,
        huyDangKyBuoi,
        suKien,
        themSuKien,
        xoaSuKien,
        taiLieuThem,
        themTaiLieu,
        xoaTaiLieu,
        giaoDichHV,
        soDuHV,
        rutTienTutor,
        rutTien,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp phải nằm trong AppProvider");
  return ctx;
}

/** Dùng cho mọi nút "tính năng đang phát triển". */
export function useDangPhatTrien() {
  const { toast } = useApp();
  return () => toast("Tính năng đang phát triển");
}
