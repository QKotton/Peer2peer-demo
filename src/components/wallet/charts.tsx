// Biểu đồ cho trang Ví – HTML/CSS thuần, không dùng thư viện.
// Quy ước (theo skill dataviz): màu đi theo loại gói; chữ dùng màu chữ, không dùng màu series;
// cột mảnh, bo 4px ở đầu dữ liệu, khe 2px giữa các đoạn; luôn có chú giải + bảng số liệu.
import { useState, type ReactNode } from "react";
import { tien, tienGon } from "../../lib/vi";

type Series = { khoa: string; ten: string; mau: string };
type Cot = { nhan: string; nhanDai: string; giaTri: Record<string, number> };

function mocTron(max: number) {
  if (max <= 0) return 1_000_000;
  const buoc = [100_000, 200_000, 250_000, 500_000, 1_000_000, 2_000_000, 2_500_000, 5_000_000, 10_000_000];
  const b = buoc.find((x) => max / x <= 4) ?? 20_000_000;
  return Math.ceil(max / b) * b;
}

export function ChuGiai({ series }: { series: Series[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
      {series.map((s) => (
        <li key={s.khoa} className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.mau }} />
          {s.ten}
        </li>
      ))}
    </ul>
  );
}

/** Cột chồng theo tháng. Chỉ gắn nhãn số cho cột cuối (tháng hiện tại); cột khác xem qua tooltip. */
export function CotChong({ cot, series, cao = 220 }: { cot: Cot[]; series: Series[]; cao?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const tongCot = cot.map((c) => series.reduce((s, x) => s + (c.giaTri[x.khoa] ?? 0), 0));
  const max = mocTron(Math.max(...tongCot));
  const vach = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  return (
    <div className="relative" style={{ height: cao + 28 }}>
      {/* Lưới + trục y */}
      <div className="absolute inset-x-0 top-0" style={{ height: cao }}>
        {vach.map((v) => (
          <div key={v} className="absolute inset-x-0 flex items-center gap-2" style={{ bottom: (v / max) * cao - 6 }}>
            <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-slate-400">{v === 0 ? "0" : tienGon(v)}</span>
            <span className={`h-px flex-1 ${v === 0 ? "bg-slate-300" : "bg-slate-100"}`} />
          </div>
        ))}
      </div>

      {/* Cột */}
      <div className="absolute bottom-0 left-11 right-0 flex items-end justify-around gap-2" style={{ top: 0 }}>
        {cot.map((c, i) => {
          const doan = series.map((s) => ({ ...s, v: c.giaTri[s.khoa] ?? 0 })).filter((d) => d.v > 0);
          const laCuoi = i === cot.length - 1;
          return (
            <div
              key={c.nhan}
              className="relative flex h-full max-w-16 flex-1 cursor-default flex-col items-center justify-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${c.nhanDai}: ${tien(tongCot[i])}`}
            >
              {laCuoi && tongCot[i] > 0 && (
                <span className="mb-1 text-[11px] font-semibold tabular-nums text-slate-700">{tienGon(tongCot[i])}</span>
              )}
              {/* Đoạn xếp từ dưới lên, khe 2px bằng màu nền; bo 4px ở đầu trên cùng */}
              <div className="flex w-full max-w-10 flex-col-reverse gap-[2px]" style={{ height: (tongCot[i] / max) * cao }}>
                {doan.map((d, k) => (
                  <div
                    key={d.khoa}
                    className={`w-full transition-opacity ${k === doan.length - 1 ? "rounded-t" : ""} ${hover !== null && hover !== i ? "opacity-40" : ""}`}
                    style={{ flexGrow: d.v, flexBasis: 0, background: d.mau, minHeight: 2 }}
                  />
                ))}
              </div>
              <span className="absolute -bottom-6 text-[11px] text-slate-500">{c.nhan}</span>

              {hover === i && (
                <div className="pointer-events-none absolute bottom-full z-10 mb-2 w-52 rounded-xl bg-slate-900 p-3 text-xs text-white shadow-lg">
                  <p className="mb-1.5 font-semibold">{c.nhanDai}</p>
                  {series.map((s) => (
                    <p key={s.khoa} className="flex items-center gap-2 py-0.5">
                      <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: s.mau }} />
                      <span className="flex-1 text-slate-300">{s.ten}</span>
                      <span className="tabular-nums">{tien(c.giaTri[s.khoa] ?? 0)}</span>
                    </p>
                  ))}
                  <p className="mt-1.5 flex justify-between border-t border-white/20 pt-1.5 font-semibold">
                    <span>Tổng</span>
                    <span className="tabular-nums">{tien(tongCot[i])}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Bảng số liệu đi kèm biểu đồ (cho người không phân biệt được màu / cần số chính xác). */
export function BangSoLieu({ cot, series }: { cot: Cot[]; series: Series[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
            <th className="py-2 font-medium">Tháng</th>
            {series.map((s) => (
              <th key={s.khoa} className="py-2 text-right font-medium">
                {s.ten}
              </th>
            ))}
            <th className="py-2 text-right font-medium">Tổng</th>
          </tr>
        </thead>
        <tbody>
          {cot.map((c) => (
            <tr key={c.nhan} className="border-b border-slate-100 tabular-nums text-slate-700">
              <td className="py-2">{c.nhanDai}</td>
              {series.map((s) => (
                <td key={s.khoa} className="py-2 text-right">
                  {tien(c.giaTri[s.khoa] ?? 0)}
                </td>
              ))}
              <td className="py-2 text-right font-semibold text-slate-900">{tien(series.reduce((a, s) => a + (c.giaTri[s.khoa] ?? 0), 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Thanh ngang có nhãn: tên · giá trị · tỷ lệ. */
export function ThanhNgang({ ds }: { ds: { khoa: string; ten: ReactNode; giaTri: number; tyLe: number; mau: string; phu?: string }[] }) {
  const max = Math.max(...ds.map((d) => d.giaTri), 1);
  return (
    <ul className="space-y-3">
      {ds.map((d) => (
        <li key={d.khoa}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-slate-700">{d.ten}</span>
            <span className="shrink-0 tabular-nums text-slate-900">
              <b>{tien(d.giaTri)}</b> <span className="text-xs text-slate-500">· {Math.round(d.tyLe * 100)}%</span>
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" title={`${tien(d.giaTri)} (${Math.round(d.tyLe * 100)}%)`}>
            <div className="h-full rounded-full" style={{ width: `${(d.giaTri / max) * 100}%`, background: d.mau }} />
          </div>
          {d.phu && <p className="mt-0.5 text-xs text-slate-500">{d.phu}</p>}
        </li>
      ))}
    </ul>
  );
}

export function The({ tieuDe, phai, children, className = "" }: { tieuDe: string; phai?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold text-slate-900">{tieuDe}</h2>
        {phai}
      </div>
      {children}
    </section>
  );
}
