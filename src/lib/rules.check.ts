// Kiểm tra nhanh các ca bắt buộc ở mục 4 của spec. Chạy: npm run check
import { monHocs, tutorMons, tutors } from "../data/mockData";
import { buoiOnThiSapToi, duDieuKienDay, monNhanDay, tutorsDayMon, videoTrangChu } from "./rules";

let loi = 0;
function kiemTra(dieuKien: boolean, moTa: string) {
  console.assert(dieuKien, moTa);
  console.log(`${dieuKien ? "✓" : "✗"} ${moTa}`);
  if (!dieuKien) loi++;
}

const t = (id: string) => tutors.find((x) => x.id === id)!;
const tm = (tutorId: string, monId: string) => tutorMons.find((x) => x.tutorId === tutorId && x.monId === monId)!;

kiemTra(duDieuKienDay(t("t1"), tm("t1", "ueb-ktl")), "GPA 3.85 + A+ → đủ điều kiện");
kiemTra(!duDieuKienDay(t("t2"), tm("t2", "ueb-tcdn")), "GPA 3.9 + B+ → KHÔNG đủ điều kiện");
kiemTra(!duDieuKienDay(t("t4"), tm("t4", "ueb-tcc")), "GPA 3.5 + A → KHÔNG đủ điều kiện");

kiemTra(t("t1").gpa === 3.85 && monNhanDay("t1").length === 3, "Ca 1: tutor GPA 3.85 dạy đúng 3 môn");
kiemTra(t("t2").gpa === 3.9 && monNhanDay("t2").length === 2, "Ca 2: tutor GPA 3.9 chỉ dạy 2 môn");
kiemTra(monNhanDay("t4").length === 0, "Ca 3: tutor GPA 3.5 không dạy môn nào");
kiemTra(
  monHocs.every((m) => tutorsDayMon(m.id).every((x) => x.tutor.gpa >= 3.6)),
  "Ca 3: tutor GPA < 3.6 không xuất hiện ở danh sách môn nào",
);
kiemTra(tutors.some((x) => x.trangThai === "Cựu sinh viên" && monNhanDay(x.id).length > 0), "Ca 4: có cựu sinh viên đang dạy");
kiemTra(tutorsDayMon("neu-ktl").length >= 2, "Ca 5: ≥ 2 tutor dạy Kinh tế lượng ở NEU");
kiemTra(tutorsDayMon("ueb-ktl").some((x) => x.tutor.id === "t2") && tutorsDayMon("ueb-ktl").length >= 2, "Ca 5 (UEB): ≥ 2 tutor dạy Kinh tế lượng ở UEB, có tutor ca 2");
kiemTra(!tutorsDayMon("neu-ktl").some((x) => x.tutor.id === "t8"), "Tutor điểm B+ Kinh tế lượng NEU bị lọc");

kiemTra(!buoiOnThiSapToi().some((x) => x.tutor.id === "t4"), "Buổi ôn thi của tutor GPA 3.5 bị ẩn khỏi lịch");
kiemTra(!videoTrangChu([]).some((x) => x.tutor.gpa < 3.6), "Feed video trang chủ không có tutor GPA < 3.6");

if (loi > 0) throw new Error(`${loi} kiểm tra thất bại`);
console.log("\nTất cả kiểm tra đều đạt.");
