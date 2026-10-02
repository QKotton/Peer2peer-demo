// Tab Diễn đàn (kiểu Discord). Cột kênh: ChannelList · cột thành viên: MemberList · mảnh nhỏ: parts.tsx
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { tinNhanMacDinh, type TacGia, type TinNhan } from "../../data/mockData";
import { khoaTacGia, tenTacGia, timKenh, VAI_TRO, vaiTro } from "../../lib/forum";
import { congNgay, cungNgay } from "../../lib/lich";
import { layMon, layTruong } from "../../lib/rules";
import { Icon } from "../icons";
import ChannelList from "./ChannelList";
import MemberList from "./MemberList";
import { AvatarVaiTro, DauKenh, HuyHieu, TheNguoiDung } from "./parts";

const CAM_XUC_NHANH = ["👍", "❤️", "🔥", "🙏", "😂"];
const KENH_MAC_DINH = "mon-ueb-ktl";

// ---------- Tiện ích thời gian (thoiGian dạng "YYYY-MM-DDTHH:mm") ----------
const ngay = (iso: string) => iso.slice(0, 10);
const gio = (iso: string) => iso.slice(11, 16);
const cachPhut = (a: string, b: string) => Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 60000;
function nhanNgay(iso: string) {
  const d = new Date(iso);
  const homNay = new Date();
  if (cungNgay(d, homNay)) return "Hôm nay";
  if (cungNgay(d, congNgay(homNay, -1))) return "Hôm qua";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
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

  const cotKenh = <ChannelList truongXem={truongXem} onChonTruong={setTruongXem} kenhDangMo={kenh.id} onChonKenh={chonKenh} demTin={demTin} />;

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
                      <AvatarVaiTro tg={t.tacGia} vt={vt} />
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

      <MemberList kenh={kenh} tinKenh={tinKenh} onChon={setTheMo} />

      {theMo && <TheNguoiDung tg={theMo} vt={vaiTro(theMo, kenh)} kenh={kenh} onDong={() => setTheMo(null)} />}
    </div>
  );
}
