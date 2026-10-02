import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Avatar, HuyHieuXacThuc, Sao } from "../components/ui";
import { khoaMinhChung, useApp } from "../context/AppContext";
import { monHocs, tutors } from "../data/mockData";
import { boDau } from "../lib/dinhDang";
import { layKhoa, layTruong, monNhanDay, saoTrungBinh, truongCuaMon } from "../lib/rules";

/** Danh bạ tutor: profile chung + lọc theo môn học. */
export default function TutorDirectory() {
  const { layMinhChung } = useApp();
  const [params, setParams] = useSearchParams();
  const monId = params.get("mon") ?? "";
  const [tuKhoa, setTuKhoa] = useState("");

  // Chỉ tutor có ít nhất 1 môn đủ điều kiện (đi qua duDieuKienDay trong monNhanDay)
  const coTheDay = tutors.map((t) => ({ tutor: t, cacMon: monNhanDay(t.id) })).filter((x) => x.cacMon.length > 0);

  // Chip lọc: chỉ những môn đang có tutor dạy
  const monCoTutor = monHocs.filter((m) => coTheDay.some((x) => x.cacMon.some((c) => c.mon.id === m.id)));

  const ds = coTheDay
    .filter((x) => !monId || x.cacMon.some((c) => c.mon.id === monId))
    .filter((x) => !tuKhoa.trim() || boDau(x.tutor.hoTen).includes(boDau(tuKhoa.trim())))
    .sort((a, b) => (monId ? saoTrungBinh(b.tutor.id, monId).tb - saoTrungBinh(a.tutor.id, monId).tb : b.tutor.gpa - a.tutor.gpa));

  const chonMon = (id: string) => setParams(id ? { mon: id } : {}, { replace: true });
  const chip = (active: boolean) =>
    `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Tutor</h1>
          <p className="mt-1 text-sm text-slate-600">Hồ sơ các anh chị khoá trên đã được xác thực GPA ≥ 3.6 và đạt A/A+ môn nhận dạy.</p>
        </div>
        <input
          type="search"
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          placeholder="Tìm theo tên tutor"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:w-64"
        />
      </div>

      <div className="an-thanh-cuon -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Lọc theo môn học">
        <button type="button" onClick={() => chonMon("")} className={chip(!monId)}>
          Tất cả môn
        </button>
        {monCoTutor.map((m) => (
          <button key={m.id} type="button" onClick={() => chonMon(m.id)} className={chip(monId === m.id)}>
            {m.ten} · {truongCuaMon(m).truong.tenVietTat}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-600">{ds.length} tutor</p>

      {ds.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">Không có tutor phù hợp.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ds.map(({ tutor, cacMon }) => {
            const monHienThi = cacMon.find((c) => c.mon.id === monId) ?? cacMon[0];
            const sao = saoTrungBinh(tutor.id, monHienThi.mon.id);
            const soMinhChung = [khoaMinhChung(tutor.id, "bang-diem"), khoaMinhChung(tutor.id, "the-sv"), ...tutor.thanhTich.map((t) => khoaMinhChung(tutor.id, "thanh-tich", t))].filter(
              (k) => layMinhChung(k)?.trangThai === "da-xac-thuc",
            ).length;
            return (
              <article key={tutor.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex gap-4">
                  <Avatar chu={tutor.anh} />
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-900">{tutor.hoTen}</h2>
                    <p className="text-sm text-slate-600">
                      {layTruong(tutor.truongId)?.tenVietTat} · {layKhoa(tutor.khoaId)?.ten}
                    </p>
                    <p className="text-sm text-slate-500">
                      {tutor.trangThai} · Khoá {tutor.namNhapHoc}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-bold text-blue-700">GPA {tutor.gpa.toFixed(2)}</span>
                  {tutor.daXacThucBangDiem && <HuyHieuXacThuc />}
                  {soMinhChung > 1 && <span className="text-xs text-slate-500">{soMinhChung} minh chứng đã xác thực</span>}
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-slate-700">{tutor.gioiThieu}</p>

                {tutor.thanhTich.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">
                    {tutor.thanhTich.slice(0, 2).map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="text-amber-500">🏅</span>
                        <span className="line-clamp-1">{t}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mb-4 mt-4 flex flex-wrap gap-1.5">
                  {cacMon.map(({ mon, tm }) => (
                    <span
                      key={mon.id}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${mon.id === monId ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700"}`}
                    >
                      {mon.ten} · {tm.diem}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500">
                    <Sao tb={sao.tb} soLuot={sao.soLuot} />
                    <p>môn {monHienThi.mon.ten}</p>
                  </div>
                  <Link
                    to={`/tutor/${tutor.id}?mon=${monHienThi.mon.id}`}
                    className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    Xem hồ sơ
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
