import { useDangPhatTrien } from "../context/AppContext";
import type { TutorMon } from "../data/mockData";
import { dinhDangTien } from "../lib/rules";

export default function ServicePackages({ tm }: { tm: TutorMon }) {
  const dangPhatTrien = useDangPhatTrien();
  const goi = [
    { ten: "Bài giảng quay sẵn", moTa: "Học lúc nào cũng được", gia: tm.giaBaiGiang, donVi: "/ trọn môn", nut: "Mua trọn môn", noiBat: false },
    { ten: "Gói coach", moTa: "Nhắn tin hỏi đáp + 1 buổi 1-1 dài 90 phút", gia: tm.giaCoach, donVi: "/ trọn gói", nut: "Đăng ký coach", noiBat: true },
    { ten: "Lớp học chung", moTa: "Học nhóm, trả theo buổi", gia: tm.giaLopChung, donVi: "/ buổi", nut: "Xem lịch lớp", noiBat: false },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {goi.map((g) => (
        <div
          key={g.ten}
          className={`flex flex-col rounded-2xl border bg-white p-5 ${g.noiBat ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200"}`}
        >
          <h4 className="font-bold text-slate-900">{g.ten}</h4>
          <p className="mt-1 flex-1 text-sm text-slate-600">{g.moTa}</p>
          <p className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900">{dinhDangTien(g.gia)}</span>
            <span className="ml-1 text-sm text-slate-500">{g.donVi}</span>
          </p>
          <button
            type="button"
            onClick={dangPhatTrien}
            className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              g.noiBat ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {g.nut}
          </button>
        </div>
      ))}
    </div>
  );
}
