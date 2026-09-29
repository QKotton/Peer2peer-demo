import { cungNgay, gioPhut, oThang, THU_NGAN } from "../../lib/lich";
import { kieuLich, type SuKienLich } from "./suKienLich";

type Props = {
  thang: Date;
  homNay: Date;
  suKien: SuKienLich[];
  onChonSuKien: (s: SuKienLich) => void;
  onTaoTai: (batDau: Date) => void;
  onChonNgay: (d: Date) => void;
};

const TOI_DA = 3;

export default function MonthGrid({ thang, homNay, suKien, onChonSuKien, onTaoTai, onChonNgay }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-7 border-b border-slate-200">
        {[1, 2, 3, 4, 5, 6, 0].map((t) => (
          <span key={t} className="py-2 text-center text-[11px] font-semibold uppercase text-slate-500">
            {THU_NGAN[t]}
          </span>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
        {oThang(thang).map((d) => {
          const ds = suKien.filter((s) => cungNgay(s.batDau, d));
          const laHomNay = cungNgay(d, homNay);
          const khacThang = d.getMonth() !== thang.getMonth();
          return (
            <div
              key={d.toISOString()}
              onClick={() => onTaoTai(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0))}
              className={`min-h-[5.5rem] cursor-pointer overflow-hidden border-b border-r border-slate-200 p-1 ${khacThang ? "bg-slate-50/60" : ""}`}
            >
              <div className="mb-0.5 flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChonNgay(d);
                  }}
                  className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                    laHomNay ? "bg-blue-600 font-semibold text-white" : khacThang ? "text-slate-400 hover:bg-slate-100" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {d.getDate()}
                </button>
              </div>
              {ds.slice(0, TOI_DA).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChonSuKien(s);
                  }}
                  className={`mb-0.5 block w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] ${kieuLich(s.loai).nen}`}
                >
                  <span className="hidden sm:inline">{gioPhut(s.batDau)} </span>
                  {s.tieuDe}
                </button>
              ))}
              {ds.length > TOI_DA && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChonNgay(d);
                  }}
                  className="px-1.5 text-[11px] font-medium text-slate-600 hover:underline"
                >
                  +{ds.length - TOI_DA} nữa
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
