import type { MonHoc, TaiLieu, Truong, Tutor } from "../../data/mockData";
import { Avatar } from "../ui";

export const MAU_DINH_DANG: Record<TaiLieu["dinhDang"], string> = {
  PDF: "bg-red-600",
  DOCX: "bg-blue-600",
  PPTX: "bg-orange-500",
  Ảnh: "bg-emerald-600",
};

export const ngayVN = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

type Props = { tl: TaiLieu; tutor: Tutor; mon: MonHoc; truong: Truong; moi?: boolean; onMo: () => void };

/** Thẻ tài liệu: "trang giấy" thu nhỏ + thông tin môn, tutor. */
export default function DocCard({ tl, tutor, mon, truong, moi, onMo }: Props) {
  return (
    <button
      type="button"
      onClick={onMo}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Trang giấy thu nhỏ */}
      <div className="relative h-36 bg-slate-100 px-6 pt-5">
        <div className="h-full rounded-t-md bg-white px-4 pt-3 shadow ring-1 ring-slate-200 transition group-hover:shadow-md">
          <p className="line-clamp-2 text-[11px] font-bold leading-tight text-slate-800">{tl.tieuDe}</p>
          <div className="mt-2 space-y-1.5">
            {[100, 92, 96, 70, 88].map((w, i) => (
              <div key={i} className="h-1.5 rounded bg-slate-200" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <span className={`absolute left-3 top-3 rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${MAU_DINH_DANG[tl.dinhDang]}`}>{tl.dinhDang}</span>
        {moi && <span className="absolute right-3 top-3 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-900">MỚI</span>}
        {!tl.mienPhi && (
          <span className="absolute bottom-2 right-3 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">🔒 Trong gói</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="w-fit rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">{tl.loai}</span>
        <h3 className="mt-2 line-clamp-2 font-semibold leading-snug text-slate-900">{tl.tieuDe}</h3>
        <p className="mt-1 text-sm text-slate-600">
          {mon.ten} · {truong.tenVietTat}
        </p>
        <p className="text-xs text-slate-500">
          {tl.soTrang} trang · {tl.luotXem.toLocaleString("vi-VN")} lượt xem · {ngayVN(tl.ngayDang)}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-slate-500">
          <Avatar chu={tutor.anh} size="xs" />
          <span className="truncate">
            {tutor.hoTen} {tutor.daXacThucBangDiem && <span className="text-emerald-600">✓</span>}
          </span>
        </div>
      </div>
    </button>
  );
}
