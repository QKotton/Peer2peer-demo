// Mảnh giao diện nhỏ của diễn đàn: biểu tượng kênh, avatar, huy hiệu vai trò, thẻ hồ sơ.
import { Link } from "react-router-dom";
import type { TacGia, Tutor } from "../../data/mockData";
import { tenTacGia, VAI_TRO, type Kenh, type VaiTro } from "../../lib/forum";
import { mauMon } from "../../lib/mauMon";
import { layTutor, monNhanDay } from "../../lib/rules";
import { Icon } from "../icons";

/** Biểu tượng kênh: kênh chung dùng icon, kênh môn dùng ô vuông màu trơn. */
export function DauKenh({ k, lon = false }: { k: Kenh; lon?: boolean }) {
  const co = lon ? "h-5 w-5" : "h-4 w-4";
  if (k.loai === "chung") return <Icon ten="megaphone" className={`${co} shrink-0 text-slate-500`} />;
  if (k.loai === "tim-nhom") return <Icon ten="users" className={`${co} shrink-0 text-slate-500`} />;
  return <span className={`${lon ? "h-3.5 w-3.5" : "h-3 w-3"} mx-0.5 shrink-0 rounded-[3px]`} style={{ background: mauMon(k.ten) }} aria-hidden />;
}

export function AvatarVaiTro({ tg, vt, nho = false }: { tg: TacGia; vt: VaiTro; nho?: boolean }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-semibold ${nho ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-xs"} ${VAI_TRO[vt].nenAvatar}`} aria-hidden>
      {tenTacGia(tg).chu}
    </span>
  );
}

export function HuyHieu({ vt }: { vt: VaiTro }) {
  const v = VAI_TRO[vt];
  if (!v.huyHieu) return null;
  return <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${v.nenHuyHieu}`}>{v.huyHieu}</span>;
}

/** Thẻ hồ sơ nhỏ khi bấm vào tên. */
export function TheNguoiDung({ tg, vt, kenh, onDong }: { tg: TacGia; vt: VaiTro; kenh?: Kenh; onDong: () => void }) {
  const t = tenTacGia(tg);
  const tutor: Tutor | undefined = tg.loai === "tutor" ? layTutor(tg.tutorId) : undefined;
  const cacMon = tutor ? monNhanDay(tutor.id) : [];
  const moTabMon = kenh?.monId && cacMon.some((x) => x.mon.id === kenh.monId) ? `?mon=${kenh.monId}` : "";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/30 p-4" onClick={onDong}>
      <div role="dialog" aria-modal="true" className="w-full max-w-xs overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="h-14" style={{ background: kenh?.loai === "mon" ? mauMon(kenh.ten) : "#1d4ed8" }} />
        <div className="-mt-7 px-5 pb-5">
          <div className="w-fit rounded-full ring-4 ring-white">
            <AvatarVaiTro tg={tg} vt={vt} />
          </div>
          <p className={`mt-2 text-lg font-bold ${VAI_TRO[vt].mauChu}`}>{t.ten}</p>
          <p className="text-sm text-slate-500">{t.phu}</p>
          <div className="mt-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${VAI_TRO[vt].nenHuyHieu ?? "bg-slate-100 text-slate-600"}`}>{VAI_TRO[vt].ten}</span>
          </div>
          {tutor && (
            <>
              <p className="mt-3 text-sm text-slate-700">
                GPA <b>{tutor.gpa.toFixed(2)}</b> · {tutor.daXacThucBangDiem ? "✓ Đã xác thực bảng điểm" : "Chưa xác thực"}
              </p>
              {cacMon.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {cacMon.map(({ mon, tm }) => (
                    <span key={mon.id} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                      <span className="h-2 w-2 rounded-sm" style={{ background: mauMon(mon.ten) }} />
                      {mon.ten} · {tm.diem}
                    </span>
                  ))}
                </div>
              )}
              <Link to={`/tutor/${tutor.id}${moTabMon}`} className="mt-4 block rounded-xl bg-blue-700 py-2 text-center text-sm font-semibold text-white hover:bg-blue-800">
                Xem hồ sơ tutor
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
