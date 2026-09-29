import { useState } from "react";
import { CreateDialog, EventDialog } from "../components/calendar/Dialogs";
import MiniMonth from "../components/calendar/MiniMonth";
import MonthGrid from "../components/calendar/MonthGrid";
import { useCacLopLich, useSuKienLich, type LoaiLich, type SuKienLich } from "../components/calendar/suKienLich";
import TimeGrid from "../components/calendar/TimeGrid";
import { useApp } from "../context/AppContext";
import { layTutor } from "../lib/rules";
import { congNgay, dauNgay, dauTuan, gioPhut, ngayDai, tenThang, THU_NGAN } from "../lib/lich";

type CheDoXem = "ngay" | "tuan" | "thang";
const NHAN_XEM: Record<CheDoXem, string> = { ngay: "Ngày", tuan: "Tuần", thang: "Tháng" };

function tieuDeKhoang(xem: CheDoXem, ngay: Date) {
  if (xem === "ngay") return ngayDai(ngay) + `, ${ngay.getFullYear()}`;
  if (xem === "thang") return tenThang(ngay);
  const dau = dauTuan(ngay);
  const cuoi = congNgay(dau, 6);
  if (dau.getMonth() === cuoi.getMonth()) return tenThang(dau);
  return `Th${dau.getMonth() + 1} – Th${cuoi.getMonth() + 1}, ${cuoi.getFullYear()}`;
}

