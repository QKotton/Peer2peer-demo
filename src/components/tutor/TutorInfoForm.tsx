import { useState, type FormEvent } from "react";
import { useApp } from "../../context/AppContext";
import type { Tutor } from "../../data/mockData";
import { layKhoa, layTruong, monNhanDay } from "../../lib/rules";
import { Avatar } from "../ui";
import { inputCls, labelCls, Truong } from "./formUi";

const TRANG_THAI: Tutor["trangThai"][] = ["Sinh viên năm 3", "Sinh viên năm 4", "Cựu sinh viên"];

/** Ô nhập danh sách: mỗi dòng một mục, thêm / xoá được. */
function DanhSach({ nhan, goiY, ds, onChange }: { nhan: string; goiY: string; ds: string[]; onChange: (ds: string[]) => void }) {
  const [moi, setMoi] = useState("");
  const them = () => {
    if (!moi.trim()) return;
    onChange([...ds, moi.trim()]);
    setMoi("");
  };
  return (
    <div>
      <p className={labelCls}>{nhan}</p>
      <ul className="space-y-2">
        {ds.map((x, i) => (
          <li key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800">
            <span className="flex-1">{x}</span>
            <button type="button" onClick={() => onChange(ds.filter((_, j) => j !== i))} className="text-xs font-medium text-red-600 hover:underline">
              Xoá
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <input
          value={moi}
          onChange={(e) => setMoi(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              them();
            }
          }}
          placeholder={goiY}
          className={inputCls}
        />
        <button type="button" onClick={them} className="shrink-0 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200">
          Thêm
        </button>
      </div>
    </div>
  );
}

export default function TutorInfoForm({ tutor }: { tutor: Tutor }) {
  const { capNhatTutor, toast } = useApp();
  const [nhap, setNhap] = useState<Tutor>(() => ({ ...tutor }));
  const set = <K extends keyof Tutor>(k: K, v: Tutor[K]) => setNhap((t) => ({ ...t, [k]: v }));

  const gpaHopLe = nhap.gpa >= 0 && nhap.gpa <= 4;
  const hopLe = nhap.hoTen.trim() !== "" && gpaHopLe;
  const soMonTruoc = monNhanDay(tutor.id).length;

  const luu = (e: FormEvent) => {
    e.preventDefault();
    if (!hopLe) return;
    const chuCai = nhap.hoTen.trim().split(/\s+/).slice(-2).map((w) => w[0]?.toUpperCase() ?? "").join("");
    capNhatTutor(tutor.id, { ...nhap, hoTen: nhap.hoTen.trim(), anh: chuCai || tutor.anh });
    const soMonSau = monNhanDay(tutor.id).length;
    toast(soMonSau < soMonTruoc ? `Đã lưu. GPA mới làm ${soMonTruoc - soMonSau} môn không còn đủ điều kiện` : "Đã lưu thông tin chung");
  };

  return (
    <form onSubmit={luu} className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <Avatar chu={tutor.anh} size="lg" />
        <div className="text-sm text-slate-600">
          <p className="text-lg font-bold text-slate-900">{tutor.hoTen}</p>
          <p>
            {layTruong(tutor.truongId)?.ten} · {layKhoa(tutor.khoaId)?.ten}
          </p>
          <p className="mt-1 text-xs text-slate-500">Ảnh đại diện dùng chữ cái đầu của tên (bản demo không dùng ảnh thật).</p>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <Truong nhan="Họ và tên" batBuoc loi={!nhap.hoTen.trim() ? "Vui lòng nhập họ tên." : undefined}>
          <input value={nhap.hoTen} onChange={(e) => set("hoTen", e.target.value)} className={inputCls} />
        </Truong>
        <Truong nhan="Chuyên ngành">
          <input value={nhap.chuyenNganh} onChange={(e) => set("chuyenNganh", e.target.value)} className={inputCls} />
        </Truong>
        <Truong nhan="Năm nhập học">
          <input
            type="number"
            min={2010}
            max={2026}
            value={nhap.namNhapHoc}
            onChange={(e) => set("namNhapHoc", Number(e.target.value))}
            className={inputCls}
          />
        </Truong>
        <Truong nhan="Trạng thái">
          <select value={nhap.trangThai} onChange={(e) => set("trangThai", e.target.value as Tutor["trangThai"])} className={inputCls}>
            {TRANG_THAI.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Truong>
        <Truong
          nhan="GPA tích luỹ (thang 4)"
          batBuoc
          loi={!gpaHopLe ? "GPA phải từ 0 đến 4." : undefined}
          goiY={gpaHopLe && nhap.gpa < 3.6 ? "GPA dưới 3.6: bạn sẽ không đủ điều kiện nhận dạy môn nào." : "Cần ≥ 3.6 để nhận dạy. GPA được đối chiếu với bảng điểm ở tab Minh chứng."}
          canhBao={gpaHopLe && nhap.gpa < 3.6}
        >
          <input
            type="number"
            step={0.01}
            min={0}
            max={4}
            value={nhap.gpa}
            onChange={(e) => set("gpa", Number(e.target.value))}
            className={inputCls}
          />
        </Truong>
        <div className="md:col-span-2">
          <Truong nhan="Giới thiệu ngắn" goiY="2–3 câu về phong cách dạy của bạn.">
            <textarea rows={3} value={nhap.gioiThieu} onChange={(e) => set("gioiThieu", e.target.value)} className={inputCls} />
          </Truong>
        </div>
      </div>

      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3">
        <DanhSach nhan="Thành tích học tập" goiY="VD: Học bổng khuyến khích học tập 2 kỳ" ds={nhap.thanhTich} onChange={(v) => set("thanhTich", v)} />
        <DanhSach nhan="Hoạt động & kinh nghiệm" goiY="VD: Trợ giảng môn …" ds={nhap.hoatDong} onChange={(v) => set("hoatDong", v)} />
        <DanhSach nhan="Kỹ năng mềm có thể hướng dẫn" goiY="VD: Thuyết trình" ds={nhap.kyNangMem} onChange={(v) => set("kyNangMem", v)} />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setNhap({ ...tutor })} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
          Hoàn tác
        </button>
        <button
          type="submit"
          disabled={!hopLe}
          className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Lưu thông tin
        </button>
      </div>
    </form>
  );
}
