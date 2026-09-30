import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useApp } from "../../context/AppContext";
import { PHI_NEN_TANG, SO_NGAY_DOI_SOAT } from "../../data/mockData";
import { layMon, layTutor } from "../../lib/rules";
import { giaoDichTutor, LOAI_THU, loaiThu, nguonTien, theoThang, tien, tongHopVi, type GiaoDichTutor } from "../../lib/vi";
import { inputCls, Truong } from "../tutor/formUi";
import { BangSoLieu, ChuGiai, CotChong, The, ThanhNgang } from "./charts";

const TRANG_THAI: Record<GiaoDichTutor["trangThai"], { nhan: string; cls: string }> = {
  "cho-doi-soat": { nhan: "Chờ đối soát", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  "da-doi-soat": { nhan: "Đã vào ví", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  "dang-xu-ly": { nhan: "Đang xử lý", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  "thanh-cong": { nhan: "Thành công", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};
const ngayGio = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} · ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

const RUT_TOI_THIEU = 50_000;

function HopRutTien({ khaDung, onRut, onDong }: { khaDung: number; onRut: (n: number) => void; onDong: () => void }) {
  const [soTien, setSoTien] = useState(Math.floor(khaDung / 100_000) * 100_000);
  const loi = soTien < RUT_TOI_THIEU ? `Tối thiểu ${tien(RUT_TOI_THIEU)}` : soTien > khaDung ? "Vượt quá số dư khả dụng" : "";
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onDong();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDong]);
  const gui = (e: FormEvent) => {
    e.preventDefault();
    if (!loi) onRut(soTien);
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" onClick={onDong}>
      <form role="dialog" aria-modal="true" onSubmit={gui} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900">Rút tiền về ngân hàng</h3>
        <p className="text-sm text-slate-600">
          Số dư khả dụng: <b className="text-slate-900">{tien(khaDung)}</b>
        </p>
        <Truong nhan="Số tiền muốn rút" loi={loi || undefined} goiY={`Tối thiểu ${tien(RUT_TOI_THIEU)} · miễn phí rút`}>
          <input type="number" step={10_000} min={0} value={soTien} onChange={(e) => setSoTien(Number(e.target.value))} className={inputCls} />
        </Truong>
        <div className="flex flex-wrap gap-2">
          {[0.25, 0.5, 1].map((t) => (
            <button key={t} type="button" onClick={() => setSoTien(Math.floor((khaDung * t) / 10_000) * 10_000)} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200">
              {t === 1 ? "Tất cả" : `${t * 100}%`}
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          Tài khoản nhận: <b className="text-slate-800">Tài khoản ngân hàng đã liên kết (demo)</b>
          <p className="mt-1 text-xs">Bản demo mô phỏng lệnh rút, không chuyển tiền thật.</p>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onDong} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Huỷ
          </button>
          <button type="submit" disabled={!!loi} className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:bg-slate-300">
            Xác nhận rút
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TutorWallet() {
  const { tutorDongVaiId, giaoDichHV, rutTienTutor, rutTien, toast } = useApp();
  const tutor = layTutor(tutorDongVaiId)!;
  const [homNay] = useState(() => new Date());
  const [loc, setLoc] = useState<"tat-ca" | "thu" | "rut">("tat-ca");
  const [xemBang, setXemBang] = useState(false);
  const [soDong, setSoDong] = useState(10);
  const [moRut, setMoRut] = useState(false);

  const ds = useMemo(
    () => giaoDichTutor(tutor.id, homNay, giaoDichHV, rutTienTutor[tutor.id] ?? []),
    [tutor.id, homNay, giaoDichHV, rutTienTutor],
  );
  const th = tongHopVi(ds, homNay);
  const thang = theoThang(ds, homNay);
  const nguon = nguonTien(ds);
  const bienDong = th.thangTruoc > 0 ? (th.thangNay - th.thangTruoc) / th.thangTruoc : 0;
  const series = LOAI_THU.map((l) => ({ khoa: l.loai, ten: l.ten, mau: l.mau }));
  const cot = thang.map((t) => ({ nhan: `Th${t.thang.getMonth() + 1}`, nhanDai: `Tháng ${t.thang.getMonth() + 1}/${t.thang.getFullYear()}`, giaTri: t.theoLoai }));
  const hienThi = ds.filter((g) => loc === "tat-ca" || g.kieu === loc);

  const chip = (a: boolean) => `rounded-lg px-3 py-1.5 text-sm font-medium ${a ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`;

  if (ds.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        {tutor.hoTen} chưa có môn nào đủ điều kiện nên chưa phát sinh thu nhập.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Ví tutor · {tutor.hoTen}</p>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Ví của tôi</h1>
      </div>

      {/* Chỉ số chính */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 p-5 text-white shadow-sm sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-blue-100">Số dư khả dụng</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums">{tien(th.khaDung)}</p>
          <button
            type="button"
            onClick={() => setMoRut(true)}
            disabled={th.khaDung < RUT_TOI_THIEU}
            className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
          >
            Rút tiền
          </button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Chờ đối soát</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{tien(th.choDoiSoat)}</p>
          <p className="mt-2 text-xs text-slate-500">Tự vào số dư sau {SO_NGAY_DOI_SOAT} ngày kể từ khi học viên thanh toán</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Thực nhận tháng {homNay.getMonth() + 1}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{tien(th.thangNay)}</p>
          <p className={`mt-2 text-xs font-medium ${bienDong >= 0 ? "text-emerald-700" : "text-red-600"}`}>
            {bienDong >= 0 ? "▲" : "▼"} {Math.abs(Math.round(bienDong * 100))}% so với tháng trước
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Tổng đã rút (6 tháng)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{tien(th.daRut)}</p>
          <p className="mt-2 text-xs text-slate-500">{ds.filter((g) => g.kieu === "rut").length} lần rút</p>
        </div>
      </div>

      {/* Cơ chế hoa hồng */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-slate-500">Học viên đã trả (6 tháng)</p>
          <p className="text-lg font-bold tabular-nums text-slate-900">{tien(th.tongDoanhThu)}</p>
        </div>
        <span className="hidden text-slate-300 md:block">→</span>
        <div className="flex-1">
          <p className="text-slate-500">Phí nền tảng ({Math.round(PHI_NEN_TANG * 100)}%)</p>
          <p className="text-lg font-bold tabular-nums text-slate-900">− {tien(th.tongPhi)}</p>
        </div>
        <span className="hidden text-slate-300 md:block">→</span>
        <div className="flex-1">
          <p className="text-slate-500">Bạn thực nhận ({Math.round((1 - PHI_NEN_TANG) * 100)}%)</p>
          <p className="text-lg font-bold tabular-nums text-emerald-700">{tien(th.tongThucNhan)}</p>
        </div>
      </div>

      {/* Biểu đồ theo tháng */}
      <The
        tieuDe="Thu nhập thực nhận 6 tháng gần nhất"
        phai={
          <button type="button" onClick={() => setXemBang((x) => !x)} className="text-sm font-medium text-blue-700 hover:underline">
            {xemBang ? "Xem biểu đồ" : "Xem dạng bảng"}
          </button>
        }
      >
        <div className="mb-4">
          <ChuGiai series={series} />
        </div>
        {xemBang ? <BangSoLieu cot={cot} series={series} /> : <CotChong cot={cot} series={series} />}
      </The>

      {/* Phân tích nguồn tiền */}
      <div className="grid gap-4 lg:grid-cols-2">
        <The tieuDe="Nguồn tiền theo loại gói">
          <ThanhNgang ds={nguon.theoLoai.map((l) => ({ khoa: l.loai, ten: l.ten, giaTri: l.giaTri, tyLe: l.tyLe, mau: l.mau, phu: `${l.soGD} giao dịch` }))} />
        </The>
        <The tieuDe="Nguồn tiền theo môn">
          {/* Một hue duy nhất: đây là độ lớn theo môn, không phải phân loại màu */}
          <ThanhNgang ds={nguon.theoMon.map((m) => ({ khoa: m.monId, ten: m.ten, giaTri: m.giaTri, tyLe: m.tyLe, mau: "#2a78d6" }))} />
        </The>
      </div>

      {/* Lịch sử giao dịch */}
      <The
        tieuDe="Lịch sử giao dịch"
        phai={
          <div className="flex gap-1.5">
            {(
              [
                ["tat-ca", "Tất cả"],
                ["thu", "Thu nhập"],
                ["rut", "Rút tiền"],
              ] as const
            ).map(([k, n]) => (
              <button key={k} type="button" onClick={() => (setLoc(k), setSoDong(10))} className={chip(loc === k)}>
                {n}
              </button>
            ))}
          </div>
        }
      >
        <ul className="divide-y divide-slate-100">
          {hienThi.slice(0, soDong).map((g) => {
            const tt = TRANG_THAI[g.trangThai];
            return (
              <li key={g.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
                <span
                  className="hidden h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white sm:grid"
                  style={{ background: g.kieu === "rut" ? "#64748b" : loaiThu(g.loai!).mau }}
                  aria-hidden
                >
                  {g.kieu === "rut" ? "↑" : "+"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{g.moTa}</p>
                  <p className="text-xs text-slate-500">
                    {ngayGio(g.ngay)}
                    {g.kieu === "thu" && (
                      <>
                        {" · "}
                        {loaiThu(g.loai!).ten} · {layMon(g.monId!)?.ten} · học viên trả {tien(g.tongTien)}, phí {tien(g.phi)}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1">
                  <span className={`text-sm font-bold tabular-nums ${g.kieu === "rut" ? "text-slate-900" : "text-emerald-700"}`}>
                    {g.kieu === "rut" ? "−" : "+"}
                    {tien(Math.abs(g.thucNhan))}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${tt.cls}`}>{tt.nhan}</span>
                </div>
              </li>
            );
          })}
        </ul>
        {hienThi.length > soDong && (
          <button type="button" onClick={() => setSoDong((n) => n + 20)} className="mt-3 w-full rounded-xl bg-slate-50 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Xem thêm ({hienThi.length - soDong} giao dịch)
          </button>
        )}
      </The>

      {moRut && (
        <HopRutTien
          khaDung={th.khaDung}
          onDong={() => setMoRut(false)}
          onRut={(n) => {
            rutTien(tutor.id, n);
            setMoRut(false);
            toast(`Đã tạo lệnh rút ${tien(n)} – đang xử lý`);
          }}
        />
      )}
    </div>
  );
}
