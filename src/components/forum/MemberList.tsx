// Cột phải của diễn đàn: thành viên chia theo vai trò (tính riêng cho kênh đang mở).
import { SO_THANH_VIEN, type TacGia, type TinNhan } from "../../data/mockData";
import { dangOnline, khoaTacGia, tenTacGia, tutorTrongKenh, VAI_TRO, type Kenh, type VaiTro } from "../../lib/forum";
import { AvatarVaiTro } from "./parts";

function Dong({ tg, vt, onChon }: { tg: TacGia; vt: VaiTro; onChon: (tg: TacGia) => void }) {
  const k = khoaTacGia(tg);
  return (
    <button type="button" onClick={() => onChon(tg)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-white">
      <span className="relative">
        <AvatarVaiTro tg={tg} vt={vt} nho />
        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-slate-50 ${dangOnline(k) ? "bg-emerald-500" : "bg-slate-300"}`} />
      </span>
      <span className={`truncate text-sm ${vt === "thanh-vien" ? "text-slate-700" : `font-medium ${VAI_TRO[vt].mauChu}`}`}>{tenTacGia(tg).ten}</span>
    </button>
  );
}

const TieuDe = ({ children }: { children: string }) => (
  <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{children}</p>
);

export default function MemberList({ kenh, tinKenh, onChon }: { kenh: Kenh; tinKenh: TinNhan[]; onChon: (tg: TacGia) => void }) {
  const { tutorMon, tutorKhac } = tutorTrongKenh(kenh);
  // Người học đã nhắn trong kênh (mỗi người một dòng)
  const hocVien = [...new Map(tinKenh.filter((t) => t.tacGia.loai === "hoc-vien").map((t) => [khoaTacGia(t.tacGia), t.tacGia])).values()];
  const nhom: { vt: VaiTro; ten: string; ds: TacGia[] }[] = [
    { vt: "tutor-mon", ten: "Tutor môn này", ds: tutorMon.map((t) => ({ loai: "tutor", tutorId: t.id })) },
    { vt: "tutor", ten: "Tutor", ds: tutorKhac.map((t) => ({ loai: "tutor", tutorId: t.id })) },
    { vt: "quan-tri", ten: "Quản trị", ds: [{ loai: "quan-tri" }] },
  ];

  return (
    <aside className="hidden w-56 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 px-2 py-3 xl:block" aria-label="Thành viên">
      {nhom
        .filter((n) => n.ds.length > 0)
        .map((n) => (
          <div key={n.vt} className="mb-4">
            <TieuDe>{`${n.ten} — ${n.ds.length}`}</TieuDe>
            {n.ds.map((tg) => (
              <Dong key={khoaTacGia(tg)} tg={tg} vt={n.vt} onChon={onChon} />
            ))}
          </div>
        ))}
      <TieuDe>{`Thành viên — ${(SO_THANH_VIEN[kenh.truongId] ?? 0).toLocaleString("vi-VN")}`}</TieuDe>
      {hocVien.map((tg) => (
        <Dong key={khoaTacGia(tg)} tg={tg} vt="thanh-vien" onChon={onChon} />
      ))}
    </aside>
  );
}
