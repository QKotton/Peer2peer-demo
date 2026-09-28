import { useRef } from "react";
import { khoaMinhChung, useApp } from "../../context/AppContext";
import type { Tutor } from "../../data/mockData";
import { NhanTrangThai } from "./formUi";

const GIOI_HAN_MB = 10;
const dungLuong = (b: number) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

type OProps = { khoa: string; tieuDe: string; moTa: string; batBuoc?: boolean; gon?: boolean };

/** Một ô nộp minh chứng: chọn file → xem trước → "Đang xác thực…" → "Đã xác thực". */
function ONop({ khoa, tieuDe, moTa, batBuoc, gon }: OProps) {
  const { layMinhChung, nopMinhChung, xoaMinhChung, toast } = useApp();
  const input = useRef<HTMLInputElement>(null);
  const mc = layMinhChung(khoa);

  const chon = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") return toast("Chỉ nhận ảnh hoặc PDF");
    if (f.size > GIOI_HAN_MB * 1024 * 1024) return toast(`File tối đa ${GIOI_HAN_MB} MB`);
    nopMinhChung(khoa, f);
  };

  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center ${gon ? "py-3" : "rounded-2xl border border-slate-200 bg-white p-5"}`}>
      {/* Xem trước */}
      <div className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 text-slate-400 ${gon ? "h-14 w-20" : "h-24 w-32"}`}>
        {mc?.url && mc.laAnh ? (
          <img src={mc.url} alt={`Xem trước ${mc.ten}`} className="h-full w-full object-cover" />
        ) : mc ? (
          <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">PDF</span>
        ) : (
          <span className="text-2xl">＋</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`font-semibold text-slate-900 ${gon ? "text-sm" : ""}`}>
            {tieuDe} {batBuoc && <span className="text-red-600">*</span>}
          </p>
          <NhanTrangThai tt={mc?.trangThai ?? "chua-nop"} />
        </div>
        <p className="mt-0.5 text-sm text-slate-500">
          {mc ? (
            <>
              {mc.ten}
              {mc.kichThuoc > 0 && ` · ${dungLuong(mc.kichThuoc)}`}
              {mc.url && (
                <a href={mc.url} target="_blank" rel="noreferrer" className="ml-2 font-medium text-blue-700 hover:underline">
                  Xem file
                </a>
              )}
            </>
          ) : (
            moTa
          )}
        </p>
      </div>

      <div className="flex shrink-0 gap-2">
        <input
          ref={input}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            chon(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => input.current?.click()}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${mc ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-blue-700 text-white hover:bg-blue-800"}`}
        >
          {mc ? "Nộp lại" : "Tải lên"}
        </button>
        {mc?.url && (
          <button type="button" onClick={() => xoaMinhChung(khoa)} className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            Gỡ
          </button>
        )}
      </div>
    </div>
  );
}

export default function EvidenceUpload({ tutor }: { tutor: Tutor }) {
  const { layMinhChung } = useApp();
  const laCuuSV = tutor.trangThai === "Cựu sinh viên";
  const khoaBD = khoaMinhChung(tutor.id, "bang-diem");
  const khoaSV = khoaMinhChung(tutor.id, "the-sv");
  const khoaTT = tutor.thanhTich.map((t) => khoaMinhChung(tutor.id, "thanh-tich", t));
  const tatCa = [khoaBD, khoaSV, ...khoaTT];
  const daXong = tatCa.filter((k) => layMinhChung(k)?.trangThai === "da-xac-thuc").length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between text-sm">
          <p className="font-semibold text-slate-900">Mức độ hoàn thiện minh chứng</p>
          <p className="text-slate-600">
            {daXong}/{tatCa.length} đã xác thực
          </p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(daXong / tatCa.length) * 100}%` }} />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Nhận ảnh (JPG, PNG) hoặc PDF, tối đa {GIOI_HAN_MB} MB. Bản demo mô phỏng việc xác thực, file chỉ lưu trong trình duyệt, không gửi lên máy chủ.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="font-bold text-slate-900">Học tập</h3>
        <ONop
          khoa={khoaBD}
          batBuoc
          tieuDe="Bảng điểm tích luỹ"
          moTa="Bảng điểm có dấu của phòng Đào tạo hoặc ảnh chụp từ cổng thông tin sinh viên. Dùng để đối chiếu GPA và điểm từng môn."
        />
        <ONop
          khoa={khoaSV}
          tieuDe={laCuuSV ? "Bằng tốt nghiệp" : "Thẻ sinh viên"}
          moTa={laCuuSV ? "Bản chụp bằng tốt nghiệp hoặc giấy chứng nhận tốt nghiệp tạm thời." : "Ảnh chụp hai mặt thẻ sinh viên còn hạn."}
        />
      </section>

      <section>
        <h3 className="font-bold text-slate-900">Thành tích</h3>
        <p className="mb-2 text-sm text-slate-500">Mỗi thành tích trong hồ sơ cần một minh chứng (giấy khen, quyết định học bổng, chứng nhận…).</p>
        {tutor.thanhTich.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Chưa có thành tích nào. Thêm ở tab Thông tin chung.</p>
        ) : (
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-5">
            {tutor.thanhTich.map((t, i) => (
              <ONop key={t} khoa={khoaTT[i]} tieuDe={t} moTa="Chưa có minh chứng" gon />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
