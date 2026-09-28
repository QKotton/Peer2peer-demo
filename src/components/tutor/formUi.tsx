// Mảnh giao diện dùng chung cho các form ở chế độ tutor
import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400";

export const labelCls = "mb-1.5 block text-sm font-medium text-slate-700";

type Props = { nhan: string; batBuoc?: boolean; loi?: string; goiY?: string; canhBao?: boolean; children: ReactNode };

export function Truong({ nhan, batBuoc, loi, goiY, canhBao, children }: Props) {
  return (
    <label className="block">
      <span className={labelCls}>
        {nhan} {batBuoc && <span className="text-red-600">*</span>}
      </span>
      {children}
      {loi ? (
        <span className="mt-1 block text-sm text-red-600">{loi}</span>
      ) : (
        goiY && <span className={`mt-1 block text-xs ${canhBao ? "font-medium text-amber-700" : "text-slate-500"}`}>{goiY}</span>
      )}
    </label>
  );
}

export type TrangThaiMinhChung = "chua-nop" | "dang-cho" | "da-xac-thuc";

export function NhanTrangThai({ tt }: { tt: TrangThaiMinhChung }) {
  if (tt === "da-xac-thuc")
    return <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">✓ Đã xác thực</span>;
  if (tt === "dang-cho")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
        Đang xác thực…
      </span>
    );
  return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">Chưa nộp</span>;
}
