import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DocCard from "../components/docs/DocCard";
import DocViewer from "../components/docs/DocViewer";
import { useApp } from "../context/AppContext";
import { khoas, LOAI_TAI_LIEU, monHocs, truongs } from "../data/mockData";
import { taiLieuHienThi } from "../lib/rules";

const boDau = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();

const selectCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400";

/** Kho tài liệu do tutor tự soạn. Bộ lọc lưu trên URL để gửi link được. */
export default function DocumentLibrary() {
  const { taiLieuThem } = useApp();
  const [params, setParams] = useSearchParams();
  const [dangXemId, setDangXemId] = useState<string | null>(null);

  const truong = params.get("truong") ?? "";
  const khoa = params.get("khoa") ?? "";
  const mon = params.get("mon") ?? "";
  const loai = params.get("loai") ?? "";
  const q = params.get("q") ?? "";
  const sx = params.get("sx") ?? "moi";

  // Đổi một bộ lọc; đổi cấp cha thì xoá các cấp con
  const dat = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v);
    else p.delete(k);
    if (k === "truong") (p.delete("khoa"), p.delete("mon"));
    if (k === "khoa") p.delete("mon");
    setParams(p, { replace: true });
  };

  const tatCa = taiLieuHienThi(taiLieuThem);
  const idMoi = new Set(taiLieuThem.map((t) => t.id));
  const ds = tatCa
    .filter((x) => !truong || x.truong.id === truong)
    .filter((x) => !khoa || x.khoa.id === khoa)
    .filter((x) => !mon || x.mon.id === mon)
    .filter((x) => !loai || x.tl.loai === loai)
    .filter((x) => !q.trim() || boDau(`${x.tl.tieuDe} ${x.mon.ten} ${x.tutor.hoTen}`).includes(boDau(q.trim())))
    .sort((a, b) => (sx === "xem" ? b.tl.luotXem - a.tl.luotXem : 0));
  const dangXem = tatCa.find((x) => x.tl.id === dangXemId);

  const chip = (active: boolean) =>
    `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`;
  const demTheoTruong = (id: string) => tatCa.filter((x) => x.truong.id === id).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Kho tài liệu</h1>
          <p className="mt-1 text-sm text-slate-600">Tóm tắt, đề cương, bài tập do tutor đủ điều kiện tự soạn – đúng trường, đúng môn.</p>
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => dat("q", e.target.value)}
          placeholder="Tìm tài liệu, môn, tutor…"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:w-72"
        />
      </div>

      {/* Lọc theo trường */}
      <div className="an-thanh-cuon -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Lọc theo trường">
        <button type="button" onClick={() => dat("truong", "")} className={chip(!truong)}>
          Tất cả trường · {tatCa.length}
        </button>
        {truongs.map((t) => (
          <button key={t.id} type="button" onClick={() => dat("truong", t.id)} className={chip(truong === t.id)} title={t.ten}>
            {t.tenVietTat} · {demTheoTruong(t.id)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-xs font-medium text-slate-600">
          Khoa
          <select value={khoa} disabled={!truong} onChange={(e) => dat("khoa", e.target.value)} className={`mt-1 ${selectCls}`}>
            <option value="">{truong ? "Tất cả khoa" : "Chọn trường trước"}</option>
            {khoas
              .filter((k) => k.truongId === truong)
              .map((k) => (
                <option key={k.id} value={k.id}>
                  {k.ten}
                </option>
              ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-slate-600">
          Môn
          <select value={mon} disabled={!khoa} onChange={(e) => dat("mon", e.target.value)} className={`mt-1 ${selectCls}`}>
            <option value="">{khoa ? "Tất cả môn" : "Chọn khoa trước"}</option>
            {monHocs
              .filter((m) => m.khoaId === khoa)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.ten}
                </option>
              ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-slate-600">
          Loại tài liệu
          <select value={loai} onChange={(e) => dat("loai", e.target.value)} className={`mt-1 ${selectCls}`}>
            <option value="">Tất cả loại</option>
            {LOAI_TAI_LIEU.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-slate-600">
          Sắp xếp
          <select value={sx} onChange={(e) => dat("sx", e.target.value === "moi" ? "" : e.target.value)} className={`mt-1 ${selectCls}`}>
            <option value="moi">Mới nhất</option>
            <option value="xem">Xem nhiều nhất</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <p>{ds.length} tài liệu</p>
        {(truong || loai || q) && (
          <button type="button" onClick={() => setParams({}, { replace: true })} className="font-medium text-blue-700 hover:underline">
            Xoá bộ lọc
          </button>
        )}
      </div>

      {ds.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">Chưa có tài liệu phù hợp bộ lọc.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ds.map((x) => (
            <DocCard key={x.tl.id} {...x} moi={idMoi.has(x.tl.id)} onMo={() => setDangXemId(x.tl.id)} />
          ))}
        </div>
      )}

      {dangXem && <DocViewer {...dangXem} onDong={() => setDangXemId(null)} />}
    </div>
  );
}
