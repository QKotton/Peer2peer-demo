import { useEffect, useRef, useState } from "react";
import { cungNgay, gioPhut, THU_NGAN } from "../../lib/lich";
import { kieuLich, type SuKienLich } from "./suKienLich";

const GIO_DAU = 6;
const GIO_CUOI = 24;
const CAO_MOI_GIO = 48; // px

type Props = {
  ngay: Date[]; // 7 ngày (tuần) hoặc 1 ngày
  homNay: Date;
  suKien: SuKienLich[];
  onChonSuKien: (s: SuKienLich) => void;
  onTaoTai: (batDau: Date) => void;
  onChonNgay: (d: Date) => void;
};

/** Xếp các sự kiện chồng giờ thành cột cạnh nhau (giống Google Calendar). */
function xepCot(ds: SuKienLich[]) {
  const kq: { s: SuKienLich; cot: number; soCot: number }[] = [];
  let cum: { s: SuKienLich; cot: number }[] = [];
  let ketThucCum = 0;
  const dongCum = () => {
    const soCot = Math.max(1, ...cum.map((x) => x.cot + 1));
    cum.forEach((x) => kq.push({ ...x, soCot }));
    cum = [];
  };
  for (const s of ds) {
    if (cum.length && s.batDau.getTime() >= ketThucCum) dongCum();
    const cotBan = new Set(cum.filter((x) => x.s.ketThuc > s.batDau).map((x) => x.cot));
    let cot = 0;
    while (cotBan.has(cot)) cot++;
    cum.push({ s, cot });
    ketThucCum = Math.max(ketThucCum, s.ketThuc.getTime());
  }
  if (cum.length) dongCum();
  return kq;
}

const viTri = (d: Date) => (d.getHours() + d.getMinutes() / 60 - GIO_DAU) * CAO_MOI_GIO;

export default function TimeGrid({ ngay, homNay, suKien, onChonSuKien, onTaoTai, onChonNgay }: Props) {
  const cuon = useRef<HTMLDivElement>(null);
  const [bayGio, setBayGio] = useState(() => new Date());

  // Cập nhật vạch "bây giờ" mỗi phút
  useEffect(() => {
    const id = window.setInterval(() => setBayGio(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);

  // Mở lịch ở khoảng 7h sáng
  useEffect(() => {
    cuon.current?.scrollTo({ top: (7 - GIO_DAU) * CAO_MOI_GIO });
  }, []);

  const gio = Array.from({ length: GIO_CUOI - GIO_DAU }, (_, i) => GIO_DAU + i);
  const cot = `3.5rem repeat(${ngay.length}, minmax(0, 1fr))`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Hàng tiêu đề ngày */}
      <div className="grid border-b border-slate-200 pr-2" style={{ gridTemplateColumns: cot }}>
        <span className="self-end pb-1 text-right text-[10px] text-slate-400">GMT+7&nbsp;</span>
        {ngay.map((d) => {
          const laHomNay = cungNgay(d, homNay);
          return (
            <button key={d.toISOString()} type="button" onClick={() => onChonNgay(d)} className="flex flex-col items-center py-2">
              <span className={`text-[11px] font-semibold uppercase ${laHomNay ? "text-blue-600" : "text-slate-500"}`}>{THU_NGAN[d.getDay()]}</span>
              <span
                className={`mt-0.5 grid h-10 w-10 place-items-center rounded-full text-xl transition sm:h-11 sm:w-11 sm:text-2xl ${
                  laHomNay ? "bg-blue-600 font-semibold text-white" : "text-slate-800 hover:bg-slate-100"
                }`}
              >
                {d.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lưới giờ */}
      <div ref={cuon} className="min-h-0 flex-1 overflow-y-auto">
        <div className="relative grid pr-2" style={{ gridTemplateColumns: cot, height: gio.length * CAO_MOI_GIO }}>
          <div className="relative">
            {gio.slice(1).map((h) => (
              <span key={h} className="absolute right-2 -translate-y-1/2 text-[10px] text-slate-500" style={{ top: (h - GIO_DAU) * CAO_MOI_GIO }}>
                {String(h).padStart(2, "0")}:00
              </span>
            ))}
          </div>

          {ngay.map((d) => {
            const cuaNgay = xepCot(suKien.filter((s) => cungNgay(s.batDau, d)));
            const laHomNay = cungNgay(d, homNay);
            return (
              <div
                key={d.toISOString()}
                className="relative cursor-pointer border-l border-slate-200"
                onClick={(e) => {
                  // Bấm ô trống → tạo sự kiện tại mốc 30 phút gần nhất
                  const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
                  const phut = Math.floor(((y / CAO_MOI_GIO) * 60) / 30) * 30 + GIO_DAU * 60;
                  onTaoTai(new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(phut / 60), phut % 60));
                }}
              >
                {gio.map((h) => (
                  <div key={h} className="border-b border-slate-100" style={{ height: CAO_MOI_GIO }} />
                ))}

                {cuaNgay.map(({ s, cot: c, soCot }) => {
                  const top = Math.max(0, viTri(s.batDau));
                  const cao = Math.max(22, viTri(s.ketThuc) - top - 2);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChonSuKien(s);
                      }}
                      className={`absolute overflow-hidden rounded-md px-1.5 py-0.5 text-left text-[11px] leading-tight shadow-sm ring-1 ring-white transition hover:z-10 hover:shadow-md ${kieuLich(s.loai).nen}`}
                      style={{ top, height: cao, left: `calc(${(c / soCot) * 100}% + 2px)`, width: `calc(${100 / soCot}% - 4px)` }}
                    >
                      <span className="block truncate font-semibold">{s.tieuDe}</span>
                      {cao > 34 && (
                        <span className="block truncate opacity-90">
                          {gioPhut(s.batDau)} – {gioPhut(s.ketThuc)}
                        </span>
                      )}
                    </button>
                  );
                })}

                {laHomNay && viTri(bayGio) > 0 && (
                  <div className="pointer-events-none absolute inset-x-0 z-20" style={{ top: viTri(bayGio) }}>
                    <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-0.5 bg-red-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
