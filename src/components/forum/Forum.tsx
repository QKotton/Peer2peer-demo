import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { SO_THANH_VIEN, tinNhanMacDinh, truongs, type TacGia, type TinNhan, type Tutor } from "../../data/mockData";
import { cacKenh, dangOnline, khoaTacGia, mauMon, tenTacGia, timKenh, tutorTrongKenh, VAI_TRO, vaiTro, type Kenh, type VaiTro } from "../../lib/forum";
import { layMon, layTruong, layTutor, monNhanDay } from "../../lib/rules";
import { Icon } from "../icons";

const CAM_XUC_NHANH = ["👍", "❤️", "🔥", "🙏", "😂"];
const KENH_MAC_DINH = "mon-ueb-ktl";

// ---------- Tiện ích thời gian ----------
const ngay = (iso: string) => iso.slice(0, 10);
function nhanNgay(iso: string) {
  const d = new Date(iso);
  const hom = new Date();
  const hai = (n: number) => String(n).padStart(2, "0");
  const key = (x: Date) => `${x.getFullYear()}-${hai(x.getMonth() + 1)}-${hai(x.getDate())}`;
  if (key(d) === key(hom)) return "Hôm nay";
  if (key(d) === key(new Date(hom.getFullYear(), hom.getMonth(), hom.getDate() - 1))) return "Hôm qua";
  return `${hai(d.getDate())}/${hai(d.getMonth() + 1)}/${d.getFullYear()}`;
}
const gio = (iso: string) => iso.slice(11, 16);
const cachPhut = (a: string, b: string) => Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 60000;

/** Biểu tượng kênh: kênh chung dùng icon, kênh môn dùng ô vuông màu trơn. */
function DauKenh({ k, lon = false }: { k: Kenh; lon?: boolean }) {
  if (k.loai === "chung") return <Icon ten="megaphone" className={`${lon ? "h-5 w-5" : "h-4 w-4"} shrink-0 text-slate-500`} />;
  if (k.loai === "tim-nhom") return <Icon ten="users" className={`${lon ? "h-5 w-5" : "h-4 w-4"} shrink-0 text-slate-500`} />;
  return <span className={`${lon ? "h-3.5 w-3.5" : "h-3 w-3"} mx-0.5 shrink-0 rounded-[3px]`} style={{ background: mauMon(k.ten) }} aria-hidden />;
}

function Avatar({ tg, vt, nho = false }: { tg: TacGia; vt: VaiTro; nho?: boolean }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-semibold ${nho ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-xs"} ${VAI_TRO[vt].nenAvatar}`} aria-hidden>
      {tenTacGia(tg).chu}
    </span>
  );
}

