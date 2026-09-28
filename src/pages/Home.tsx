import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/icons";
import ScheduleList from "../components/ScheduleList";
import VideoCard from "../components/VideoCard";
import VideoModal from "../components/VideoModal";
import { useApp } from "../context/AppContext";
import type { BaiGiang } from "../data/mockData";
import { videoTrangChu } from "../lib/rules";

const SO_VIDEO_BAN_DAU = 8; // ~2 hàng trên màn hình rộng
const SO_VIDEO_MOBILE = 4; // điện thoại chỉ hiện 4 để khu lịch không bị đẩy quá xa

const diemKhacBiet = [
  { icon: "✓", tieuDe: "Xác thực bảng điểm", moTa: "Chỉ nhận dạy khi GPA ≥ 3.6 và điểm môn đó đạt A/A+." },
  { icon: "🎯", tieuDe: "Đúng trường, đúng môn", moTa: "Học với người đã học đúng học phần, đúng đề cương." },
  { icon: "★", tieuDe: "Đánh giá theo từng môn", moTa: "Điểm sao tính riêng từng môn, không gộp chung." },
];

export default function Home() {
  const { baiGiangThem, moBoLoc } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [monChon, setMonChon] = useState("Tất cả");
  const [xemHet, setXemHet] = useState(false);
  const [dangXem, setDangXem] = useState<BaiGiang | null>(null);
  const lichRef = useRef<HTMLElement>(null);

  // "Lịch ôn thi" trên thanh chức năng → cuộn tới khu lịch
  useEffect(() => {
    if (params.get("muc") === "lich") lichRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [params]);

  const feed = videoTrangChu(baiGiangThem);
  const idMoi = new Set(baiGiangThem.map((b) => b.id));
  const chips = ["Tất cả", ...new Set(feed.map((x) => x.mon.ten))];
  const loc = monChon === "Tất cả" ? feed : feed.filter((x) => x.mon.ten === monChon);
  const hienThi = xemHet ? loc : loc.slice(0, SO_VIDEO_BAN_DAU);

  return (
    <div className="space-y-10">
      {/* ---------- Khu video bài giảng ---------- */}
      <section>
        <div className="an-thanh-cuon -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setMonChon(c);
                setXemHet(false);
              }}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                monChon === c ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
          <button
            type="button"
            onClick={() => moBoLoc()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Icon ten="filter" className="h-4 w-4" />
            Lọc theo trường, khoa
          </button>
        </div>

        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hienThi.map(({ bg, tutor, mon }, i) => (
            <div key={bg.id} className={!xemHet && i >= SO_VIDEO_MOBILE ? "max-sm:hidden" : ""}>
              <VideoCard
                bg={bg}
                tutor={tutor}
                mon={mon}
                moi={idMoi.has(bg.id)}
                onXem={() => (bg.xemThu ? setDangXem(bg) : navigate(`/tutor/${tutor.id}?mon=${mon.id}`))}
              />
            </div>
          ))}
        </div>

        {loc.length > SO_VIDEO_MOBILE && (
          <div className="mt-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <button
              type="button"
              onClick={() => setXemHet((x) => !x)}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {xemHet ? "Thu gọn" : "Xem thêm video"}
            </button>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
        )}
      </section>

      {/* ---------- Lịch ôn thi sắp tới ---------- */}
      <section ref={lichRef} className="scroll-mt-20">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
              <Icon ten="calendar" className="h-6 w-6 text-blue-700" />
              Lịch ôn thi sắp tới
            </h2>
            <p className="mt-1 text-sm text-slate-600">Các buổi học nhóm do tutor đủ điều kiện tổ chức, trả theo buổi.</p>
          </div>
        </div>
        <ScheduleList />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {diemKhacBiet.map((d) => (
          <div key={d.tieuDe} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 font-bold text-blue-700">{d.icon}</span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{d.tieuDe}</h3>
              <p className="text-sm text-slate-600">{d.moTa}</p>
            </div>
          </div>
        ))}
      </section>

      {dangXem && <VideoModal bg={dangXem} onClose={() => setDangXem(null)} />}
    </div>
  );
}
