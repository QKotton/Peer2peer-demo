import type { DanhGia } from "../data/mockData";

export default function ReviewList({ ds }: { ds: DanhGia[] }) {
  if (ds.length === 0) {
    return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Môn này chưa có đánh giá.</p>;
  }
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {ds.map((d, i) => (
        <li key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-amber-500" aria-label={`${d.soSao} sao`}>
              {"★".repeat(d.soSao)}
              <span className="text-slate-200">{"★".repeat(5 - d.soSao)}</span>
            </span>
            <span className="text-xs text-slate-500">{d.nguoiDanhGia}</span>
          </div>
          <p className="mt-2 text-sm text-slate-700">“{d.nhanXet}”</p>
        </li>
      ))}
    </ul>
  );
}
