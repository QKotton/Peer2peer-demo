import { useEffect } from "react";
import type { BaiGiang } from "../data/mockData";
import { nguonVideo } from "../lib/rules";

export default function VideoModal({ bg, onClose }: { bg: BaiGiang; onClose: () => void }) {
  const nguon = nguonVideo(bg);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/70 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Xem thử · Chương {bg.chuongSo}</p>
            <h3 className="font-bold text-slate-900">{bg.tieuDe}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Đóng">
            ×
          </button>
        </div>
        <div className="aspect-video bg-slate-900">
          {nguon?.loai === "file" && <video src={nguon.src} controls autoPlay className="h-full w-full" />}
          {nguon?.loai === "youtube" && (
            <iframe
              src={nguon.src}
              title={bg.tieuDe}
              className="h-full w-full"
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )}
          {!nguon && (
            <div className="grid h-full place-items-center text-center text-slate-300">
              <div>
                <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-white/10 text-2xl">▶</div>
                <p className="font-semibold text-white">Video mẫu – nhóm sẽ bổ sung</p>
                <p className="mt-1 text-sm">Thời lượng dự kiến {bg.thoiLuong}</p>
              </div>
            </div>
          )}
        </div>
        {bg.moTa && <p className="px-5 py-4 text-sm text-slate-600">{bg.moTa}</p>}
      </div>
    </div>
  );
}
