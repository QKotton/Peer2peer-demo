import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDangPhatTrien } from "../../context/AppContext";
import type { MonHoc, TaiLieu, Truong, Tutor } from "../../data/mockData";
import { Icon } from "../icons";
import { Avatar, HuyHieuXacThuc } from "../ui";
import { MAU_DINH_DANG, ngayVN } from "./DocCard";

type Props = { tl: TaiLieu; tutor: Tutor; mon: MonHoc; truong: Truong; onDong: () => void };

/** Trang giấy minh hoạ cho tài liệu mẫu chưa có file thật. */
function TrangMinhHoa({ tl, tutor, mon }: { tl: TaiLieu; tutor: Tutor; mon: MonHoc }) {
  return (
    <div className="mx-auto w-full max-w-lg rounded bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">
        {mon.ten} · {mon.maHocPhan}
      </p>
      <h2 className="mt-1 text-xl font-bold text-slate-900">{tl.tieuDe}</h2>
      <p className="mt-1 text-xs text-slate-500">Biên soạn: {tutor.hoTen}</p>
      <hr className="my-4" />
      {[1, 2, 3].map((muc) => (
        <div key={muc} className="mb-5">
          <div className="mb-2 h-3 w-1/2 rounded bg-slate-300" />
          {[100, 95, 98, 80].map((w, i) => (
            <div key={i} className="mb-1.5 h-2 rounded bg-slate-200" style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
      <p className="mt-6 rounded-lg bg-amber-50 p-3 text-center text-xs text-amber-800 ring-1 ring-amber-200">
        Bản xem trước minh hoạ – nhóm sẽ gắn file tài liệu thật.
      </p>
    </div>
  );
}

export default function DocViewer({ tl, tutor, mon, truong, onDong }: Props) {
  const dangPhatTrien = useDangPhatTrien();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDong();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDong]);

  const xemTruoc = () => {
    if (!tl.mienPhi) {
      return (
        <div className="grid h-full place-items-center p-6 text-center">
          <div>
            <p className="text-4xl">🔒</p>
            <p className="mt-2 font-semibold text-slate-900">Tài liệu nằm trong gói bài giảng của tutor</p>
            <p className="mt-1 text-sm text-slate-600">Mua gói bài giảng môn {mon.ten} để xem toàn bộ.</p>
          </div>
        </div>
      );
    }
    if (!tl.fileUrl) return <TrangMinhHoa tl={tl} tutor={tutor} mon={mon} />;
    if (tl.dinhDang === "PDF") return <iframe src={tl.fileUrl} title={tl.tieuDe} className="h-full min-h-[60vh] w-full rounded bg-white" />;
    if (tl.dinhDang === "Ảnh") return <img src={tl.fileUrl} alt={tl.tieuDe} className="mx-auto max-h-full rounded shadow" />;
    return (
      <div className="grid h-full place-items-center p-6 text-center text-sm text-slate-600">
        Trình duyệt không xem trước được file {tl.dinhDang}. Bấm “Tải xuống” để mở bằng Word / PowerPoint.
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-2 sm:p-6" onClick={onDong}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={tl.tieuDe}
        className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Vùng xem trước */}
        <div className="min-h-[45vh] flex-1 overflow-auto bg-slate-100 p-4 sm:p-6">{xemTruoc()}</div>

        {/* Thông tin */}
        <aside className="w-full shrink-0 overflow-y-auto border-t border-slate-200 p-5 md:w-80 md:border-l md:border-t-0">
          <div className="flex items-start justify-between gap-3">
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold text-white ${MAU_DINH_DANG[tl.dinhDang]}`}>{tl.dinhDang}</span>
            <button type="button" onClick={onDong} className="-m-1 rounded-full p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Đóng">
              <Icon ten="close" />
            </button>
          </div>
          <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900">{tl.tieuDe}</h2>
          <p className="mt-1 text-sm text-slate-600">{tl.moTa}</p>

          <dl className="mt-4 space-y-1.5 text-sm">
            {(
              [
                ["Loại", tl.loai],
                ["Môn", `${mon.ten} (${mon.maHocPhan})`],
                ["Trường", truong.ten],
                ["Số trang", String(tl.soTrang)],
                ["Ngày đăng", ngayVN(tl.ngayDang)],
                ["Lượt xem", tl.luotXem.toLocaleString("vi-VN")],
                ["Quyền xem", tl.mienPhi ? "Miễn phí" : "Trong gói bài giảng"],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-24 shrink-0 text-slate-500">{k}</dt>
                <dd className="text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <Avatar chu={tutor.anh} size="sm" />
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-slate-900">{tutor.hoTen}</p>
              <p className="text-xs text-slate-500">
                GPA {tutor.gpa.toFixed(2)} · điểm môn này đạt chuẩn A/A+
              </p>
              {tutor.daXacThucBangDiem && (
                <div className="mt-1">
                  <HuyHieuXacThuc />
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {tl.mienPhi ? (
              tl.fileUrl ? (
                <a
                  href={tl.fileUrl}
                  download={tl.tieuDe}
                  className="rounded-xl bg-blue-700 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Tải xuống
                </a>
              ) : (
                <button type="button" onClick={dangPhatTrien} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
                  Tải xuống
                </button>
              )
            ) : (
              <button type="button" onClick={dangPhatTrien} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
                Mua gói để xem
              </button>
            )}
            <Link
              to={`/tutor/${tutor.id}?mon=${mon.id}`}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Xem hồ sơ tutor
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">Tài liệu do tutor tự soạn và cam kết không sử dụng slide, giáo trình hay đề thi của giảng viên.</p>
        </aside>
      </div>
    </div>
  );
}
