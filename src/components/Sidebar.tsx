import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { cacMonDangHoc } from "../lib/rules";
import { TAB_TUTOR } from "../lib/tutorTabs";
import { Icon, type TenIcon } from "./icons";

type Muc = { khoa: string; icon: TenIcon; nhan: string; dangMo: boolean; to?: string; onClick?: () => void };

/** Một mục menu. thuGon = kiểu "mini" của YouTube: biểu tượng + nhãn nhỏ bên dưới. */
function MucMenu({ m, thuGon, dong }: { m: Muc; thuGon: boolean; dong: () => void }) {
  const cls = thuGon
    ? `flex w-full flex-col items-center gap-1 rounded-xl px-1 py-3 text-[10px] leading-tight transition ${
        m.dangMo ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-100"
      }`
    : `flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition ${
        m.dangMo ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-100"
      }`;
  const ben = (
    <>
      <Icon ten={m.icon} className={thuGon ? "h-6 w-6" : "h-5 w-5"} />
      <span className={thuGon ? "w-full truncate text-center" : ""}>{m.nhan}</span>
    </>
  );
  return m.to ? (
    <Link to={m.to} onClick={dong} className={cls} title={thuGon ? m.nhan : undefined}>
      {ben}
    </Link>
  ) : (
    <button type="button" onClick={m.onClick} className={cls} title={thuGon ? m.nhan : undefined}>
      {ben}
    </button>
  );
}

export default function Sidebar() {
  const { cheDo, moBoLoc, boLoc, sidebarMo, setSidebarMo, sidebarThuGon } = useApp();
  const { pathname, search } = useLocation();
  const dong = () => setSidebarMo(false);

  const mucChinh: Muc[] = [
    { khoa: "home", icon: "home", nhan: "Trang chủ", to: "/", dangMo: pathname === "/" && !search.includes("tab=dien-dan") },
    { khoa: "lich", icon: "calendar", nhan: cheDo === "tutor" ? "Lịch dạy" : "Lịch của tôi", to: "/lich-cua-toi", dangMo: pathname === "/lich-cua-toi" },
    { khoa: "vi", icon: "wallet", nhan: "Ví của tôi", to: "/vi", dangMo: pathname === "/vi" },
    { khoa: "tutor", icon: "users", nhan: "Tutor", to: "/tutors", dangMo: pathname === "/tutors" },
    { khoa: "tai-lieu", icon: "file", nhan: "Kho tài liệu", to: "/tai-lieu", dangMo: pathname === "/tai-lieu" },
    { khoa: "loc", icon: "filter", nhan: "Lọc tutor", onClick: () => moBoLoc(), dangMo: !!boLoc },
  ];
  const mucTutor: Muc[] = TAB_TUTOR.map((t) => ({
    khoa: t.id,
    icon: t.icon,
    nhan: t.nhan,
    to: `/tutor-dashboard?tab=${t.id}`,
    dangMo: pathname === "/tutor-dashboard" && (search.includes(`tab=${t.id}`) || (!search && t.id === "thong-tin")),
  }));

  const noiDung = (thuGon: boolean) => (
    <nav className={`flex h-full flex-col gap-1 overflow-y-auto ${thuGon ? "px-1 py-2" : "p-3"}`} aria-label="Thanh chức năng">
      {mucChinh.map((m) => (
        <MucMenu key={m.khoa} m={m} thuGon={thuGon} dong={dong} />
      ))}

      <hr className={`border-slate-200 ${thuGon ? "mx-2 my-2" : "my-3"}`} />
      {cheDo === "tutor" ? (
        <>
          {!thuGon && <p className="px-3 pb-1 text-sm font-semibold text-slate-900">Quản lý tutor:</p>}
          {mucTutor.map((m) => (
            <MucMenu key={m.khoa} m={m} thuGon={thuGon} dong={dong} />
          ))}
        </>
      ) : (
        !thuGon && (
          <>
            <p className="px-3 pb-1 text-sm font-semibold text-slate-900">Các môn học của bạn:</p>
            {cacMonDangHoc().map(({ mon, tutor, truong }) => {
              const dangMo = pathname === `/tutor/${tutor.id}` && search.includes(`mon=${mon.id}`);
              return (
                <Link
                  key={mon.id}
                  to={`/tutor/${tutor.id}?mon=${mon.id}`}
                  onClick={dong}
                  className={`flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition ${
                    dangMo ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon ten="book" className="h-5 w-5 shrink-0" />
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate">
                      {mon.ten} – {truong.tenVietTat}
                    </span>
                    <span className="block truncate text-xs font-normal text-slate-500">{tutor.hoTen}</span>
                  </span>
                </Link>
              );
            })}
          </>
        )
      )}
    </nav>
  );

  return (
    <>
      {/* Desktop: cố định bên trái, thu gọn được bằng nút ☰ trên header */}
      <aside
        className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200 lg:block ${
          sidebarThuGon ? "w-[76px]" : "w-60"
        }`}
      >
        {noiDung(sidebarThuGon)}
      </aside>

      {/* Mobile: drawer, luôn hiển thị đầy đủ */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarMo ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-slate-900/40 transition-opacity ${sidebarMo ? "opacity-100" : "opacity-0"}`} onClick={dong} />
        <aside
          className={`absolute inset-y-0 left-0 w-64 bg-white shadow-xl transition-transform ${sidebarMo ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-700 text-[10px] font-extrabold text-white">P2P</span>
            <span className="text-lg font-extrabold text-slate-900">Peer2Peer</span>
          </div>
          {noiDung(false)}
        </aside>
      </div>
    </>
  );
}
