import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import CascadingFilter from "./CascadingFilter";
import { Icon } from "./icons";

/** Panel trượt từ trái chứa bộ lọc Trường → Khoa → Môn. Mở từ "Lọc tutor" trên thanh chức năng. */
export default function FilterPanel() {
  const { boLoc, dongBoLoc } = useApp();
  const mo = boLoc !== null;

  useEffect(() => {
    if (!mo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dongBoLoc();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mo, dongBoLoc]);

  return (
    <div className={`fixed inset-0 z-50 ${mo ? "" : "pointer-events-none"}`} aria-hidden={!mo}>
      <div className={`absolute inset-0 bg-slate-900/40 transition-opacity ${mo ? "opacity-100" : "opacity-0"}`} onClick={dongBoLoc} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Lọc tutor"
        className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          mo ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-2">
            <Icon ten="filter" />
            <h2 className="text-lg font-bold text-slate-900">Lọc tutor</h2>
          </div>
          <button type="button" onClick={dongBoLoc} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Đóng">
            <Icon ten="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <p className="mb-5 text-sm text-slate-600">
            Chỉ hiện tutor có GPA tích luỹ ≥ 3.6 và đạt A/A+ đúng môn bạn chọn.
          </p>
          {boLoc && (
            <CascadingFilter
              key={`${boLoc.truong}-${boLoc.khoa}`}
              truongBanDau={boLoc.truong}
              khoaBanDau={boLoc.khoa}
              onTim={dongBoLoc}
            />
          )}
        </div>
      </aside>
    </div>
  );
}
