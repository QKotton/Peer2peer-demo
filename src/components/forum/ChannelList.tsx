// Cột trái của diễn đàn: thanh "server" (các trường) + danh sách kênh của trường đang chọn.
import { truongs } from "../../data/mockData";
import { cacKenh } from "../../lib/forum";
import { layTruong } from "../../lib/rules";
import { DauKenh } from "./parts";

type Props = {
  truongXem: string;
  onChonTruong: (id: string) => void;
  kenhDangMo: string;
  onChonKenh: (id: string) => void;
  demTin: (kenhId: string) => number;
};

export default function ChannelList({ truongXem, onChonTruong, kenhDangMo, onChonKenh, demTin }: Props) {
  const dsKenh = cacKenh(truongXem);
  const nhomKenh = [...new Set(dsKenh.map((k) => k.nhom))];

  return (
    <div className="flex h-full min-h-0">
      {/* Thanh server: các trường */}
      <div className="flex w-16 shrink-0 flex-col items-center gap-2 bg-slate-100 py-3">
        {truongs.map((t) => {
          const dangChon = t.id === truongXem;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChonTruong(t.id)}
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

      {/* Danh sách kênh, gom theo nhóm (Chung / từng khoa) */}
      <nav className="flex w-60 min-w-0 flex-col border-r border-slate-200 bg-white" aria-label="Danh sách kênh">
        <div className="flex h-12 shrink-0 items-center border-b border-slate-200 px-4">
          <p className="truncate font-bold text-slate-900">{layTruong(truongXem)?.ten}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {nhomKenh.map((nhom) => (
            <div key={nhom} className="mb-3">
              <p className="mb-1 truncate px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{nhom}</p>
              {dsKenh
                .filter((k) => k.nhom === nhom)
                .map((k) => {
                  const dangMo = k.id === kenhDangMo;
                  const so = demTin(k.id);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => onChonKenh(k.id)}
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
}
