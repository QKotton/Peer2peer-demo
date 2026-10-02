// Trạng thái dùng chung của app. Phần giao diện (chế độ, toast, panel lọc, thanh bên) nằm ở đây;
// phần nghiệp vụ tách ra các hook: useNoiDungTutor, useLichVaVi, useDienDan.
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { useDienDan } from "./useDienDan";
import { useLichVaVi } from "./useLichVaVi";
import { useNoiDungTutor } from "./useNoiDungTutor";

export { khoaMinhChung, type MinhChung } from "./useNoiDungTutor";

type CheDo = "hoc" | "tutor";
// Giá trị điền sẵn khi mở panel lọc (vd bấm breadcrumb Trường / Khoa)
type BoLoc = { truong: string; khoa: string };

// Tutor mặc định khi đóng vai = tutor ca 2 (GPA 3.9, dạy 2 môn)
const TUTOR_MAC_DINH = "t2";
const KHOA_THU_GON = "p2p.sidebarThuGon";

function useGiaoDien() {
  const [cheDo, setCheDo] = useState<CheDo>("hoc");
  const [tutorDongVaiId, setTutorDongVaiId] = useState(TUTOR_MAC_DINH);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const [sidebarMo, setSidebarMo] = useState(false); // drawer sidebar trên điện thoại
  const [boLoc, setBoLoc] = useState<BoLoc | null>(null); // null = panel lọc đang đóng
  const moBoLoc = useCallback((dienSan?: Partial<BoLoc>) => {
    setSidebarMo(false);
    setBoLoc({ truong: dienSan?.truong ?? "", khoa: dienSan?.khoa ?? "" });
  }, []);
  const dongBoLoc = useCallback(() => setBoLoc(null), []);

  // Desktop: thu cột trái thành dải biểu tượng (kiểu YouTube). Ghi nhớ cho lần sau; lỗi storage thì bỏ qua.
  const [sidebarThuGon, setSidebarThuGon] = useState(() => {
    try {
      return localStorage.getItem(KHOA_THU_GON) === "1";
    } catch {
      return false;
    }
  });
  const doiThuGon = () =>
    setSidebarThuGon((v) => {
      try {
        localStorage.setItem(KHOA_THU_GON, v ? "0" : "1");
      } catch {
        /* bỏ qua */
      }
      return !v;
    });

  return { cheDo, setCheDo, tutorDongVaiId, setTutorDongVaiId, toastMsg, toast, boLoc, moBoLoc, dongBoLoc, sidebarMo, setSidebarMo, sidebarThuGon, doiThuGon };
}

type AppState = ReturnType<typeof useGiaoDien> & ReturnType<typeof useNoiDungTutor> & ReturnType<typeof useLichVaVi> & ReturnType<typeof useDienDan>;

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const giaoDien = useGiaoDien();
  const noiDungTutor = useNoiDungTutor(giaoDien.toast);
  const lichVaVi = useLichVaVi();
  const dienDan = useDienDan(giaoDien.cheDo, giaoDien.tutorDongVaiId);

  return <AppContext.Provider value={{ ...giaoDien, ...noiDungTutor, ...lichVaVi, ...dienDan }}>{children}</AppContext.Provider>;
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
