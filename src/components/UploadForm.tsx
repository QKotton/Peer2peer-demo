import { useEffect, useRef, useState, type FormEvent } from "react";
import type { BaiGiang } from "../data/mockData";

type Props = {
  tutorId: string;
  monId: string;
  soChuongGoiY: number;
  onDaDang: (bg: BaiGiang) => void;
  onHuy: () => void;
};

const dinhDangDungLuong = (bytes: number) =>
  bytes >= 1024 * 1024 * 1024
    ? `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const dinhDangThoiLuong = (giay: number) => {
  if (!Number.isFinite(giay)) return "--:--";
  const p = Math.floor(giay / 60);
  const g = Math.floor(giay % 60);
  return `${p}:${String(g).padStart(2, "0")}`;
};

export default function UploadForm({ tutorId, monId, soChuongGoiY, onDaDang, onHuy }: Props) {
  const [soChuong, setSoChuong] = useState(soChuongGoiY);
  const [tieuDe, setTieuDe] = useState("");
  const [moTa, setMoTa] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thoiLuong, setThoiLuong] = useState("--:--");
  const [xemThu, setXemThu] = useState(false);
  const [camKet, setCamKet] = useState(false);
  const [daThu, setDaThu] = useState(false);
  const [tienTrinh, setTienTrinh] = useState<number | null>(null);

  // Giữ URL preview hiện tại để thu hồi khi huỷ form (nếu đã đăng thì URL được chuyển cho Context)
  const urlChuaDang = useRef<string | null>(null);
  useEffect(() => () => {
    if (urlChuaDang.current) URL.revokeObjectURL(urlChuaDang.current);
  }, []);

  const chonFile = (f: File | null) => {
    if (urlChuaDang.current) URL.revokeObjectURL(urlChuaDang.current);
    const url = f ? URL.createObjectURL(f) : null;
    urlChuaDang.current = url;
    setFile(f);
    setPreviewUrl(url);
    setThoiLuong("--:--");
  };

  const loiTieuDe = daThu && !tieuDe.trim();
  const loiFile = daThu && !file;
  const dangDang = tienTrinh !== null;

  const dang = (e: FormEvent) => {
    e.preventDefault();
    setDaThu(true);
    if (!tieuDe.trim() || !file || !camKet || !previewUrl) return;

    // mô phỏng, chưa upload thật
    setTienTrinh(0);
    const batDau = Date.now();
    const THOI_GIAN = 1500;
    const id = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - batDau) / THOI_GIAN) * 100);
      setTienTrinh(p);
      if (p >= 100) {
        window.clearInterval(id);
        urlChuaDang.current = null; // URL giờ thuộc về chương đã đăng, không thu hồi ở đây
        onDaDang({
          id: `${tutorId}-${monId}-u${Date.now()}`,
          tutorId,
          monId,
          chuongSo: soChuong,
          tieuDe: tieuDe.trim(),
          moTa: moTa.trim(),
          thoiLuong,
          videoUrl: previewUrl,
          xemThu,
          trangThai: "Đã đăng",
        });
      }
    }, 50);
  };

  const inputCls =
    "w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <form onSubmit={dang} className="space-y-4 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm" noValidate>
      <h3 className="text-lg font-bold text-slate-900">Thêm chương mới</h3>

      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <div>
          <label htmlFor="so-chuong" className="mb-1.5 block text-sm font-medium text-slate-700">
            Số chương
          </label>
          <input
            id="so-chuong"
            type="number"
            min={1}
            value={soChuong}
            onChange={(e) => setSoChuong(Math.max(1, Number(e.target.value) || 1))}
            className={`${inputCls} border-slate-300`}
          />
        </div>
        <div>
          <label htmlFor="tieu-de" className="mb-1.5 block text-sm font-medium text-slate-700">
            Tên chương <span className="text-red-600">*</span>
          </label>
          <input
            id="tieu-de"
            value={tieuDe}
            onChange={(e) => setTieuDe(e.target.value)}
            placeholder="VD: Kiểm định giả thuyết trong mô hình hồi quy"
            className={`${inputCls} ${loiTieuDe ? "border-red-500" : "border-slate-300"}`}
          />
          {loiTieuDe && <p className="mt-1 text-sm text-red-600">Vui lòng nhập tên chương.</p>}
        </div>
      </div>

      <div>
        <label htmlFor="mo-ta" className="mb-1.5 block text-sm font-medium text-slate-700">
          Mô tả ngắn
        </label>
        <textarea
          id="mo-ta"
          rows={2}
          value={moTa}
          onChange={(e) => setMoTa(e.target.value)}
          className={`${inputCls} border-slate-300`}
        />
      </div>

      <div>
        <label htmlFor="file-video" className="mb-1.5 block text-sm font-medium text-slate-700">
          File video <span className="text-red-600">*</span>
        </label>
        <input
          id="file-video"
          type="file"
          accept="video/*"
          onChange={(e) => chonFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        {loiFile && <p className="mt-1 text-sm text-red-600">Vui lòng chọn file video.</p>}
        {file && (
          <p className="mt-2 text-sm text-slate-600">
            <span className="font-medium text-slate-900">{file.name}</span> · {dinhDangDungLuong(file.size)} · {thoiLuong}
          </p>
        )}
        {previewUrl && (
          <video
            src={previewUrl}
            controls
            onLoadedMetadata={(e) => setThoiLuong(dinhDangThoiLuong(e.currentTarget.duration))}
            className="mt-3 aspect-video w-full rounded-xl bg-slate-900"
          />
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-slate-800">Cho xem thử miễn phí</span>
        <span className="relative inline-flex">
          <input type="checkbox" checked={xemThu} onChange={(e) => setXemThu(e.target.checked)} className="peer sr-only" />
          <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-700" />
          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <input
          type="checkbox"
          checked={camKet}
          onChange={(e) => setCamKet(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-700"
        />
        <span className="text-sm text-slate-800">
          Tôi cam kết nội dung do tôi tự soạn, không sử dụng slide, giáo trình hay đề thi của giảng viên.
        </span>
      </label>

      {dangDang && (
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-700 transition-[width]" style={{ width: `${tienTrinh}%` }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">Đang tải lên… {Math.round(tienTrinh ?? 0)}%</p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onHuy}
          disabled={dangDang}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={!camKet || dangDang}
          className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Đăng
        </button>
      </div>
    </form>
  );
}
