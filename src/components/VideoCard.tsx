import { Link } from "react-router-dom";
import type { BaiGiang, MonHoc, Tutor } from "../data/mockData";
import { layTruong } from "../lib/rules";
import { Avatar } from "./ui";

// Mỗi môn một dải màu cho thumbnail (không dùng ảnh thật)
const MAU: Record<string, string> = {
  "Kinh tế lượng": "from-blue-700 to-indigo-500",
  "Toán cao cấp": "from-emerald-600 to-teal-400",
  "Tài chính doanh nghiệp": "from-amber-600 to-orange-400",
  "Nguyên lý kế toán": "from-rose-600 to-pink-400",
  "Kế toán tài chính": "from-fuchsia-700 to-purple-400",
  "Kinh tế vi mô": "from-cyan-700 to-sky-400",
  "Lý thuyết xác suất và thống kê": "from-violet-700 to-indigo-400",
  "Thống kê kinh tế": "from-lime-700 to-green-400",
  "Quản trị chất lượng": "from-sky-700 to-cyan-400",
  "Quản trị chiến lược 2": "from-red-700 to-rose-400",
  "Quản trị vận hành 2": "from-teal-700 to-emerald-400",
  "Khởi sự kinh doanh": "from-orange-600 to-amber-400",
  "Quản trị chuỗi cung ứng": "from-indigo-700 to-blue-400",
  "Quản trị chi phí kinh doanh": "from-purple-700 to-fuchsia-400",
};

type Props = { bg: BaiGiang; tutor: Tutor; mon: MonHoc; moi: boolean; onXem: () => void };

export default function VideoCard({ bg, tutor, mon, moi, onXem }: Props) {
  return (
    <article className="group">
      <button type="button" onClick={onXem} className="block w-full text-left" aria-label={`Xem ${bg.tieuDe}`}>
        <div className={`relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br ${MAU[mon.ten] ?? "from-slate-700 to-slate-500"}`}>
          <div className="absolute inset-0 flex flex-col justify-between p-3 text-white sm:p-4">
            <span className="w-fit rounded-md bg-black/25 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
              {layTruong(tutor.truongId)?.tenVietTat} · {mon.maHocPhan}
            </span>
            <div>
              <p className="text-lg font-extrabold leading-tight drop-shadow sm:text-xl">{mon.ten}</p>
              <p className="text-sm opacity-90">Chương {bg.chuongSo}</p>
            </div>
          </div>
          <span className="absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/20">
            <span className="grid h-12 w-12 scale-90 place-items-center rounded-full bg-white/90 text-blue-700 opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
              ▶
            </span>
          </span>
          <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-semibold text-white">{bg.thoiLuong}</span>
          {moi && <span className="absolute right-2 top-2 rounded bg-amber-400 px-1.5 py-0.5 text-xs font-bold text-slate-900">MỚI</span>}
        </div>
      </button>
      <div className="mt-3 flex gap-3">
        <Link to={`/tutor/${tutor.id}?mon=${mon.id}`} className="shrink-0">
          <Avatar chu={tutor.anh} size="sm" />
        </Link>
        <div className="min-w-0">
          <button type="button" onClick={onXem} className="line-clamp-2 text-left font-semibold leading-snug text-slate-900">
            {bg.tieuDe}
          </button>
          <Link to={`/tutor/${tutor.id}?mon=${mon.id}`} className="mt-0.5 block text-sm text-slate-600 hover:text-slate-900">
            {tutor.hoTen} {tutor.daXacThucBangDiem && <span className="text-emerald-600" title="Đã xác thực bảng điểm">✓</span>}
          </Link>
          <p className="text-sm text-slate-500">
            GPA {tutor.gpa.toFixed(2)} · {bg.xemThu ? "Xem thử miễn phí" : "Trong gói bài giảng"}
          </p>
        </div>
      </div>
    </article>
  );
}
