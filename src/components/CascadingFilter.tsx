import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { khoas, monHocs, truongs } from "../data/mockData";
import { truongCuaMon } from "../lib/rules";

type Props = { truongBanDau?: string; khoaBanDau?: string; monBanDau?: string; onTim?: () => void };

// Bỏ dấu tiếng Việt để tìm "kinh te luong" vẫn ra "Kinh tế lượng"
const boDau = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

export default function CascadingFilter({ truongBanDau = "", khoaBanDau = "", monBanDau = "", onTim }: Props) {
  const navigate = useNavigate();
  const [truongId, setTruongId] = useState(truongBanDau);
  const [khoaId, setKhoaId] = useState(khoaBanDau);
  const [monId, setMonId] = useState(monBanDau);
  const [tuKhoa, setTuKhoa] = useState("");
  const [moGoiY, setMoGoiY] = useState(false);

  const dsKhoa = khoas.filter((k) => k.truongId === truongId);
  const dsMon = monHocs.filter((m) => m.khoaId === khoaId);

  const goiY = useMemo(() => {
    const q = boDau(tuKhoa.trim());
    if (!q) return [];
    return monHocs.filter((m) => boDau(m.ten).includes(q) || boDau(m.maHocPhan).includes(q)).slice(0, 8);
  }, [tuKhoa]);

  // Bấm một gợi ý → tự điền cả 3 cấp
  const chonGoiY = (id: string) => {
    const mon = monHocs.find((m) => m.id === id)!;
    const { khoa, truong } = truongCuaMon(mon);
    setTruongId(truong.id);
    setKhoaId(khoa.id);
    setMonId(mon.id);
    setTuKhoa(mon.ten);
    setMoGoiY(false);
  };

  return (
    <div>
      <div className="relative">
        <label htmlFor="tim-nhanh" className="mb-1.5 block text-sm font-medium text-slate-700">
          Tìm nhanh theo tên môn
        </label>
        <input
          id="tim-nhanh"
          type="search"
          autoComplete="off"
          placeholder="VD: Kinh tế lượng, Toán cao cấp…"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.target.value);
            setMoGoiY(true);
          }}
          onFocus={() => setMoGoiY(true)}
          onBlur={() => setMoGoiY(false)}
          className={inputCls}
        />
        {moGoiY && goiY.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            {goiY.map((m) => {
              const { khoa, truong } = truongCuaMon(m);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => chonGoiY(m.id)}
                    className="w-full px-4 py-2.5 text-left hover:bg-blue-50"
                  >
                    <span className="block font-medium text-slate-900">{m.ten}</span>
                    <span className="block text-xs text-slate-500">
                      {truong.tenVietTat} · {khoa.ten} · {m.maHocPhan}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        hoặc chọn lần lượt
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid gap-4">
        <div>
          <label htmlFor="truong" className="mb-1.5 block text-sm font-medium text-slate-700">
            1. Trường
          </label>
          <select
            id="truong"
            value={truongId}
            onChange={(e) => {
              setTruongId(e.target.value);
              setKhoaId("");
              setMonId("");
            }}
            className={inputCls}
          >
            <option value="">Chọn trường</option>
            {truongs.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tenVietTat} – {t.ten}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="khoa" className="mb-1.5 block text-sm font-medium text-slate-700">
            2. Khoa
          </label>
          <select
            id="khoa"
            value={khoaId}
            disabled={!truongId}
            onChange={(e) => {
              setKhoaId(e.target.value);
              setMonId("");
            }}
            className={inputCls}
          >
            <option value="">{truongId ? "Chọn khoa" : "Chọn trường trước"}</option>
            {dsKhoa.map((k) => (
              <option key={k.id} value={k.id}>
                {k.ten}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="mon" className="mb-1.5 block text-sm font-medium text-slate-700">
            3. Môn
          </label>
          <select id="mon" value={monId} disabled={!khoaId} onChange={(e) => setMonId(e.target.value)} className={inputCls}>
            <option value="">{khoaId ? "Chọn môn" : "Chọn khoa trước"}</option>
            {dsMon.map((m) => (
              <option key={m.id} value={m.id}>
                {m.ten} ({m.maHocPhan})
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        disabled={!monId}
        onClick={() => {
          onTim?.();
          navigate(`/mon/${monId}`);
        }}
        className="mt-6 w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Tìm tutor
      </button>
    </div>
  );
}
