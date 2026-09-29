import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { cacMonDangHoc } from "../lib/rules";
import { TAB_TUTOR } from "../lib/tutorTabs";
import { Icon, type TenIcon } from "./icons";

const itemCls = (active: boolean) =>
  `flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition ${
    active ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-100"
  }`;

export default function Sidebar() {
  const { cheDo, moBoLoc, boLoc, sidebarMo, setSidebarMo } = useApp();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const dong = () => setSidebarMo(false);

  const Muc = ({ icon, nhan, to }: { icon: TenIcon; nhan: string; to: string }) => (
    <NavLink to={to} end onClick={dong} className={({ isActive }) => itemCls(isActive && !search)}>
      <Icon ten={icon} />
      {nhan}
    </NavLink>
  );

  const noiDung = (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-3" aria-label="Thanh chức năng">
      <Muc icon="home" nhan="Trang chủ" to="/" />
      <Link to="/lich-cua-toi" onClick={dong} className={itemCls(pathname === "/lich-cua-toi")}>
        <Icon ten="calendar" />
        {cheDo === "tutor" ? "Lịch dạy" : "Lịch của tôi"}
      </Link>
      <Link to="/tutors" onClick={dong} className={itemCls(pathname === "/tutors")}>
        <Icon ten="users" />
        Tutor
      </Link>
      <Link to="/tai-lieu" onClick={dong} className={itemCls(pathname === "/tai-lieu")}>
        <Icon ten="file" />
        Kho tài liệu
      </Link>
      <button type="button" onClick={() => moBoLoc()} className={itemCls(!!boLoc)}>
        <Icon ten="filter" />
        Lọc tutor
      </button>
      <button
        type="button"
        onClick={() => {
          dong();
          navigate("/?muc=lich");
        }}
        className={itemCls(pathname === "/" && search.includes("muc=lich"))}
      >
        <Icon ten="clock" />
        Lịch ôn thi
      </button>

      <hr className="my-3 border-slate-200" />
      {cheDo === "tutor" ? (
        <>
          <p className="px-3 pb-1 text-sm font-semibold text-slate-900">Quản lý tutor:</p>
          {TAB_TUTOR.map((t) => (
            <Link
              key={t.id}
              to={`/tutor-dashboard?tab=${t.id}`}
              onClick={dong}
              className={itemCls(pathname === "/tutor-dashboard" && (search.includes(`tab=${t.id}`) || (!search && t.id === "thong-tin")))}
            >
              <Icon ten={t.icon} />
              {t.nhan}
            </Link>
          ))}
        </>
      ) : (
        <>
          <p className="px-3 pb-1 text-sm font-semibold text-slate-900">Các môn học của bạn:</p>
          {cacMonDangHoc().map(({ mon, tutor, truong }) => {
            const dangMo = pathname === `/tutor/${tutor.id}` && search.includes(`mon=${mon.id}`);
            return (
              <Link key={mon.id} to={`/tutor/${tutor.id}?mon=${mon.id}`} onClick={dong} className={itemCls(dangMo)}>
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
      )}
    </nav>
  );

  return (
    <>
      {/* Desktop: cố định bên trái */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-slate-200 bg-white lg:block">{noiDung}</aside>

      {/* Mobile: drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarMo ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-slate-900/40 transition-opacity ${sidebarMo ? "opacity-100" : "opacity-0"}`} onClick={dong} />
        <aside
          className={`absolute inset-y-0 left-0 w-64 bg-white shadow-xl transition-transform ${sidebarMo ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-700 text-[10px] font-extrabold text-white">P2P</span>
            <span className="text-lg font-extrabold text-slate-900">Peer2Peer</span>
          </div>
          {noiDung}
        </aside>
      </div>
    </>
  );
}
