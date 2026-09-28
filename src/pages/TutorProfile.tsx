import type { ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import LectureList from "../components/LectureList";
import ReviewList from "../components/ReviewList";
import ServicePackages from "../components/ServicePackages";
import { Avatar, Chip, HuyHieuXacThuc, Sao } from "../components/ui";
import { khoaMinhChung, useApp, useDangPhatTrien } from "../context/AppContext";
import type { BaiGiang, MonHoc, Tutor, TutorMon } from "../data/mockData";
import { baiGiangCua, danhGiaCuaMon, layKhoa, layTruong, layTutor, monNhanDay, saoTrungBinh } from "../lib/rules";

function Khoi({ tieuDe, ds }: { tieuDe: string; ds: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-bold text-slate-900">{tieuDe}</h3>
      <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
        {ds.map((x) => (
          <li key={x} className="flex gap-2">
            <span className="text-blue-700">•</span>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Danh sách minh chứng tutor đã được xác thực (nộp ở tab Minh chứng của chế độ tutor). */
function MinhChungDaXacThuc({ tutor }: { tutor: Tutor }) {
  const { layMinhChung } = useApp();
  const ds = [
    { khoa: khoaMinhChung(tutor.id, "bang-diem"), nhan: "Bảng điểm tích luỹ" },
    { khoa: khoaMinhChung(tutor.id, "the-sv"), nhan: tutor.trangThai === "Cựu sinh viên" ? "Bằng tốt nghiệp" : "Thẻ sinh viên" },
    ...tutor.thanhTich.map((t) => ({ khoa: khoaMinhChung(tutor.id, "thanh-tich", t), nhan: t })),
  ].filter((x) => layMinhChung(x.khoa)?.trangThai === "da-xac-thuc");
  if (ds.length === 0) return null;
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
      <h3 className="font-bold text-slate-900">Minh chứng đã xác thực</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {ds.map((x) => (
          <span key={x.khoa} className="rounded-full bg-white px-3 py-1 text-sm text-emerald-800 ring-1 ring-emerald-200">
            ✓ {x.nhan}
          </span>
        ))}
      </div>
    </div>
  );
}

function Muc({ tieuDe, children }: { tieuDe: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-bold text-slate-900">{tieuDe}</h3>
      {children}
    </section>
  );
}

export default function TutorProfile() {
  const { tutorId = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const { baiGiangThem } = useApp();
  const dangPhatTrien = useDangPhatTrien();
  const tutor = layTutor(tutorId);

  if (!tutor) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Không tìm thấy tutor.</p>
        <Link to="/" className="mt-3 inline-block font-semibold text-blue-700 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  // Chỉ các môn qua được duDieuKienDay
  const cacMon = monNhanDay(tutor.id);
  const monDangChon = cacMon.find((x) => x.mon.id === params.get("mon")) ?? cacMon[0];
  const chonMon = (id: string) => setParams({ mon: id }, { replace: true });

  return (
    <div className="space-y-8">
      {/* ---------- Tầng A – Hồ sơ chung ---------- */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row">
          <Avatar chu={tutor.anh} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{tutor.hoTen}</h1>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">{tutor.trangThai}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {layTruong(tutor.truongId)?.ten} · {layKhoa(tutor.khoaId)?.ten}
            </p>
            <p className="text-sm text-slate-600">
              Chuyên ngành {tutor.chuyenNganh} · Nhập học {tutor.namNhapHoc}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">GPA {tutor.gpa.toFixed(2)} / 4</span>
              {tutor.daXacThucBangDiem && <HuyHieuXacThuc />}
            </div>
            <p className="mt-4 text-slate-700">{tutor.gioiThieu}</p>
          </div>
          <div className="flex gap-2 sm:flex-col sm:self-start [&>button]:sm:flex-none">
            <button type="button" onClick={dangPhatTrien} className="flex-1 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
              Nhắn tin
            </button>
            <button type="button" onClick={dangPhatTrien} className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
              Đặt lịch
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Khoi tieuDe="Thành tích học tập" ds={tutor.thanhTich} />
        <Khoi tieuDe="Hoạt động & kinh nghiệm" ds={tutor.hoatDong} />
        <Khoi tieuDe="Kỹ năng mềm có thể hướng dẫn" ds={tutor.kyNangMem} />
      </div>

      <MinhChungDaXacThuc tutor={tutor} />

      <section>
        <h2 className="text-xl font-extrabold text-slate-900">Các môn nhận dạy ({cacMon.length})</h2>
        {cacMon.length === 0 ? (
          <p className="mt-3 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">Tutor này hiện chưa có môn nào đủ điều kiện nhận dạy.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2" role="tablist">
            {cacMon.map(({ mon, tm }) => {
              const active = mon.id === monDangChon?.mon.id;
              return (
                <button
                  key={mon.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => chonMon(mon.id)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    active ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-700"
                  }`}
                >
                  {mon.ten} <span className={active ? "opacity-80" : "text-slate-400"}>· {tm.diem}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------- Tầng B – Theo từng môn ---------- */}
      {monDangChon && (
        <TangMon
          key={monDangChon.mon.id}
          tutorId={tutor.id}
          mon={monDangChon.mon}
          tm={monDangChon.tm}
          baiGiang={baiGiangCua(tutor.id, monDangChon.mon.id, baiGiangThem)}
          idMoi={new Set(baiGiangThem.map((b) => b.id))}
        />
      )}
    </div>
  );
}

function TangMon({
  tutorId,
  mon,
  tm,
  baiGiang,
  idMoi,
}: {
  tutorId: string;
  mon: MonHoc;
  tm: TutorMon;
  baiGiang: BaiGiang[];
  idMoi: Set<string>;
}) {
  const sao = saoTrungBinh(tutorId, mon.id);
  return (
    <div role="tabpanel" className="space-y-8 rounded-2xl bg-blue-50/50 p-4 ring-1 ring-blue-100 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">{mon.ten}</h2>
          <p className="mt-1 text-sm text-slate-600">
            Mã học phần {mon.maHocPhan} · {mon.soTinChi} tín chỉ
          </p>
          <div className="mt-2">
            <Sao tb={sao.tb} soLuot={sao.soLuot} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200">
          <p className="text-xs font-medium text-slate-500">Điểm đạt được</p>
          <p className="text-3xl font-extrabold text-blue-700">{tm.diem}</p>
          <p className="text-xs text-slate-500">{tm.hocKy}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Muc tieuDe="Nội dung có thể kèm">
          <div className="flex flex-wrap gap-2">
            {tm.noiDungKem.map((x) => (
              <Chip key={x}>{x}</Chip>
            ))}
          </div>
        </Muc>
        <Muc tieuDe="Lịch rảnh">
          <div className="flex flex-wrap gap-2">
            {tm.lichRanh.map((x) => (
              <Chip key={x}>{x}</Chip>
            ))}
          </div>
        </Muc>
      </div>

      <Muc tieuDe="Gói dịch vụ">
        <ServicePackages tm={tm} />
      </Muc>

      <Muc tieuDe={`Bài giảng (${baiGiang.length} chương)`}>
        <LectureList ds={baiGiang} laChuongMoi={(id) => idMoi.has(id)} />
      </Muc>

      <Muc tieuDe={`Đánh giá môn ${mon.ten}`}>
        <ReviewList ds={danhGiaCuaMon(tutorId, mon.id)} />
      </Muc>
    </div>
  );
}
