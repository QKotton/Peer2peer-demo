import { Link, useSearchParams } from "react-router-dom";
import DocumentManager from "../components/tutor/DocumentManager";
import EvidenceUpload from "../components/tutor/EvidenceUpload";
import { inputCls, labelCls } from "../components/tutor/formUi";
import LectureManager from "../components/tutor/LectureManager";
import SubjectRegistration from "../components/tutor/SubjectRegistration";
import TutorInfoForm from "../components/tutor/TutorInfoForm";
import { Avatar, HuyHieuXacThuc } from "../components/ui";
import { useApp } from "../context/AppContext";
import { tutors } from "../data/mockData";
import { layTutor, monNhanDay } from "../lib/rules";
import { TAB_TUTOR, type TabTutorId } from "../lib/tutorTabs";


export default function TutorDashboard() {
  const { cheDo, setCheDo, tutorDongVaiId, setTutorDongVaiId } = useApp();
  const [params, setParams] = useSearchParams();
  const tab: TabTutorId = TAB_TUTOR.some((t) => t.id === params.get("tab")) ? (params.get("tab") as TabTutorId) : "thong-tin";

  if (cheDo !== "tutor") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="font-semibold text-slate-900">Trang này dành cho tutor</p>
        <p className="mt-1 text-sm text-slate-600">Bật chế độ “Tôi là tutor” để quản lý hồ sơ và bài giảng.</p>
        <button type="button" onClick={() => setCheDo("tutor")} className="mt-4 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
          Bật chế độ tutor
        </button>
      </div>
    );
  }

  const tutor = layTutor(tutorDongVaiId)!;
  const soMon = monNhanDay(tutor.id).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-4">
          <Avatar chu={tutor.anh} />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Chế độ tutor</p>
            <h1 className="truncate text-xl font-extrabold text-slate-900">{tutor.hoTen}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-600">
                GPA {tutor.gpa.toFixed(2)} · {soMon} môn đang hiển thị
              </span>
              {tutor.daXacThucBangDiem && <HuyHieuXacThuc />}
              <Link to={`/tutor/${tutor.id}`} className="font-medium text-blue-700 hover:underline">
                Xem hồ sơ công khai →
              </Link>
            </div>
          </div>
        </div>
        <label className="block md:w-72">
          <span className={labelCls}>
            Đang đóng vai <span className="font-normal text-slate-500">(demo chưa có đăng nhập)</span>
          </span>
          <select value={tutorDongVaiId} onChange={(e) => setTutorDongVaiId(e.target.value)} className={inputCls}>
            {tutors.map((t) => (
              <option key={t.id} value={t.id}>
                {t.hoTen} – GPA {t.gpa.toFixed(2)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div role="tablist" className="an-thanh-cuon -mx-1 flex gap-1 overflow-x-auto border-b border-slate-200 px-1">
        {TAB_TUTOR.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setParams({ tab: t.id }, { replace: true })}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id ? "border-blue-700 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {t.nhan}
          </button>
        ))}
      </div>

      {/* key = tutor.id để form nạp lại khi đổi tutor đóng vai */}
      {tab === "thong-tin" && <TutorInfoForm key={tutor.id} tutor={tutor} />}
      {tab === "mon-day" && <SubjectRegistration key={tutor.id} tutor={tutor} />}
      {tab === "minh-chung" && <EvidenceUpload key={tutor.id} tutor={tutor} />}
      {tab === "bai-giang" && <LectureManager key={tutor.id} tutor={tutor} />}
      {tab === "tai-lieu" && <DocumentManager key={tutor.id} tutor={tutor} />}
    </div>
  );
}
