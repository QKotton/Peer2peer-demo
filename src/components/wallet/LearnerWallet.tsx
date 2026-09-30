import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp, useDangPhatTrien } from "../../context/AppContext";
import type { GiaoDichHocVien } from "../../data/mockData";
import { layMon, layTutor } from "../../lib/rules";
import { tien } from "../../lib/vi";
import { The, ThanhNgang } from "./charts";

type Nhom = "tat-ca" | "nap" | "thanh-toan" | "hoan-tien";
const NHOM: { k: Nhom; n: string }[] = [
  { k: "tat-ca", n: "Tất cả" },
  { k: "nap", n: "Nạp tiền" },
  { k: "thanh-toan", n: "Thanh toán" },
  { k: "hoan-tien", n: "Hoàn tiền" },
];
const thuocNhom = (g: GiaoDichHocVien, k: Nhom) =>
  k === "tat-ca" || (k === "nap" && g.loai === "nap") || (k === "hoan-tien" && g.loai === "hoan-tien") || (k === "thanh-toan" && g.soTien < 0);

// Cùng màu với ví tutor: màu đi theo loại gói
const CHI_TIEU = [
  { loai: "bai-giang", ten: "Bài giảng quay sẵn", mau: "#2a78d6" },
  { loai: "coach", ten: "Gói coach", mau: "#eb6834" },
  { loai: "lop-on-thi", ten: "Lớp ôn thi", mau: "#1baf7a" },
] as const;

const BIEU_TUONG: Record<GiaoDichHocVien["loai"], { ky: string; mau: string }> = {
  nap: { ky: "↓", mau: "#64748b" },
  "hoan-tien": { ky: "↺", mau: "#64748b" },
  "bai-giang": { ky: "▶", mau: "#2a78d6" },
  coach: { ky: "✦", mau: "#eb6834" },
  "lop-on-thi": { ky: "◎", mau: "#1baf7a" },
};

const thangNam = (iso: string) => {
  const [y, m] = iso.split("-");
  return `Tháng ${Number(m)}/${y}`;
};
const ngayGio = (iso: string) => {
  const [d, t] = iso.split("T");
  const [, m, day] = d.split("-");
  return `${day}/${m} · ${t}`;
};

export default function LearnerWallet() {
  const { giaoDichHV, soDuHV } = useApp();
  const dangPhatTrien = useDangPhatTrien();
  const [nhom, setNhom] = useState<Nhom>("tat-ca");

  const homNay = new Date();
  const thangNay = `${homNay.getFullYear()}-${String(homNay.getMonth() + 1).padStart(2, "0")}`;
  const chiThangNay = -giaoDichHV.filter((g) => g.soTien < 0 && g.ngay.startsWith(thangNay)).reduce((s, g) => s + g.soTien, 0);
  const tongNap = giaoDichHV.filter((g) => g.loai === "nap").reduce((s, g) => s + g.soTien, 0);
  const tongHoan = giaoDichHV.filter((g) => g.loai === "hoan-tien").reduce((s, g) => s + g.soTien, 0);
  const tongChi = -giaoDichHV.filter((g) => g.soTien < 0).reduce((s, g) => s + g.soTien, 0);

  const chiTheoLoai = CHI_TIEU.map((c) => {
    const v = -giaoDichHV.filter((g) => g.loai === c.loai).reduce((s, g) => s + g.soTien, 0);
    return { khoa: c.loai, ten: c.ten, giaTri: v, tyLe: tongChi ? v / tongChi : 0, mau: c.mau, phu: `${giaoDichHV.filter((g) => g.loai === c.loai).length} giao dịch` };
  });

  const ds = [...giaoDichHV].sort((a, b) => b.ngay.localeCompare(a.ngay)).filter((g) => thuocNhom(g, nhom));
  const theoThang = ds.reduce<Record<string, GiaoDichHocVien[]>>((m, g) => {
    (m[thangNam(g.ngay)] ??= []).push(g);
    return m;
  }, {});

  const chip = (a: boolean) => `rounded-lg px-3 py-1.5 text-sm font-medium ${a ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Ví người học</p>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Ví của tôi</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 p-5 text-white shadow-sm sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-blue-100">Số dư ví</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums">{tien(soDuHV)}</p>
          <button type="button" onClick={dangPhatTrien} className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
            Nạp tiền
          </button>
        </div>
        {(
          [
            [`Đã chi tháng ${homNay.getMonth() + 1}`, chiThangNay, "Bài giảng, coach, lớp ôn thi"],
            ["Tổng đã nạp", tongNap, `${giaoDichHV.filter((g) => g.loai === "nap").length} lần nạp`],
            ["Được hoàn", tongHoan, "Huỷ đăng ký hoặc buổi học bị huỷ"],
          ] as const
        ).map(([nhan, v, phu]) => (
          <div key={nhan} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{nhan}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{tien(v)}</p>
            <p className="mt-2 text-xs text-slate-500">{phu}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <The tieuDe="Chi tiêu theo loại">
          <ThanhNgang ds={chiTheoLoai} />
          <p className="mt-4 text-xs text-slate-500">Tổng đã chi: {tien(tongChi)}</p>
        </The>

        <The
          tieuDe="Lịch sử giao dịch"
          phai={
            <div className="flex flex-wrap gap-1.5">
              {NHOM.map((x) => (
                <button key={x.k} type="button" onClick={() => setNhom(x.k)} className={chip(nhom === x.k)}>
                  {x.n}
                </button>
              ))}
            </div>
          }
        >
          {ds.length === 0 && <p className="py-6 text-center text-sm text-slate-500">Chưa có giao dịch.</p>}
          {Object.entries(theoThang).map(([thang, gds]) => (
            <div key={thang} className="mb-2">
              <p className="sticky top-16 bg-white py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{thang}</p>
              <ul className="divide-y divide-slate-100">
                {gds.map((g) => {
                  const bt = BIEU_TUONG[g.loai];
                  const tutor = g.tutorId ? layTutor(g.tutorId) : undefined;
                  return (
                    <li key={g.id} className="flex items-center gap-3 py-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm text-white" style={{ background: bt.mau }} aria-hidden>
                        {bt.ky}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{g.moTa}</p>
                        <p className="text-xs text-slate-500">
                          {ngayGio(g.ngay)} · {g.phuongThuc} · Mã {g.id}
                          {tutor && g.monId && (
                            <>
                              {" · "}
                              <Link to={`/tutor/${tutor.id}?mon=${g.monId}`} className="text-blue-700 hover:underline">
                                {tutor.hoTen} – {layMon(g.monId)?.ten}
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className={`text-sm font-bold tabular-nums ${g.soTien > 0 ? "text-emerald-700" : "text-slate-900"}`}>
                          {g.soTien > 0 ? "+" : "−"}
                          {tien(Math.abs(g.soTien))}
                        </p>
                        <p className="text-[11px] text-emerald-700">Thành công</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </The>
      </div>
      <p className="text-xs text-slate-500">Bản demo: số liệu minh hoạ, không có giao dịch thật. Đăng ký lớp ôn thi ở trang chủ sẽ trừ tiền ví; huỷ đăng ký được hoàn tiền.</p>
    </div>
  );
}