function HuyHieu({ vt }: { vt: VaiTro }) {
  const v = VAI_TRO[vt];
  if (!v.huyHieu) return null;
  return <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${v.nenHuyHieu}`}>{v.huyHieu}</span>;
}

/** Thẻ hồ sơ nhỏ khi bấm vào tên. */
function TheNguoiDung({ tg, vt, kenh, onDong }: { tg: TacGia; vt: VaiTro; kenh?: Kenh; onDong: () => void }) {
  const t = tenTacGia(tg);
  const tutor: Tutor | undefined = tg.loai === "tutor" ? layTutor(tg.tutorId) : undefined;
  const cacMon = tutor ? monNhanDay(tutor.id) : [];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/30 p-4" onClick={onDong}>
      <div role="dialog" aria-modal="true" className="w-full max-w-xs overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="h-14" style={{ background: kenh?.loai === "mon" ? mauMon(kenh.ten) : "#1d4ed8" }} />
        <div className="-mt-7 px-5 pb-5">
          <div className="w-fit rounded-full ring-4 ring-white">
            <Avatar tg={tg} vt={vt} />
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
              <Link to={`/tutor/${tutor.id}${kenh?.monId && cacMon.some((x) => x.mon.id === kenh.monId) ? `?mon=${kenh.monId}` : ""}`} className="mt-4 block rounded-xl bg-blue-700 py-2 text-center text-sm font-semibold text-white hover:bg-blue-800">
                Xem hồ sơ tutor
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Forum() {
  const { tinNhanThem, guiTinNhan, camXucCuaToi, thaCamXuc, cheDo, tutorDongVaiId } = useApp();
  const [params, setParams] = useSearchParams();
  const kenhId = params.get("kenh") ?? KENH_MAC_DINH;
  const kenh = timKenh(kenhId) ?? timKenh(KENH_MAC_DINH)!;
  const [truongXem, setTruongXem] = useState(kenh.truongId);
  // Mở link tới kênh của trường khác → thanh server chuyển theo
  useEffect(() => {
    setTruongXem(kenh.truongId);
  }, [kenh.truongId]);
  const [moKenh, setMoKenh] = useState(false); // drawer trên điện thoại
  const [noiDung, setNoiDung] = useState("");
  const [theMo, setTheMo] = useState<TacGia | null>(null);
  const [hoverTin, setHoverTin] = useState<string | null>(null);
  const cuon = useRef<HTMLDivElement>(null);

  const chonKenh = (id: string) => {
    const p = new URLSearchParams(params);
    p.set("tab", "dien-dan");
    p.set("kenh", id);
    setParams(p, { replace: true });
    setMoKenh(false);
  };

  const tatCaTin = [...tinNhanMacDinh, ...tinNhanThem];
  const tinKenh = tatCaTin.filter((t) => t.kenhId === kenh.id).sort((a, b) => a.thoiGian.localeCompare(b.thoiGian));
  const ghim = tinKenh.filter((t) => t.ghim);
  const demTin = (id: string) => tatCaTin.filter((t) => t.kenhId === id).length;

  // Cuộn xuống tin mới nhất khi đổi kênh / có tin mới
  useEffect(() => {
    cuon.current?.scrollTo({ top: cuon.current.scrollHeight });
  }, [kenh.id, tinKenh.length]);

  const gui = () => {
    if (!noiDung.trim()) return;
    guiTinNhan(kenh.id, noiDung.trim());
    setNoiDung("");
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      gui();
    }
  };

  // Người đang chat: "Bạn" (người học) hoặc tutor đang đóng vai
  const toi: TacGia = cheDo === "tutor" ? { loai: "tutor", tutorId: tutorDongVaiId } : { loai: "hoc-vien", ten: "Bạn", moTa: "Người học" };
  const vtToi = vaiTro(toi, kenh);

  const camXuc = (t: TinNhan) => {
    const goc = { ...(t.camXuc ?? {}) };
    for (const e of camXucCuaToi[t.id] ?? []) goc[e] = (goc[e] ?? 0) + 1;
    return Object.entries(goc).filter(([, n]) => n > 0);
  };

  // ---------- Cột thành viên ----------
  const { tutorMon, tutorKhac } = tutorTrongKenh(kenh);
  const hocVienTrongKenh = [...new Map(tinKenh.filter((t) => t.tacGia.loai === "hoc-vien").map((t) => [khoaTacGia(t.tacGia), t.tacGia])).values()];
  const nhomThanhVien: { vt: VaiTro; ten: string; ds: TacGia[] }[] = [
    { vt: "tutor-mon", ten: "Tutor môn này", ds: tutorMon.map((t) => ({ loai: "tutor", tutorId: t.id })) },
    { vt: "tutor", ten: "Tutor", ds: tutorKhac.map((t) => ({ loai: "tutor", tutorId: t.id })) },
    { vt: "quan-tri", ten: "Quản trị", ds: [{ loai: "quan-tri" }] },
  ];

  // ---------- Cột kênh ----------
  const dsKenh = cacKenh(truongXem);
  const nhomKenh = [...new Set(dsKenh.map((k) => k.nhom))];
  const truong = layTruong(truongXem)!;

  const cotKenh = (
    <div className="flex h-full min-h-0">
      {/* Thanh server: các trường */}
      <div className="flex w-16 shrink-0 flex-col items-center gap-2 bg-slate-100 py-3">
        {truongs.map((t) => {
          const dangChon = t.id === truongXem;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTruongXem(t.id)}
              title={t.ten}
              className={`relative grid h-11 w-11 place-items-center text-xs font-bold transition-all ${
                dangChon ? "rounded-2xl bg-blue-700 text-white" : "rounded-full bg-white text-slate-600 hover:rounded-2xl hover:bg-blue-50"
              }`}
            >
              {dangChon && <span className="absolute -left-2.5 h-8 w-1 rounded-r bg-slate-900" />}
              {t.tenVietTat}
            </button>
          );
        })}
      </div>

      {/* Danh sách kênh */}
      <nav className="flex w-60 min-w-0 flex-col border-r border-slate-200 bg-white" aria-label="Danh sách kênh">
        <div className="flex h-12 shrink-0 items-center border-b border-slate-200 px-4">
          <p className="truncate font-bold text-slate-900">{truong.ten}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {nhomKenh.map((nhom) => (
            <div key={nhom} className="mb-3">
              <p className="mb-1 truncate px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{nhom}</p>
              {dsKenh
                .filter((k) => k.nhom === nhom)
                .map((k) => {
                  const dangMo = k.id === kenh.id;
                  const so = demTin(k.id);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => chonKenh(k.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition ${
                        dangMo ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <DauKenh k={k} />
                      <span className="min-w-0 flex-1 truncate">{k.ten}</span>
                      {so > 0 && !dangMo && <span className="text-[11px] text-slate-400">{so}</span>}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );

  // ---------- Khung chat ----------
  let truocDo: TinNhan | undefined;

  return (
    <div className="relative flex h-[calc(100vh-12rem)] min-h-[540px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Cột kênh – desktop */}
      <div className="hidden md:block">{cotKenh}</div>

      {/* Cột kênh – điện thoại (drawer) */}
      {moKenh && (
        <div className="absolute inset-0 z-30 flex md:hidden">
          <div className="h-full shadow-2xl">{cotKenh}</div>
          <button type="button" className="flex-1 bg-slate-900/30" aria-label="Đóng danh sách kênh" onClick={() => setMoKenh(false)} />
        </div>
      )}

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2.5 border-b border-slate-200 px-3 sm:px-4">
          <button type="button" onClick={() => setMoKenh(true)} className="-ml-1 rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Mở danh sách kênh">
            <Icon ten="menu" />
          </button>
          <DauKenh k={kenh} lon />
          <h2 className="truncate font-bold text-slate-900">{kenh.ten}</h2>
          {kenh.monId && (
            <span className="hidden truncate text-sm text-slate-500 sm:inline">
              · {layMon(kenh.monId)?.maHocPhan} · {layTruong(kenh.truongId)?.tenVietTat}
            </span>
          )}
        </header>

        {ghim.length > 0 && (
          <div className="flex shrink-0 items-start gap-2 border-b border-amber-100 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            <Icon ten="pin" className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="line-clamp-2">
              <b>{tenTacGia(ghim[ghim.length - 1].tacGia).ten}:</b> {ghim[ghim.length - 1].noiDung}
            </p>
          </div>
        )}

        <div ref={cuon} className="min-h-0 flex-1 overflow-y-auto py-3">
          {tinKenh.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-slate-100">
                <DauKenh k={kenh} lon />
              </div>
              <p className="font-bold text-slate-900">Chào mừng đến kênh {kenh.ten}</p>
              <p className="mt-1 text-sm text-slate-500">Chưa có tin nhắn nào. Hãy mở đầu cuộc trò chuyện!</p>
            </div>
          )}

          {tinKenh.map((t) => {
            const vt = vaiTro(t.tacGia, kenh);
            const ten = tenTacGia(t.tacGia);
            const ngayMoi = !truocDo || ngay(truocDo.thoiGian) !== ngay(t.thoiGian);
            const gop = !ngayMoi && truocDo && khoaTacGia(truocDo.tacGia) === khoaTacGia(t.tacGia) && cachPhut(truocDo.thoiGian, t.thoiGian) < 5;
            truocDo = t;
            const cx = camXuc(t);
            const cuaToi = camXucCuaToi[t.id] ?? [];
            return (
              <div key={t.id}>
                {ngayMoi && (
                  <div className="my-3 flex items-center gap-3 px-4 text-[11px] font-semibold text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    {nhanNgay(t.thoiGian)}
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                )}
                <div
                  className={`group relative flex gap-3 px-4 hover:bg-slate-50 ${gop ? "py-0.5" : "mt-2 py-1"}`}
                  onMouseEnter={() => setHoverTin(t.id)}
                  onMouseLeave={() => setHoverTin(null)}
                >
                  {gop ? (
                    <span className="w-10 shrink-0 pt-0.5 text-right text-[10px] text-slate-400 opacity-0 group-hover:opacity-100">{gio(t.thoiGian)}</span>
                  ) : (
                    <button type="button" onClick={() => setTheMo(t.tacGia)} className="self-start">
                      <Avatar tg={t.tacGia} vt={vt} />
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
                    {!gop && (
                      <p className="flex flex-wrap items-center">
                        <button type="button" onClick={() => setTheMo(t.tacGia)} className={`font-semibold hover:underline ${VAI_TRO[vt].mauChu}`}>
                          {ten.ten}
                        </button>
                        <HuyHieu vt={vt} />
                        <span className="ml-2 text-[11px] text-slate-400">
                          {nhanNgay(t.thoiGian)} lúc {gio(t.thoiGian)}
                        </span>
                        {t.ghim && <Icon ten="pin" className="ml-1.5 h-3.5 w-3.5 text-amber-600" />}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-slate-800">{t.noiDung}</p>
                    {cx.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {cx.map(([e, n]) => (
                          <button
                            key={e}
                            type="button"
                            onClick={() => thaCamXuc(t.id, e)}
                            className={`inline-flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-xs ${
                              cuaToi.includes(e) ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <span>{e}</span>
                            <span className="tabular-nums">{n}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Thả cảm xúc nhanh khi rê chuột */}
                  {hoverTin === t.id && (
                    <div className="absolute -top-3 right-4 flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                      {CAM_XUC_NHANH.map((e) => (
                        <button key={e} type="button" onClick={() => thaCamXuc(t.id, e)} className="rounded-md px-1.5 py-0.5 text-sm hover:bg-slate-100" aria-label={`Thả ${e}`}>
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ô nhập */}
        <div className="shrink-0 px-3 pb-3 sm:px-4">
          <div className="flex items-end gap-2 rounded-xl bg-slate-100 px-3 py-2">
            <textarea
              rows={1}
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              onKeyDown={onKey}
              placeholder={`Nhắn tin trong ${kenh.ten}`}
              className="max-h-32 min-h-[1.5rem] flex-1 resize-none bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button type="button" onClick={gui} disabled={!noiDung.trim()} className="rounded-lg p-1 text-blue-700 disabled:text-slate-300" aria-label="Gửi">
              <Icon ten="send" />
            </button>
          </div>
          <p className="mt-1.5 truncate text-[11px] text-slate-500">
            Đang chat với tên <span className={`font-semibold ${VAI_TRO[vtToi].mauChu}`}>{tenTacGia(toi).ten}</span>
            {vtToi !== "thanh-vien" && ` (${VAI_TRO[vtToi].ten})`} · Enter để gửi · Không đăng đề thi, slide của giảng viên
          </p>
        </div>
      </section>

      {/* Cột thành viên */}
      <aside className="hidden w-56 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 px-2 py-3 xl:block" aria-label="Thành viên">
        {nhomThanhVien
          .filter((n) => n.ds.length > 0)
          .map((n) => (
            <div key={n.vt} className="mb-4">
              <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {n.ten} — {n.ds.length}
              </p>
              {n.ds.map((tg) => {
                const k = khoaTacGia(tg);
                return (
                  <button key={k} type="button" onClick={() => setTheMo(tg)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-white">
                    <span className="relative">
                      <Avatar tg={tg} vt={n.vt} nho />
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-slate-50 ${dangOnline(k) ? "bg-emerald-500" : "bg-slate-300"}`} />
                    </span>
                    <span className={`truncate text-sm font-medium ${VAI_TRO[n.vt].mauChu}`}>{tenTacGia(tg).ten}</span>
                  </button>
                );
              })}
            </div>
          ))}
        <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Thành viên — {(SO_THANH_VIEN[kenh.truongId] ?? 0).toLocaleString("vi-VN")}
        </p>
        {hocVienTrongKenh.map((tg) => {
          const k = khoaTacGia(tg);
          return (
            <button key={k} type="button" onClick={() => setTheMo(tg)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-white">
              <span className="relative">
                <Avatar tg={tg} vt="thanh-vien" nho />
                <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-slate-50 ${dangOnline(k) ? "bg-emerald-500" : "bg-slate-300"}`} />
              </span>
              <span className="truncate text-sm text-slate-700">{tenTacGia(tg).ten}</span>
            </button>
          );
        })}
      </aside>

      {theMo && <TheNguoiDung tg={theMo} vt={vaiTro(theMo, kenh)} kenh={kenh} onDong={() => setTheMo(null)} />}
    </div>
  );
}
