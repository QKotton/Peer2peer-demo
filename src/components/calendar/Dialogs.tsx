import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { gioPhut, ngayDai, ngayISO } from "../../lib/lich";
import { Icon } from "../icons";
import { inputCls, Truong } from "../tutor/formUi";
import { kieuLich, type SuKienLich } from "./suKienLich";

function Khung({ onDong, children, rong = "max-w-md" }: { onDong: () => void; children: ReactNode; rong?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDong();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDong]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/30 p-4" onClick={onDong}>
      <div role="dialog" aria-modal="true" className={`w-full ${rong} rounded-2xl bg-white shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/** Popup chi tiết khi bấm vào một sự kiện. */
export function EventDialog({ s, onDong }: { s: SuKienLich; onDong: () => void }) {
  const { dangKyBuoi, huyDangKyBuoi, xoaSuKien, toast } = useApp();
  const kieu = kieuLich(s.loai);
  const Dong = ({ icon, children }: { icon: Parameters<typeof Icon>[0]["ten"]; children: ReactNode }) => (
    <div className="flex gap-3 text-sm text-slate-700">
      <Icon ten={icon} className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div>{children}</div>
    </div>
  );

  return (
    <Khung onDong={onDong}>
      <div className="flex justify-end p-2">
        <button type="button" onClick={onDong} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Đóng">
          <Icon ten="close" />
        </button>
      </div>
      <div className="space-y-4 px-6 pb-6">
        <div className="flex gap-3">
          <span className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded ${kieu.mau}`} />
          <div>
            <h3 className="text-xl text-slate-900">{s.tieuDe}</h3>
            <p className="text-sm text-slate-600">
              {ngayDai(s.batDau)} · {gioPhut(s.batDau)} – {gioPhut(s.ketThuc)}
            </p>
          </div>
        </div>
        {s.monTen && <Dong icon="book">{s.monTen}</Dong>}
        {s.tutorTen && (
          <Dong icon="user">
            Tutor{" "}
            <Link to={`/tutor/${s.tutorId}?mon=${s.monId}`} className="font-medium text-blue-700 hover:underline">
              {s.tutorTen}
            </Link>
          </Dong>
        )}
        {s.hocVien && <Dong icon="users">{s.hocVien}</Dong>}
        {s.diaDiem && <Dong icon="pin">{s.diaDiem}</Dong>}
        {s.ghiChu && <Dong icon="pin">{s.ghiChu}</Dong>}
        {s.conCho !== undefined && <Dong icon="users">{s.conCho > 0 ? `Còn ${s.conCho} chỗ` : "Đã kín chỗ"}</Dong>}
        <Dong icon="calendar">{kieu.ten}</Dong>

        <div className="flex justify-end gap-2 pt-2">
          {s.loai === "goi-y" && (
            <button
              type="button"
              disabled={(s.conCho ?? 0) <= 0}
              onClick={() => {
                dangKyBuoi(s.buoiId!);
                toast(`Đã đăng ký: ${s.tieuDe}`);
                onDong();
              }}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
            >
              {(s.conCho ?? 0) > 0 ? "Đăng ký tham gia" : "Hết chỗ"}
            </button>
          )}
          {s.loai === "on-thi" && (
            <button
              type="button"
              onClick={() => {
                huyDangKyBuoi(s.buoiId!);
                toast("Đã huỷ đăng ký");
                onDong();
              }}
              className="rounded-full px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Huỷ đăng ký
            </button>
          )}
          {(s.loai === "ca-nhan" || s.loai === "thi") && (
            <button
              type="button"
              onClick={() => {
                xoaSuKien(s.id);
                toast("Đã xoá sự kiện");
                onDong();
              }}
              className="rounded-full px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Xoá
            </button>
          )}
        </div>
      </div>
    </Khung>
  );
}

/** Form tạo sự kiện cá nhân (bấm ô trống hoặc nút "+ Tạo"). */
export function CreateDialog({ batDau, onDong }: { batDau: Date; onDong: () => void }) {
  const { themSuKien, toast } = useApp();
  const [tieuDe, setTieuDe] = useState("");
  const [loai, setLoai] = useState<"ca-nhan" | "thi">("ca-nhan");
  const [ngay, setNgay] = useState(ngayISO(batDau));
  const [tu, setTu] = useState(gioPhut(batDau));
  const [den, setDen] = useState(gioPhut(new Date(batDau.getTime() + 60 * 60000)));
  const [ghiChu, setGhiChu] = useState("");
  const [daThu, setDaThu] = useState(false);

  const gioHopLe = den > tu;
  const luu = (e: FormEvent) => {
    e.preventDefault();
    setDaThu(true);
    if (!tieuDe.trim() || !gioHopLe) return;
    themSuKien({
      id: `sk-${Date.now()}`,
      tieuDe: tieuDe.trim(),
      batDau: `${ngay}T${tu}`,
      ketThuc: `${ngay}T${den}`,
      loai,
      ghiChu: ghiChu.trim() || undefined,
    });
    toast(`Đã thêm "${tieuDe.trim()}" vào lịch`);
    onDong();
  };

  return (
    <Khung onDong={onDong}>
      <form onSubmit={luu} className="space-y-4 p-6" noValidate>
        <input
          autoFocus
          value={tieuDe}
          onChange={(e) => setTieuDe(e.target.value)}
          placeholder="Thêm tiêu đề"
          className="w-full border-b-2 border-slate-200 pb-2 text-xl text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600"
        />
        {daThu && !tieuDe.trim() && <p className="-mt-2 text-sm text-red-600">Vui lòng nhập tiêu đề.</p>}

        <div className="flex gap-2" role="radiogroup" aria-label="Loại lịch">
          {(
            [
              ["ca-nhan", "Lịch cá nhân"],
              ["thi", "Lịch thi & hạn nộp"],
            ] as const
          ).map(([v, nhan]) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={loai === v}
              onClick={() => setLoai(v)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                loai === v ? "bg-blue-50 text-blue-800 ring-1 ring-blue-200" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className={`h-3 w-3 rounded ${kieuLich(v).mau}`} />
              {nhan}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] items-end gap-2">
          <Truong nhan="Ngày">
            <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className={inputCls} />
          </Truong>
          <Truong nhan="Từ">
            <input type="time" value={tu} onChange={(e) => setTu(e.target.value)} className={inputCls} />
          </Truong>
          <Truong nhan="Đến">
            <input type="time" value={den} onChange={(e) => setDen(e.target.value)} className={inputCls} />
          </Truong>
        </div>
        {!gioHopLe && <p className="-mt-2 text-sm text-red-600">Giờ kết thúc phải sau giờ bắt đầu.</p>}

        <Truong nhan="Ghi chú / địa điểm">
          <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} className={inputCls} />
        </Truong>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onDong} className="rounded-full px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Huỷ
          </button>
          <button type="submit" className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Lưu
          </button>
        </div>
      </form>
    </Khung>
  );
}

