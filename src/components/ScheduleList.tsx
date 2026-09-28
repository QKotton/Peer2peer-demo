import { Link } from "react-router-dom";
import { useDangPhatTrien } from "../context/AppContext";
import { buoiOnThiSapToi, dinhDangTien, layTruong } from "../lib/rules";
import { Icon } from "./icons";
import { Avatar } from "./ui";

const THU = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

function tachNgayGio(batDau: string, thoiLuongPhut: number) {
  const d = new Date(batDau);
  const ket = new Date(d.getTime() + thoiLuongPhut * 60000);
  const hm = (x: Date) => `${String(x.getHours()).padStart(2, "0")}:${String(x.getMinutes()).padStart(2, "0")}`;
  return {
    thu: THU[d.getDay()],
    ngay: String(d.getDate()).padStart(2, "0"),
    thang: `Th${d.getMonth() + 1}`,
    gio: `${hm(d)} – ${hm(ket)}`,
  };
}

export default function ScheduleList() {
  const dangPhatTrien = useDangPhatTrien();
  const ds = buoiOnThiSapToi();

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {ds.map(({ buoi, tutor, tm, mon }) => {
        const t = tachNgayGio(buoi.batDau, buoi.thoiLuongPhut);
        const conCho = buoi.soCho - buoi.daDangKy;
        const het = conCho <= 0;
        return (
          <li key={buoi.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
            <div className="flex items-center gap-4 sm:contents">
              {/* Khối ngày */}
              <div className="w-16 shrink-0 rounded-xl bg-blue-50 py-2 text-center ring-1 ring-blue-100">
                <p className="text-[11px] font-semibold uppercase text-blue-700">{t.thu}</p>
                <p className="text-2xl font-extrabold leading-none text-slate-900">{t.ngay}</p>
                <p className="text-xs text-slate-500">{t.thang}</p>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-blue-700">
                  {mon.ten} · {layTruong(tutor.truongId)?.tenVietTat}
                </p>
                <h3 className="font-bold text-slate-900">{buoi.tieuDe}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon ten="clock" className="h-4 w-4" />
                    {t.gio}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon ten="pin" className="h-4 w-4" />
                    {buoi.hinhThuc}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 ${het ? "text-red-600" : conCho <= 5 ? "text-amber-600" : ""}`}>
                    <Icon ten="users" className="h-4 w-4" />
                    {het ? "Đã kín chỗ" : `Còn ${conCho}/${buoi.soCho} chỗ`}
                  </span>
                </div>
                <Link to={`/tutor/${tutor.id}?mon=${mon.id}`} className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-700">
                  <Avatar chu={tutor.anh} size="xs" />
                  {tutor.hoTen} · {tm.diem} môn này
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{dinhDangTien(tm.giaLopChung)}</span> / buổi
              </p>
              <button
                type="button"
                onClick={dangPhatTrien}
                disabled={het}
                className="whitespace-nowrap rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                {het ? "Hết chỗ" : "Đăng ký tham gia"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
