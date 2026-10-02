import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Icon } from "./icons";

export default function Header() {
  const { cheDo, setCheDo, moBoLoc, setSidebarMo, sidebarThuGon, doiThuGon } = useApp();
  // Máy tính: ☰ thu gọn / mở rộng cột trái. Điện thoại: ☰ mở menu trượt.
  const bamMenu = () => (window.matchMedia("(min-width: 1024px)").matches ? doiThuGon() : setSidebarMo(true));
  const navigate = useNavigate();

  const chon = (c: "hoc" | "tutor") => {
    setCheDo(c);
    navigate(c === "tutor" ? "/tutor-dashboard" : "/");
  };

  const nut = (c: "hoc" | "tutor", nhan: string) => (
    <button
      type="button"
      onClick={() => chon(c)}
      aria-pressed={cheDo === c}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
        cheDo === c ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {nhan}
    </button>
  );

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between gap-3 px-3 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={bamMenu}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            aria-label={sidebarThuGon ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            title={sidebarThuGon ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            <Icon ten="menu" />
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-700 text-xs font-extrabold text-white">P2P</span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-lg font-extrabold tracking-tight text-slate-900">Peer2Peer</span>
              <span className="block text-xs text-slate-500">Pioneers to Partners</span>
            </span>
          </Link>
        </div>

        
        <button
          type="button"
          onClick={() => moBoLoc()}
          aria-label="Tìm kiếm và lọc tutor"
          className="hidden h-10 max-w-xl flex-1 overflow-hidden rounded-full border border-slate-300 bg-white transition hover:border-slate-400 md:flex"
        >
          <span className="flex-1" />
          <span className="grid w-16 place-items-center border-l border-slate-300 bg-slate-50 text-slate-700">
            <Icon ten="search" />
          </span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" onClick={() => moBoLoc()} className="rounded-full p-2 text-slate-700 hover:bg-slate-100 md:hidden" aria-label="Lọc tutor">
            <Icon ten="search" />
          </button>
          <div className="flex rounded-full bg-slate-100 p-1" role="group" aria-label="Chế độ người dùng">
            {nut("hoc", "Người học")}
            {nut("tutor", "Tôi là tutor")}
          </div>
        </div>
      </div>
    </header>
  );
}
