import { useState, type FormEvent } from "react";
import { useApp } from "../../context/AppContext";
import { khoas, monHocs, tutorMons, type Diem, type Tutor, type TutorMon } from "../../data/mockData";
import { dinhDangTien, duDieuKienDay, layMon, truongCuaMon } from "../../lib/rules";
import { inputCls, labelCls, Truong } from "./formUi";

const DIEM: Diem[] = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"];
const NOI_DUNG = ["Giảng lại lý thuyết", "Chữa đề", "Ôn tập trọng tâm", "Hướng dẫn phần mềm", "Ứng dụng vào khoá luận"];
const LICH = ["Tối thứ 2", "Tối thứ 3", "Tối thứ 4", "Tối thứ 5", "Tối thứ 6", "Sáng thứ 7", "Chiều thứ 7", "Sáng chủ nhật", "Chiều chủ nhật"];

function Chon({ ds, chon, onChange }: { ds: string[]; chon: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ds.map((x) => {
        const co = chon.includes(x);
        return (
          <button
            key={x}
            type="button"
            aria-pressed={co}
            onClick={() => onChange(co ? chon.filter((y) => y !== x) : [...chon, x])}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              co ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-blue-600"
            }`}
          >
            {x}
          </button>
        );
      })}
    </div>
  );
}

/** Kết quả kiểm tra điều kiện, hiển thị ngay khi tutor chọn điểm. */
function KetQuaDieuKien({ tutor, diem }: { tutor: Tutor; diem: Diem }) {
  const gpaDat = tutor.gpa >= 3.6;
  const diemDat = diem === "A" || diem === "A+";
  const dat = gpaDat && diemDat;
  const Dong = ({ ok, children }: { ok: boolean; children: string }) => (
    <li className={`flex gap-2 ${ok ? "text-emerald-700" : "text-red-700"}`}>
      <span>{ok ? "✓" : "✗"}</span>
      {children}
    </li>
  );
  return (
    <div className={`rounded-xl p-4 ring-1 ${dat ? "bg-emerald-50 ring-emerald-200" : "bg-red-50 ring-red-200"}`}>
      <p className={`font-semibold ${dat ? "text-emerald-800" : "text-red-800"}`}>
        {dat ? "Đủ điều kiện nhận dạy môn này" : "Chưa đủ điều kiện nhận dạy môn này"}
      </p>
      <ul className="mt-2 space-y-1 text-sm">
        <Dong ok={gpaDat}>{`GPA tích luỹ ${tutor.gpa.toFixed(2)} ${gpaDat ? "≥" : "<"} 3.6`}</Dong>
        <Dong ok={diemDat}>{`Điểm môn ${diem} ${diemDat ? "đạt A/A+" : "chưa đạt A/A+"}`}</Dong>
      </ul>
    </div>
  );
}

function FormDangKy({ tutor, onXong }: { tutor: Tutor; onXong: () => void }) {
  const { luuTutorMon, toast } = useApp();
  const daDangKy = new Set(tutorMons.filter((x) => x.tutorId === tutor.id).map((x) => x.monId));
  const [khoaId, setKhoaId] = useState(tutor.khoaId);
  const [monId, setMonId] = useState("");
  const [diem, setDiem] = useState<Diem>("A");
  const [hocKy, setHocKy] = useState("HK1 2025–2026");
  const [noiDung, setNoiDung] = useState<string[]>(NOI_DUNG.slice(0, 3));
  const [lich, setLich] = useState<string[]>([]);
  const [gia, setGia] = useState({ giaBaiGiang: 200000, giaCoach: 400000, giaLopChung: 80000 });
  const [daThu, setDaThu] = useState(false);

  // Chỉ các khoa trong trường của tutor
  const dsKhoa = khoas.filter((k) => k.truongId === tutor.truongId);
  const dsMon = monHocs.filter((m) => m.khoaId === khoaId && !daDangKy.has(m.id));
  const tm: TutorMon = { tutorId: tutor.id, monId, diem, hocKy, noiDungKem: noiDung, lichRanh: lich, ...gia };
  const dat = duDieuKienDay(tutor, tm);

  const gui = (e: FormEvent) => {
    e.preventDefault();
    setDaThu(true);
    if (!monId || lich.length === 0 || !dat) return;
    luuTutorMon(tm);
    toast(`Đã đăng ký dạy ${layMon(monId)?.ten}`);
    onXong();
  };

  return (
    <form onSubmit={gui} className="space-y-5 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Đăng ký môn dạy mới</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <Truong nhan="Khoa">
          <select
            value={khoaId}
            onChange={(e) => {
              setKhoaId(e.target.value);
              setMonId("");
            }}
            className={inputCls}
          >
            {dsKhoa.map((k) => (
              <option key={k.id} value={k.id}>
                {k.ten}
              </option>
            ))}
          </select>
        </Truong>
        <Truong nhan="Môn" batBuoc loi={daThu && !monId ? "Vui lòng chọn môn." : undefined} goiY={dsMon.length === 0 ? "Bạn đã đăng ký hết các môn của khoa này." : undefined}>
          <select value={monId} onChange={(e) => setMonId(e.target.value)} className={inputCls} disabled={dsMon.length === 0}>
            <option value="">Chọn môn</option>
            {dsMon.map((m) => (
              <option key={m.id} value={m.id}>
                {m.ten} ({m.maHocPhan} · {m.soTinChi} TC)
              </option>
            ))}
          </select>
        </Truong>
        <Truong nhan="Điểm bạn đạt được ở môn này" batBuoc goiY="Điểm sẽ được đối chiếu với bảng điểm đã nộp.">
          <select value={diem} onChange={(e) => setDiem(e.target.value as Diem)} className={inputCls}>
            {DIEM.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Truong>
        <Truong nhan="Học kỳ đã học">
          <input value={hocKy} onChange={(e) => setHocKy(e.target.value)} className={inputCls} />
        </Truong>
      </div>

      <KetQuaDieuKien tutor={tutor} diem={diem} />

      <div>
        <p className={labelCls}>Nội dung có thể kèm</p>
        <Chon ds={NOI_DUNG} chon={noiDung} onChange={setNoiDung} />
      </div>
      <div>
        <p className={labelCls}>
          Lịch rảnh <span className="text-red-600">*</span>
        </p>
        <Chon ds={LICH} chon={lich} onChange={setLich} />
        {daThu && lich.length === 0 && <p className="mt-1 text-sm text-red-600">Chọn ít nhất một khung giờ.</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(
          [
            ["giaBaiGiang", "Bài giảng quay sẵn (trọn môn)", "Gợi ý 150.000–300.000đ"],
            ["giaCoach", "Gói coach (trọn gói)", "Gợi ý 300.000–600.000đ"],
            ["giaLopChung", "Lớp học chung (mỗi buổi)", "Gợi ý 60.000–120.000đ"],
          ] as const
        ).map(([k, nhan, goiY]) => (
          <Truong key={k} nhan={nhan} goiY={`${goiY} · hiện: ${dinhDangTien(gia[k])}`}>
            <input
              type="number"
              min={0}
              step={10000}
              value={gia[k]}
              onChange={(e) => setGia((g) => ({ ...g, [k]: Math.max(0, Number(e.target.value)) }))}
              className={inputCls}
            />
          </Truong>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onXong} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
          Huỷ
        </button>
        <button
          type="submit"
          disabled={!dat}
          className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {dat ? "Đăng ký môn dạy" : "Không đủ điều kiện đăng ký"}
        </button>
      </div>
    </form>
  );
}

export default function SubjectRegistration({ tutor }: { tutor: Tutor }) {
  const { xoaTutorMon, toast } = useApp();
  const [moForm, setMoForm] = useState(false);
  const cuaToi = tutorMons.filter((x) => x.tutorId === tutor.id);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Quy tắc: chỉ nhận dạy khi <b>GPA ≥ 3.6</b> và <b>điểm môn đạt A/A+</b>. Môn không đủ điều kiện sẽ tự ẩn khỏi người học.
        </p>
        {!moForm && (
          <button type="button" onClick={() => setMoForm(true)} className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
            + Đăng ký môn mới
          </button>
        )}
      </div>

      {moForm && <FormDangKy key={tutor.id} tutor={tutor} onXong={() => setMoForm(false)} />}

      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {cuaToi.length === 0 && <li className="p-5 text-sm text-slate-500">Bạn chưa đăng ký môn nào.</li>}
        {cuaToi.map((tm) => {
          const mon = layMon(tm.monId)!;
          const { truong } = truongCuaMon(mon);
          const dat = duDieuKienDay(tutor, tm);
          return (
            <li key={tm.monId} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-5">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">
                  {mon.ten} <span className="font-normal text-slate-500">– {truong.tenVietTat}</span>
                </p>
                <p className="text-sm text-slate-600">
                  {mon.maHocPhan} · {mon.soTinChi} TC · Điểm <b>{tm.diem}</b> · {tm.hocKy}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {dat ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    ✓ Đang hiển thị với người học
                  </span>
                ) : (
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                    Không đủ điều kiện · đang ẩn
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    xoaTutorMon(tutor.id, tm.monId);
                    toast(`Đã gỡ môn ${mon.ten}`);
                  }}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Gỡ
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
