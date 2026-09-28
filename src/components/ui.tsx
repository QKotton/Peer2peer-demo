// Các mảnh giao diện nhỏ dùng chung
import type { ReactNode } from "react";
import type { Diem } from "../data/mockData";

const CO_AVATAR = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-20 w-20 text-2xl",
};

export function Avatar({ chu, size = "md" }: { chu: string; size?: keyof typeof CO_AVATAR }) {
  const cls = CO_AVATAR[size];
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700 ${cls}`} aria-hidden>
      {chu}
    </span>
  );
}

export function Sao({ tb, soLuot }: { tb: number; soLuot: number }) {
  if (soLuot === 0) return <span className="text-sm text-slate-500">Chưa có đánh giá</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="text-amber-500">★</span>
      <span className="font-semibold text-slate-900">{tb.toFixed(1)}</span>
      <span className="text-slate-500">({soLuot} đánh giá)</span>
    </span>
  );
}

export function HuyHieuXacThuc() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      ✓ Đã xác thực bảng điểm
    </span>
  );
}

export function DiemMon({ diem }: { diem: Diem }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-blue-700 px-2.5 py-1 text-sm font-bold text-white">
      {diem} <span className="ml-1 font-medium opacity-90">môn này</span>
    </span>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{children}</span>;
}
