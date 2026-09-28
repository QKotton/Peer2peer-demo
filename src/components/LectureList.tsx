import { useState } from "react";
import type { BaiGiang } from "../data/mockData";
import VideoModal from "./VideoModal";

type Props = {
  ds: BaiGiang[];
  /** Chế độ tutor: tutor xem được mọi chương và xoá được chương vừa upload */
  cheDoTutor?: boolean;
  laChuongMoi?: (id: string) => boolean;
  onXoa?: (bg: BaiGiang) => void;
};

export default function LectureList({ ds, cheDoTutor = false, laChuongMoi, onXoa }: Props) {
  const [dangXem, setDangXem] = useState<BaiGiang | null>(null);

  if (ds.length === 0) {
    return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Chưa có chương bài giảng nào.</p>;
  }

  return (
    <>
      <ol className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {ds.map((bg) => {
          const moi = laChuongMoi?.(bg.id);
          const xemDuoc = bg.xemThu || cheDoTutor;
          return (
            <li key={bg.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                {bg.chuongSo}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">
                  {bg.tieuDe}
                  {moi && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Mới</span>}
                </p>
                <p className="text-xs text-slate-500">
                  {bg.thoiLuong}
                  {cheDoTutor && (
                    <>
                      {" · "}
                      <span className="text-emerald-700">{bg.trangThai}</span>
                      {bg.xemThu && " · Xem thử miễn phí"}
                    </>
                  )}
                </p>
              </div>
              {xemDuoc ? (
                <button
                  type="button"
                  onClick={() => setDangXem(bg)}
                  className="shrink-0 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  ▶ {cheDoTutor ? "Xem" : "Xem thử"}
                </button>
              ) : (
                <span className="shrink-0 px-3 text-lg" title="Mua gói để mở khoá" aria-label="Đã khoá">
                  🔒
                </span>
              )}
              {moi && onXoa && (
                <button type="button" onClick={() => onXoa(bg)} className="shrink-0 text-sm font-medium text-red-600 hover:underline">
                  Xoá
                </button>
              )}
            </li>
          );
        })}
      </ol>
      {dangXem && <VideoModal bg={dangXem} onClose={() => setDangXem(null)} />}
    </>
  );
}