export default function MyCalendar() {
  const homNay = new Date();
  const [ngay, setNgay] = useState(() => dauNgay(homNay));
  const [xem, setXem] = useState<CheDoXem>(() => (window.innerWidth < 640 ? "ngay" : "tuan"));
  const [hien, setHien] = useState<Record<LoaiLich, boolean>>({ "on-thi": true, "goi-y": true, "ca-nhan": true, thi: true, "day-nhom": true, coach: true });
  // Chế độ tutor: chỉ xem lịch dạy, không tạo sự kiện cá nhân
  const { cheDo, tutorDongVaiId } = useApp();
  const laTutor = cheDo === "tutor";
  const cacLop = useCacLopLich();
  const [chiTiet, setChiTiet] = useState<SuKienLich | null>(null);
  const [taoTai, setTaoTai] = useState<Date | null>(null);

  const tatCa = useSuKienLich();
  const suKien = tatCa.filter((s) => hien[s.loai]);
  const sapToi = tatCa.filter((s) => s.ketThuc >= homNay && s.loai !== "goi-y").slice(0, 4);

  const buoc = (huong: 1 | -1) => {
    if (xem === "ngay") setNgay((d) => congNgay(d, huong));
    else if (xem === "tuan") setNgay((d) => congNgay(d, 7 * huong));
    else setNgay((d) => new Date(d.getFullYear(), d.getMonth() + huong, 1));
  };
  const moNgay = (d: Date) => {
    setNgay(dauNgay(d));
    setXem("ngay");
  };
  const moTao = (d: Date) => {
    if (!laTutor) setTaoTai(d);
  };
  const taoMacDinh = () => {
    const d = new Date(ngay);
    d.setHours(homNay.getHours() + 1, 0, 0, 0);
    moTao(d);
  };

  const nutTron = "grid h-9 w-9 place-items-center rounded-full text-lg text-slate-600 hover:bg-slate-100";

  return (
    <div className="-mx-4 -my-6 flex h-[calc(100vh-4rem)] min-h-[560px] bg-white sm:-mx-6">
      {/* ---------- Cột trái ---------- */}
      <aside className="hidden w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-slate-200 p-4 lg:flex">
        {laTutor ? (
          <div className="rounded-2xl bg-indigo-50 p-4 ring-1 ring-indigo-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Lịch dạy</p>
            <p className="mt-0.5 font-bold text-slate-900">{layTutor(tutorDongVaiId)?.hoTen}</p>
            <p className="mt-1 text-xs text-slate-600">Lớp ôn thi bạn tổ chức và các buổi coach 1-1 với học viên.</p>
          </div>
        ) : (
        <button
          type="button"
          onClick={taoMacDinh}
          className="flex w-fit items-center gap-3 rounded-2xl bg-white py-3 pl-4 pr-6 text-sm font-semibold text-slate-800 shadow-md ring-1 ring-slate-200 transition hover:bg-blue-50 hover:shadow-lg"
        >
          <span className="text-2xl leading-none text-blue-600">＋</span>
          Tạo
        </button>
        )}

        <MiniMonth ngayChon={ngay} homNay={homNay} suKien={tatCa} onChon={(d) => setNgay(dauNgay(d))} />

        <div>
          <p className="mb-2 px-1 text-sm font-semibold text-slate-800">{laTutor ? "Lịch dạy của tôi" : "Lịch của tôi"}</p>
          {cacLop.map((l) => (
            <label key={l.loai} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={hien[l.loai]}
                onChange={(e) => setHien((h) => ({ ...h, [l.loai]: e.target.checked }))}
                className="sr-only"
              />
              <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm text-[10px] text-white ${hien[l.loai] ? l.mau : "ring-2 ring-inset ring-slate-400"}`}>
                {hien[l.loai] && "✓"}
              </span>
              {l.ten}
            </label>
          ))}
        </div>

        <div>
          <p className="mb-2 px-1 text-sm font-semibold text-slate-800">Sắp tới</p>
          {sapToi.length === 0 ? (
            <p className="px-1 text-sm text-slate-500">{laTutor ? "Không có buổi dạy nào sắp tới." : "Không có sự kiện nào sắp tới."}</p>
          ) : (
            <ul className="space-y-1">
              {sapToi.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => setChiTiet(s)} className="flex w-full gap-3 rounded-lg px-1 py-1.5 text-left hover:bg-slate-50">
                    <span className="w-9 shrink-0 text-center">
                      <span className="block text-[10px] font-semibold uppercase text-slate-500">{THU_NGAN[s.batDau.getDay()]}</span>
                      <span className="block text-lg font-semibold leading-none text-slate-800">{s.batDau.getDate()}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-slate-800">{s.tieuDe}</span>
                      <span className="block text-xs text-slate-500">{gioPhut(s.batDau)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* ---------- Vùng lịch chính ---------- */}
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-3 py-2 sm:gap-3 sm:px-4">
          <button
            type="button"
            onClick={() => setNgay(dauNgay(homNay))}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Hôm nay
          </button>
          <div className="flex">
            <button type="button" aria-label="Trước" onClick={() => buoc(-1)} className={nutTron}>
              ‹
            </button>
            <button type="button" aria-label="Sau" onClick={() => buoc(1)} className={nutTron}>
              ›
            </button>
          </div>
          <h1 className="min-w-0 flex-1 truncate text-lg text-slate-800 sm:text-xl">{tieuDeKhoang(xem, ngay)}</h1>
          <div className="flex rounded-full border border-slate-300 p-0.5" role="group" aria-label="Chế độ xem">
            {(Object.keys(NHAN_XEM) as CheDoXem[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={xem === k}
                onClick={() => setXem(k)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${xem === k ? "bg-blue-100 text-blue-800" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {NHAN_XEM[k]}
              </button>
            ))}
          </div>
          {!laTutor && (
            <button
              type="button"
              onClick={taoMacDinh}
              className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-xl text-white shadow lg:hidden"
              aria-label="Tạo sự kiện"
            >
              ＋
            </button>
          )}
        </div>

        {xem === "thang" ? (
          <MonthGrid thang={ngay} homNay={homNay} suKien={suKien} onChonSuKien={setChiTiet} onTaoTai={moTao} onChonNgay={moNgay} />
        ) : (
          <TimeGrid
            key={xem}
            ngay={xem === "tuan" ? Array.from({ length: 7 }, (_, i) => congNgay(dauTuan(ngay), i)) : [ngay]}
            homNay={homNay}
            suKien={suKien}
            onChonSuKien={setChiTiet}
            onTaoTai={moTao}
            onChonNgay={moNgay}
          />
        )}
      </section>

      {chiTiet && <EventDialog s={chiTiet} onDong={() => setChiTiet(null)} />}
      {taoTai && <CreateDialog batDau={taoTai} onDong={() => setTaoTai(null)} />}
    </div>
  );
}
