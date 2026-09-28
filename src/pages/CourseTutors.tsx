import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import TutorCard from "../components/TutorCard";
import { useApp, useDangPhatTrien } from "../context/AppContext";
import { giaThapNhat, layMon, saoTrungBinh, truongCuaMon, tutorsDayMon } from "../lib/rules";

type SapXep = "danhGia" | "gia" | "gpa";

export default function CourseTutors() {
  const { monId = "" } = useParams();
  const dangPhatTrien = useDangPhatTrien();
  const { moBoLoc } = useApp();
  const [sapXep, setSapXep] = useState<SapXep>("danhGia");
  const mon = layMon(monId);

  if (!mon) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Không tìm thấy môn học.</p>
        <Link to="/" className="mt-3 inline-block font-semibold text-blue-700 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  const { khoa, truong } = truongCuaMon(mon);
  // Chỉ lấy tutor qua được duDieuKienDay (bên trong tutorsDayMon)
  const ds = [...tutorsDayMon(mon.id)].sort((a, b) => {
    if (sapXep === "gia") return giaThapNhat(a.tm) - giaThapNhat(b.tm);
    if (sapXep === "gpa") return b.tutor.gpa - a.tutor.gpa;
    return saoTrungBinh(b.tutor.id, mon.id).tb - saoTrungBinh(a.tutor.id, mon.id).tb;
  });

  return (
    <div className="space-y-6">
      <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <button type="button" onClick={() => moBoLoc({ truong: truong.id })} className="hover:text-blue-700 hover:underline">
          {truong.tenVietTat}
        </button>
        <span>›</span>
        <button type="button" onClick={() => moBoLoc({ truong: truong.id, khoa: khoa.id })} className="hover:text-blue-700 hover:underline">
          {khoa.ten}
        </button>
        <span>›</span>
        <span className="font-medium text-slate-900">{mon.ten}</span>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {ds.length} tutor dạy {mon.ten}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {mon.maHocPhan} · {mon.soTinChi} tín chỉ · Chỉ hiện tutor có GPA ≥ 3.6 và điểm môn này đạt A/A+
          </p>
        </div>
        {ds.length > 1 && (
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Sắp xếp
            <select
              value={sapXep}
              onChange={(e) => setSapXep(e.target.value as SapXep)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            >
              <option value="danhGia">Đánh giá cao nhất</option>
              <option value="gia">Giá thấp nhất</option>
              <option value="gpa">GPA cao nhất</option>
            </select>
          </label>
        )}
      </div>

      {ds.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-900">Chưa có tutor đủ điều kiện cho môn này</p>
          <button
            type="button"
            onClick={dangPhatTrien}
            className="mt-4 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Đăng ký làm tutor môn này
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {ds.map(({ tutor, tm }) => (
            <TutorCard key={tutor.id} tutor={tutor} tm={tm} />
          ))}
        </div>
      )}
    </div>
  );
}
