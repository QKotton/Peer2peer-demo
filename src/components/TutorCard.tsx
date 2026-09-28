import { Link } from "react-router-dom";
import type { Tutor, TutorMon } from "../data/mockData";
import { dinhDangTien, giaThapNhat, layTruong, saoTrungBinh } from "../lib/rules";
import { Avatar, DiemMon, HuyHieuXacThuc, Sao } from "./ui";

export default function TutorCard({ tutor, tm }: { tutor: Tutor; tm: TutorMon }) {
  const { tb, soLuot } = saoTrungBinh(tutor.id, tm.monId);
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-4">
        <Avatar chu={tutor.anh} />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900">{tutor.hoTen}</h3>
          <p className="text-sm text-slate-600">
            {layTruong(tutor.truongId)?.tenVietTat} · {tutor.trangThai} · Khoá {tutor.namNhapHoc}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DiemMon diem={tm.diem} />
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">GPA {tutor.gpa.toFixed(2)}</span>
            {tutor.daXacThucBangDiem && <HuyHieuXacThuc />}
          </div>
          <div className="mt-2">
            <Sao tb={tb} soLuot={soLuot} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <p className="text-sm text-slate-600">
          Từ <span className="text-lg font-bold text-slate-900">{dinhDangTien(giaThapNhat(tm))}</span>
        </p>
        <Link
          to={`/tutor/${tutor.id}?mon=${tm.monId}`}
          className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Xem hồ sơ
        </Link>
      </div>
    </article>
  );
}
