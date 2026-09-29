import { useState } from "react";
import { cungNgay, oThang, tenThang, THU_NGAN } from "../../lib/lich";
import type { SuKienLich } from "./suKienLich";

type Props = { ngayChon: Date; homNay: Date; suKien: SuKienLich[]; onChon: (d: Date) => void };

/** Lịch tháng thu nhỏ ở cột trái (giống Google Calendar). */
export default function MiniMonth({ ngayChon, homNay, suKien, onChon }: Props) {
  const [thang, setThang] = useState(() => new Date(ngayChon.getFullYear(), ngayChon.getMonth(), 1));
  const [thangTheoNgay, setThangTheoNgay] = useState(ngayChon);
  // Khi ngày đang xem đổi sang tháng khác (bấm ‹ › ở thanh trên) thì lịch nhỏ nhảy theo
  if (!cungNgay(thangTheoNgay, ngayChon)) {
    setThangTheoNgay(ngayChon);
    setThang(new Date(ngayChon.getFullYear(), ngayChon.getMonth(), 1));
  }

  const nut = "grid h-7 w-7 place-items-center rounded-full text-slate-600 hover:bg-slate-100";
  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-slate-800">{tenThang(thang)}</p>
        <div className="flex">
          <button type="button" aria-label="Tháng trước" className={nut} onClick={() => setThang(new Date(thang.getFullYear(), thang.getMonth() - 1, 1))}>
            ‹
          </button>
          <button type="button" aria-label="Tháng sau" className={nut} onClick={() => setThang(new Date(thang.getFullYear(), thang.getMonth() + 1, 1))}>
            ›
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px]">
        {[1, 2, 3, 4, 5, 6, 0].map((t) => (
          <span key={t} className="py-1 font-medium text-slate-500">
            {THU_NGAN[t]}
          </span>
        ))}
        {oThang(thang).map((d) => {
          const laHomNay = cungNgay(d, homNay);
          const dangChon = cungNgay(d, ngayChon);
          const coSuKien = suKien.some((s) => cungNgay(s.batDau, d));
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => onChon(d)}
              className={`relative mx-auto grid h-7 w-7 place-items-center rounded-full text-xs transition ${
                laHomNay
                  ? "bg-blue-600 font-bold text-white"
                  : dangChon
                    ? "bg-blue-100 font-semibold text-blue-800"
                    : d.getMonth() === thang.getMonth()
                      ? "text-slate-800 hover:bg-slate-100"
                      : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              {d.getDate()}
              {coSuKien && !laHomNay && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-blue-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
