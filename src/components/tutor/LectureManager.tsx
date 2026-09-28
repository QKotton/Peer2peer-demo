import { useState } from "react";
import { useApp } from "../../context/AppContext";
import type { Tutor } from "../../data/mockData";
import { baiGiangCua, monNhanDay } from "../../lib/rules";
import LectureList from "../LectureList";
import UploadForm from "../UploadForm";
import { inputCls, labelCls } from "./formUi";

export default function LectureManager({ tutor }: { tutor: Tutor }) {
  const { baiGiangThem, themBaiGiang, xoaBaiGiang, toast } = useApp();
  const [monIdChon, setMonIdChon] = useState("");
  const [moForm, setMoForm] = useState(false);

  // Chỉ các môn đủ điều kiện mới được đăng bài giảng
  const cacMon = monNhanDay(tutor.id);
  const monDangChon = cacMon.find((x) => x.mon.id === monIdChon)?.mon ?? cacMon[0]?.mon;
  const ds = monDangChon ? baiGiangCua(tutor.id, monDangChon.id, baiGiangThem) : [];
  const idMoi = new Set(baiGiangThem.map((b) => b.id));
  const soTiepTheo = ds.reduce((max, b) => Math.max(max, b.chuongSo), 0) + 1;

  if (!monDangChon) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Bạn chưa có môn nào đủ điều kiện. Đăng ký môn ở tab <b>Môn dạy</b> trước khi đăng bài giảng.
      </p>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="block w-full max-w-sm">
          <span className={labelCls}>Môn (chỉ các môn đủ điều kiện)</span>
          <select
            value={monDangChon.id}
            onChange={(e) => {
              setMonIdChon(e.target.value);
              setMoForm(false);
            }}
            className={inputCls}
          >
            {cacMon.map(({ mon, tm }) => (
              <option key={mon.id} value={mon.id}>
                {mon.ten} ({mon.maHocPhan}) – điểm {tm.diem}
              </option>
            ))}
          </select>
        </label>
        {!moForm && (
          <button type="button" onClick={() => setMoForm(true)} className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
            + Thêm chương
          </button>
        )}
      </div>

      <h2 className="text-lg font-bold text-slate-900">
        {monDangChon.ten} · {ds.length} chương
      </h2>

      {moForm && (
        <UploadForm
          key={`${tutor.id}-${monDangChon.id}`}
          tutorId={tutor.id}
          monId={monDangChon.id}
          soChuongGoiY={soTiepTheo}
          onHuy={() => setMoForm(false)}
          onDaDang={(bg) => {
            themBaiGiang(bg);
            setMoForm(false);
            toast(`Đã đăng chương ${bg.chuongSo}`);
          }}
        />
      )}

      <LectureList
        ds={ds}
        cheDoTutor
        laChuongMoi={(id) => idMoi.has(id)}
        onXoa={(bg) => {
          xoaBaiGiang(bg.id);
          toast(`Đã xoá chương ${bg.chuongSo}`);
        }}
      />
    </section>
  );
}
