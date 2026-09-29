import { useEffect, useRef, useState, type FormEvent } from "react";
import { useApp } from "../../context/AppContext";
import { LOAI_TAI_LIEU, type LoaiTaiLieu, type TaiLieu, type Tutor } from "../../data/mockData";
import { monNhanDay, taiLieuHienThi } from "../../lib/rules";
import DocCard from "../docs/DocCard";
import DocViewer from "../docs/DocViewer";
import { inputCls, labelCls, Truong } from "./formUi";

const GIOI_HAN_MB = 20;

function dinhDangTuFile(f: File): TaiLieu["dinhDang"] | null {
  if (f.type === "application/pdf") return "PDF";
  if (f.type.startsWith("image/")) return "Ảnh";
  if (/\.docx?$/i.test(f.name)) return "DOCX";
  if (/\.pptx?$/i.test(f.name)) return "PPTX";
  return null;
}

function FormTaiLieu({ tutor, onXong }: { tutor: Tutor; onXong: () => void }) {
  const { themTaiLieu, toast } = useApp();
  const cacMon = monNhanDay(tutor.id); // chỉ môn đủ điều kiện
  const [monId, setMonId] = useState(cacMon[0]?.mon.id ?? "");
  const [tieuDe, setTieuDe] = useState("");
  const [loai, setLoai] = useState<LoaiTaiLieu>("Tóm tắt lý thuyết");
  const [moTa, setMoTa] = useState("");
  const [soTrang, setSoTrang] = useState(1);
  const [mienPhi, setMienPhi] = useState(true);
  const [camKet, setCamKet] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [daThu, setDaThu] = useState(false);
  const [dangDang, setDangDang] = useState(false);

  // URL xem trước: thu hồi nếu huỷ form; nếu đã đăng thì URL thuộc về tài liệu
  const url = useRef<string | null>(null);
  useEffect(() => () => {
    if (url.current) URL.revokeObjectURL(url.current);
  }, []);

  const chonFile = (f: File | undefined) => {
    if (!f) return;
    if (!dinhDangTuFile(f)) return toast("Chỉ nhận PDF, Word, PowerPoint hoặc ảnh");
    if (f.size > GIOI_HAN_MB * 1024 * 1024) return toast(`File tối đa ${GIOI_HAN_MB} MB`);
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = URL.createObjectURL(f);
    setFile(f);
    if (!tieuDe) setTieuDe(f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
  };

  const dang = (e: FormEvent) => {
    e.preventDefault();
    setDaThu(true);
    if (!tieuDe.trim() || !file || !camKet || !monId) return;
    setDangDang(true);
    // mô phỏng, chưa upload thật
    window.setTimeout(() => {
      themTaiLieu({
        id: `tl-${Date.now()}`,
        tutorId: tutor.id,
        monId,
        tieuDe: tieuDe.trim(),
        loai,
        moTa: moTa.trim() || "Tài liệu do tutor tự soạn.",
        dinhDang: dinhDangTuFile(file)!,
        soTrang: Math.max(1, soTrang),
        ngayDang: new Date().toISOString().slice(0, 10),
        luotXem: 0,
        mienPhi,
        fileUrl: url.current,
      });
      url.current = null;
      toast(`Đã đăng tài liệu "${tieuDe.trim()}" lên kho`);
      onXong();
    }, 1000);
  };

  return (
    <form onSubmit={dang} className="space-y-4 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm" noValidate>
      <h3 className="text-lg font-bold text-slate-900">Đăng tài liệu mới</h3>

      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-5 text-center transition hover:border-blue-500 hover:bg-blue-50/40">
        <input
          type="file"
          accept="application/pdf,image/*,.doc,.docx,.ppt,.pptx"
          className="sr-only"
          onChange={(e) => {
            chonFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {file ? (
          <span className="text-sm text-slate-700">
            <b>{file.name}</b> · {(file.size / 1024 / 1024).toFixed(2)} MB · <span className="text-blue-700">Đổi file</span>
          </span>
        ) : (
          <span className="text-sm text-slate-600">
            <span className="font-semibold text-blue-700">Chọn file</span> PDF, Word, PowerPoint hoặc ảnh (tối đa {GIOI_HAN_MB} MB)
          </span>
        )}
      </label>
      {daThu && !file && <p className="-mt-2 text-sm text-red-600">Vui lòng chọn file.</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <Truong nhan="Tiêu đề" batBuoc loi={daThu && !tieuDe.trim() ? "Vui lòng nhập tiêu đề." : undefined}>
          <input value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} className={inputCls} />
        </Truong>
        <Truong nhan="Môn (chỉ các môn đủ điều kiện)" batBuoc>
          <select value={monId} onChange={(e) => setMonId(e.target.value)} className={inputCls}>
            {cacMon.map(({ mon }) => (
              <option key={mon.id} value={mon.id}>
                {mon.ten} ({mon.maHocPhan})
              </option>
            ))}
          </select>
        </Truong>
        <Truong nhan="Loại tài liệu">
          <select value={loai} onChange={(e) => setLoai(e.target.value as LoaiTaiLieu)} className={inputCls}>
            {LOAI_TAI_LIEU.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Truong>
        <Truong nhan="Số trang">
          <input type="number" min={1} value={soTrang} onChange={(e) => setSoTrang(Number(e.target.value))} className={inputCls} />
        </Truong>
        <div className="md:col-span-2">
          <Truong nhan="Mô tả ngắn">
            <textarea rows={2} value={moTa} onChange={(e) => setMoTa(e.target.value)} className={inputCls} />
          </Truong>
        </div>
      </div>

      <div>
        <p className={labelCls}>Quyền xem</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              [true, "Miễn phí cho mọi người học"],
              [false, "Chỉ học viên đã mua gói bài giảng"],
            ] as const
          ).map(([v, nhan]) => (
            <button
              key={String(v)}
              type="button"
              aria-pressed={mienPhi === v}
              onClick={() => setMienPhi(v)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                mienPhi === v ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-blue-600"
              }`}
            >
              {nhan}
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <input type="checkbox" checked={camKet} onChange={(e) => setCamKet(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-700" />
        <span className="text-sm text-slate-800">Tôi cam kết tài liệu do tôi tự soạn, không sử dụng slide, giáo trình hay đề thi của giảng viên.</span>
      </label>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onXong} disabled={dangDang} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
          Huỷ
        </button>
        <button
          type="submit"
          disabled={!camKet || dangDang}
          className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {dangDang ? "Đang tải lên…" : "Đăng lên kho"}
        </button>
      </div>
    </form>
  );
}

export default function DocumentManager({ tutor }: { tutor: Tutor }) {
  const { taiLieuThem, xoaTaiLieu, toast } = useApp();
  const [moForm, setMoForm] = useState(false);
  const [dangXemId, setDangXemId] = useState<string | null>(null);

  const cuaToi = taiLieuHienThi(taiLieuThem).filter((x) => x.tutor.id === tutor.id);
  const idMoi = new Set(taiLieuThem.map((t) => t.id));
  const dangXem = cuaToi.find((x) => x.tl.id === dangXemId);

  if (monNhanDay(tutor.id).length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Bạn chưa có môn nào đủ điều kiện. Đăng ký môn ở tab <b>Môn dạy</b> trước khi đăng tài liệu.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {cuaToi.length} tài liệu đang hiển thị trong <b>Kho tài liệu</b>.
        </p>
        {!moForm && (
          <button type="button" onClick={() => setMoForm(true)} className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
            + Đăng tài liệu
          </button>
        )}
      </div>

      {moForm && <FormTaiLieu key={tutor.id} tutor={tutor} onXong={() => setMoForm(false)} />}

      {cuaToi.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">Bạn chưa đăng tài liệu nào.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cuaToi.map((x) => (
            <div key={x.tl.id} className="relative">
              <DocCard {...x} moi={idMoi.has(x.tl.id)} onMo={() => setDangXemId(x.tl.id)} />
              {idMoi.has(x.tl.id) && (
                <button
                  type="button"
                  onClick={() => {
                    xoaTaiLieu(x.tl.id);
                    toast("Đã gỡ tài liệu");
                  }}
                  className="absolute right-3 top-10 rounded-lg bg-white px-2 py-1 text-xs font-medium text-red-600 shadow ring-1 ring-slate-200 hover:bg-red-50"
                >
                  Gỡ
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {dangXem && <DocViewer {...dangXem} onDong={() => setDangXemId(null)} />}
    </div>
  );
}
