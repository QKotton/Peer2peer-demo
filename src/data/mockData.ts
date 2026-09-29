// DỮ LIỆU MINH HOẠ – tên tutor, điểm, giá, đánh giá đều hư cấu.
// Tên khoa / môn / mã học phần cần nhóm kiểm tra lại.
//
// Riêng 2 môn của Khoa Kinh tế Phát triển – UEB (Kinh tế lượng, Toán cao cấp) dùng mã học phần
// và số tín chỉ THẬT, lấy từ Chương trình đào tạo ngành Kinh tế Phát triển (mã ngành 7310105),
// ban hành kèm Quyết định 4327/QĐ-ĐHKT ngày 28/12/2021 (file FINAL_KTPT.doc).
// Các môn của Khoa Quản trị kinh doanh – NEU cũng dùng mã và số tín chỉ THẬT (theo khung CTĐT của NEU,
// khối "Kiến thức ngành" và "Chuyên sâu").
// Các môn còn lại dùng mã DEMO-xxx, nhóm thay mã thật sau.

// ---------- Kiểu dữ liệu ----------

export type Truong = { id: string; ten: string; tenVietTat: string };

export type Khoa = { id: string; truongId: string; ten: string };

export type MonHoc = {
  id: string;
  khoaId: string;
  maHocPhan: string;
  ten: string;
  soTinChi: number;
};

export type Diem = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "F";

export type Tutor = {
  id: string;
  hoTen: string; // HƯ CẤU
  anh: string; // chữ cái hiển thị trên avatar – KHÔNG dùng ảnh người thật
  truongId: string;
  khoaId: string;
  chuyenNganh: string;
  namNhapHoc: number;
  trangThai: "Sinh viên năm 3" | "Sinh viên năm 4" | "Cựu sinh viên";
  gpa: number; // thang 4
  daXacThucBangDiem: boolean;
  gioiThieu: string;
  thanhTich: string[];
  hoatDong: string[];
  kyNangMem: string[];
};

export type TutorMon = {
  tutorId: string;
  monId: string;
  diem: Diem;
  hocKy: string;
  noiDungKem: string[];
  giaBaiGiang: number; // VND, trọn môn
  giaCoach: number; // VND, trọn gói
  giaLopChung: number; // VND, mỗi buổi
  lichRanh: string[];
};

export type DanhGia = {
  tutorId: string;
  monId: string; // đánh giá gắn với MÔN, không gộp chung
  soSao: 1 | 2 | 3 | 4 | 5;
  nhanXet: string;
  nguoiDanhGia: string;
};

export type BaiGiang = {
  id: string;
  tutorId: string;
  monId: string;
  chuongSo: number;
  tieuDe: string;
  moTa: string;
  thoiLuong: string;
  videoUrl: string | null; // null = chưa có video (hiện placeholder)
  xemThu: boolean;
  trangThai: "Đã đăng";
};

// ---------- Trường ----------

export const truongs: Truong[] = [
  { id: "ueb", ten: "Trường Đại học Kinh tế – ĐHQGHN", tenVietTat: "UEB" },
  { id: "neu", ten: "Đại học Kinh tế Quốc dân", tenVietTat: "NEU" },
];

// ---------- Khoa ----------
// TODO: nhóm xác nhận tên khoa

export const khoas: Khoa[] = [
  { id: "ueb-ktpt", truongId: "ueb", ten: "Khoa Kinh tế Phát triển" },
  { id: "ueb-tcnh", truongId: "ueb", ten: "Khoa Tài chính – Ngân hàng" },
  { id: "neu-tkt", truongId: "neu", ten: "Khoa Toán kinh tế" },
  { id: "neu-ktkt", truongId: "neu", ten: "Khoa Kế toán – Kiểm toán" },
  { id: "neu-qtkd", truongId: "neu", ten: "Khoa Quản trị kinh doanh" },
];

// ---------- Môn học ----------

export const monHocs: MonHoc[] = [
  // UEB – Khoa Kinh tế Phát triển (mã thật theo CTĐT ngành KTPT)
  { id: "ueb-ktl", khoaId: "ueb-ktpt", maHocPhan: "INE1052", ten: "Kinh tế lượng", soTinChi: 3 },
  { id: "ueb-tcc", khoaId: "ueb-ktpt", maHocPhan: "FDE1092", ten: "Toán cao cấp", soTinChi: 4 },

  // UEB – Khoa Tài chính – Ngân hàng
  { id: "ueb-tcdn", khoaId: "ueb-tcnh", maHocPhan: "DEMO-201", ten: "Tài chính doanh nghiệp", soTinChi: 3 },
  { id: "ueb-nlkt", khoaId: "ueb-tcnh", maHocPhan: "DEMO-202", ten: "Nguyên lý kế toán", soTinChi: 3 },
  { id: "ueb-vimo", khoaId: "ueb-tcnh", maHocPhan: "DEMO-203", ten: "Kinh tế vi mô", soTinChi: 3 },

  // NEU – Khoa Toán kinh tế
  { id: "neu-ktl", khoaId: "neu-tkt", maHocPhan: "DEMO-301", ten: "Kinh tế lượng", soTinChi: 3 },
  { id: "neu-tcc", khoaId: "neu-tkt", maHocPhan: "DEMO-302", ten: "Toán cao cấp", soTinChi: 3 },
  { id: "neu-xstk", khoaId: "neu-tkt", maHocPhan: "DEMO-303", ten: "Lý thuyết xác suất và thống kê", soTinChi: 3 },
  { id: "neu-tkkt", khoaId: "neu-tkt", maHocPhan: "DEMO-304", ten: "Thống kê kinh tế", soTinChi: 3 },

  // NEU – Khoa Kế toán – Kiểm toán
  { id: "neu-nlkt", khoaId: "neu-ktkt", maHocPhan: "DEMO-401", ten: "Nguyên lý kế toán", soTinChi: 3 },
  { id: "neu-kttc", khoaId: "neu-ktkt", maHocPhan: "DEMO-402", ten: "Kế toán tài chính", soTinChi: 3 },
  { id: "neu-tcdn", khoaId: "neu-ktkt", maHocPhan: "DEMO-403", ten: "Tài chính doanh nghiệp", soTinChi: 3 },

  // NEU – Khoa Quản trị kinh doanh (mã thật theo khung CTĐT NEU)
  { id: "neu-qtcl", khoaId: "neu-qtkd", maHocPhan: "QTCL1104", ten: "Quản trị chất lượng", soTinChi: 3 },
  { id: "neu-qtcl2", khoaId: "neu-qtkd", maHocPhan: "QTKD1114", ten: "Quản trị chiến lược 2", soTinChi: 3 },
  { id: "neu-qtvh", khoaId: "neu-qtkd", maHocPhan: "QTKD1149", ten: "Quản trị vận hành 2", soTinChi: 3 },
  { id: "neu-kskd", khoaId: "neu-qtkd", maHocPhan: "QTTH1108", ten: "Khởi sự kinh doanh", soTinChi: 3 },
  { id: "neu-qtcu", khoaId: "neu-qtkd", maHocPhan: "QTKD1133", ten: "Quản trị chuỗi cung ứng", soTinChi: 3 },
  { id: "neu-qtcp", khoaId: "neu-qtkd", maHocPhan: "QTTH1116", ten: "Quản trị chi phí kinh doanh", soTinChi: 3 },
];

// ---------- Tutor ----------

export const tutors: Tutor[] = [
  // Ca 1: GPA 3.85, đủ điều kiện dạy 3 môn
  {
    id: "t1",
    hoTen: "Nguyễn Minh Anh",
    anh: "MA",
    truongId: "ueb",
    khoaId: "ueb-ktpt",
    chuyenNganh: "Phân tích dữ liệu kinh tế và chính sách",
    namNhapHoc: 2022,
    trangThai: "Sinh viên năm 4",
    gpa: 3.85,
    daXacThucBangDiem: true,
    gioiThieu:
      "Mình thích biến những công thức khô khan thành ví dụ đời thường. Đã kèm nhóm ôn thi cho hơn 30 bạn khoá dưới, chủ yếu các môn định lượng.",
    thanhTich: [
      "Học bổng khuyến khích học tập 5 kỳ",
      "Giải Nhì nghiên cứu khoa học sinh viên cấp trường",
      "Sinh viên 5 tốt cấp trường",
    ],
    hoatDong: ["Trợ giảng môn định lượng 2 kỳ", "Ban chuyên môn CLB học thuật của khoa", "Kèm học nhóm nhỏ từ năm 2"],
    kyNangMem: ["Quản lý thời gian mùa thi", "Viết báo cáo nghiên cứu", "Sử dụng Stata cơ bản"],
  },
  // Ca 2: GPA 3.9 nhưng chỉ đủ điều kiện dạy 2 môn (môn thứ 3 điểm B+)
  {
    id: "t2",
    hoTen: "Trần Hoàng Phúc",
    anh: "HP",
    truongId: "ueb",
    khoaId: "ueb-ktpt",
    chuyenNganh: "Phân tích dữ liệu kinh tế và chính sách",
    namNhapHoc: 2022,
    trangThai: "Sinh viên năm 4",
    gpa: 3.9,
    daXacThucBangDiem: true,
    gioiThieu:
      "Thủ khoa đầu vào khoa, mạnh về toán và hồi quy. Phong cách dạy: ít slide, nhiều bài tập, chữa tới khi hiểu thì thôi.",
    thanhTich: [
      "Học bổng khuyến khích học tập 6 kỳ",
      "Giải Ba nghiên cứu khoa học sinh viên cấp ĐHQG",
      "Top 10 cuộc thi case study kinh tế",
    ],
    hoatDong: ["Trợ giảng môn Kinh tế lượng", "Mentor chương trình tân sinh viên", "Thực tập phân tích dữ liệu tại một công ty tư vấn"],
    kyNangMem: ["Thuyết trình", "Làm việc nhóm hiệu quả", "Đọc và tóm tắt bài báo khoa học"],
  },
  // Ca 4: cựu sinh viên
  {
    id: "t3",
    hoTen: "Lê Thu Hà",
    anh: "TH",
    truongId: "ueb",
    khoaId: "ueb-ktpt",
    chuyenNganh: "Kinh tế Tài nguyên Môi trường và Bất động sản",
    namNhapHoc: 2019,
    trangThai: "Cựu sinh viên",
    gpa: 3.72,
    daXacThucBangDiem: true,
    gioiThieu:
      "Tốt nghiệp loại Giỏi, hiện làm chuyên viên phân tích. Mình dạy theo hướng ứng dụng: học xong biết dùng vào khoá luận và công việc.",
    thanhTich: ["Tốt nghiệp loại Giỏi", "Học bổng khuyến khích học tập 4 kỳ", "Khoá luận tốt nghiệp đạt điểm A+"],
    hoatDong: ["Chuyên viên phân tích dữ liệu 2 năm", "Cựu phó chủ nhiệm CLB học thuật", "Kèm học 1-1 từ năm 3"],
    kyNangMem: ["Viết CV và phỏng vấn thực tập", "Định hướng chuyên ngành", "Excel cho phân tích"],
  },
  // Ca 3: GPA 3.5, có môn điểm A → KHÔNG hiện ở bất kỳ danh sách nào
  {
    id: "t4",
    hoTen: "Phạm Quang Huy",
    anh: "QH",
    truongId: "ueb",
    khoaId: "ueb-ktpt",
    chuyenNganh: "Kinh tế du lịch và dịch vụ",
    namNhapHoc: 2023,
    trangThai: "Sinh viên năm 3",
    gpa: 3.5,
    daXacThucBangDiem: true,
    gioiThieu: "Mình học tốt Toán cao cấp và muốn chia sẻ cách ôn thi hiệu quả.",
    thanhTich: ["Học bổng khuyến khích học tập 1 kỳ"],
    hoatDong: ["Thành viên CLB tiếng Anh"],
    kyNangMem: ["Ghi chép bằng sơ đồ tư duy"],
  },
  {
    id: "t5",
    hoTen: "Đỗ Khánh Linh",
    anh: "KL",
    truongId: "ueb",
    khoaId: "ueb-tcnh",
    chuyenNganh: "Tài chính – Ngân hàng",
    namNhapHoc: 2022,
    trangThai: "Sinh viên năm 4",
    gpa: 3.78,
    daXacThucBangDiem: true,
    gioiThieu:
      "Đam mê tài chính doanh nghiệp và mô hình định giá. Mình luôn chuẩn bị file bài tập riêng cho từng buổi.",
    thanhTich: ["Học bổng khuyến khích học tập 4 kỳ", "Top 5 cuộc thi phân tích tài chính cấp trường"],
    hoatDong: ["Trưởng ban học thuật CLB tài chính", "Thực tập tại một ngân hàng thương mại"],
    kyNangMem: ["Lập mô hình trên Excel", "Kỹ năng phỏng vấn ngân hàng"],
  },
  {
    id: "t6",
    hoTen: "Vũ Đức Thắng",
    anh: "ĐT",
    truongId: "neu",
    khoaId: "neu-tkt",
    chuyenNganh: "Toán kinh tế",
    namNhapHoc: 2018,
    trangThai: "Cựu sinh viên",
    gpa: 3.88,
    daXacThucBangDiem: true,
    gioiThieu:
      "Cựu sinh viên Toán kinh tế, đang học thạc sĩ. Mình giải thích bản chất trước, công thức sau, nên các bạn nhớ lâu hơn.",
    thanhTich: ["Tốt nghiệp loại Xuất sắc", "Giải Nhất nghiên cứu khoa học sinh viên cấp trường", "Học bổng khuyến khích học tập 7 kỳ"],
    hoatDong: ["Trợ giảng 3 năm", "Kèm ôn thi cao học", "Cộng tác viên dự án nghiên cứu"],
    kyNangMem: ["Định hướng học lên cao", "Sử dụng R và Stata", "Viết bài nghiên cứu"],
  },
  {
    id: "t7",
    hoTen: "Bùi Ngọc Mai",
    anh: "NM",
    truongId: "neu",
    khoaId: "neu-tkt",
    chuyenNganh: "Toán kinh tế",
    namNhapHoc: 2022,
    trangThai: "Sinh viên năm 4",
    gpa: 3.66,
    daXacThucBangDiem: true,
    gioiThieu: "Mình từng sợ môn định lượng nên hiểu cảm giác của các bạn. Học với mình nhẹ nhàng, chắc chắn từng bước.",
    thanhTich: ["Học bổng khuyến khích học tập 3 kỳ", "Giải Ba nghiên cứu khoa học sinh viên cấp trường"],
    hoatDong: ["Ban học tập Liên chi đoàn khoa", "Kèm nhóm ôn thi cuối kỳ"],
    kyNangMem: ["Phương pháp tự học", "Kỹ năng làm bài thi tự luận"],
  },
  {
    id: "t8",
    hoTen: "Hoàng Gia Bảo",
    anh: "GB",
    truongId: "neu",
    khoaId: "neu-tkt",
    chuyenNganh: "Toán kinh tế",
    namNhapHoc: 2023,
    trangThai: "Sinh viên năm 3",
    gpa: 3.62,
    daXacThucBangDiem: true,
    gioiThieu: "Mạnh về giải tích và xác suất. Mình có kho đề luyện tự soạn, phân theo mức độ.",
    thanhTich: ["Học bổng khuyến khích học tập 2 kỳ", "Giải Khuyến khích Olympic Toán sinh viên"],
    hoatDong: ["Thành viên CLB Toán kinh tế"],
    kyNangMem: ["Tư duy giải bài theo dạng"],
  },
  {
    id: "t9",
    hoTen: "Ngô Phương Thảo",
    anh: "PT",
    truongId: "neu",
    khoaId: "neu-ktkt",
    chuyenNganh: "Kế toán",
    namNhapHoc: 2022,
    trangThai: "Sinh viên năm 4",
    gpa: 3.81,
    daXacThucBangDiem: true,
    gioiThieu: "Định khoản là phải có hệ thống. Mình dạy bằng sơ đồ chữ T và bài tập tình huống thực tế.",
    thanhTich: ["Học bổng khuyến khích học tập 5 kỳ", "Top 10 cuộc thi kế toán – kiểm toán sinh viên"],
    hoatDong: ["Thực tập kiểm toán tại một công ty kiểm toán", "Trợ giảng Nguyên lý kế toán"],
    kyNangMem: ["Chuẩn bị hồ sơ thực tập Big4", "Excel cho kế toán"],
  },
  {
    id: "t10",
    hoTen: "Đặng Tuấn Kiệt",
    anh: "TK",
    truongId: "neu",
    khoaId: "neu-ktkt",
    chuyenNganh: "Kiểm toán",
    namNhapHoc: 2023,
    trangThai: "Sinh viên năm 3",
    gpa: 3.55,
    daXacThucBangDiem: true,
    gioiThieu: "Mình học chắc Kế toán tài chính, muốn chia sẻ tài liệu tự tổng hợp.",
    thanhTich: ["Học bổng khuyến khích học tập 1 kỳ"],
    hoatDong: ["Thành viên CLB Kế toán"],
    kyNangMem: ["Tổng hợp tài liệu"],
  },
  {
    id: "t11",
    hoTen: "Lương Bảo Ngọc",
    anh: "BN",
    truongId: "neu",
    khoaId: "neu-qtkd",
    chuyenNganh: "Quản trị kinh doanh tổng hợp",
    namNhapHoc: 2022,
    trangThai: "Sinh viên năm 4",
    gpa: 3.82,
    daXacThucBangDiem: true,
    gioiThieu:
      "Mình học quản trị bằng case: mỗi buổi phân tích một doanh nghiệp thật, rút ra khung lý thuyết rồi mới luyện đề.",
    thanhTich: ["Học bổng khuyến khích học tập 5 kỳ", "Top 10 cuộc thi case study quản trị cấp quốc gia"],
    hoatDong: ["Trưởng ban học thuật CLB Quản trị", "Thực tập vận hành tại một công ty logistics"],
    kyNangMem: ["Phân tích case", "Thuyết trình trước hội đồng", "Làm slide chuyên nghiệp"],
  },
  // Cựu sinh viên GPA cao nhưng Quản trị vận hành 2 chỉ đạt B+ → môn đó bị ẩn
  {
    id: "t12",
    hoTen: "Trịnh Quốc Việt",
    anh: "QV",
    truongId: "neu",
    khoaId: "neu-qtkd",
    chuyenNganh: "Quản trị kinh doanh",
    namNhapHoc: 2019,
    trangThai: "Cựu sinh viên",
    gpa: 3.75,
    daXacThucBangDiem: true,
    gioiThieu: "Đang làm chuyên viên chiến lược. Mình giúp các bạn nối lý thuyết chiến lược với cách doanh nghiệp thật ra quyết định.",
    thanhTich: ["Tốt nghiệp loại Giỏi", "Giải Nhì nghiên cứu khoa học sinh viên cấp trường"],
    hoatDong: ["Chuyên viên phòng chiến lược 2 năm", "Mentor cuộc thi khởi nghiệp sinh viên"],
    kyNangMem: ["Tư duy chiến lược", "Phỏng vấn management trainee"],
  },
  {
    id: "t13",
    hoTen: "Mai Anh Thư",
    anh: "AT",
    truongId: "neu",
    khoaId: "neu-qtkd",
    chuyenNganh: "Quản trị doanh nghiệp",
    namNhapHoc: 2023,
    trangThai: "Sinh viên năm 3",
    gpa: 3.68,
    daXacThucBangDiem: true,
    gioiThieu: "Từng tự mở một shop online từ năm 2, mình dạy Khởi sự kinh doanh bằng chính kinh nghiệm làm thật.",
    thanhTich: ["Học bổng khuyến khích học tập 3 kỳ", "Giải Ba cuộc thi ý tưởng khởi nghiệp cấp trường"],
    hoatDong: ["Tự vận hành một cửa hàng online", "Thành viên CLB Khởi nghiệp"],
    kyNangMem: ["Lập kế hoạch kinh doanh", "Gọi vốn cho dự án nhỏ"],
  },
];

// ---------- Tutor × Môn ----------
// Có cố ý vài dòng KHÔNG đủ điều kiện (điểm B+ hoặc GPA < 3.6) để chứng minh bộ lọc.

const ON_TAP = ["Giảng lại lý thuyết", "Chữa đề", "Ôn tập trọng tâm"];

export const tutorMons: TutorMon[] = [
  // t1 – ca 1: 3 môn đủ điều kiện
  { tutorId: "t1", monId: "ueb-ktl", diem: "A+", hocKy: "HK2 2023–2024", noiDungKem: [...ON_TAP, "Hướng dẫn Stata"], giaBaiGiang: 250000, giaCoach: 500000, giaLopChung: 100000, lichRanh: ["Tối thứ 3", "Tối thứ 5", "Sáng chủ nhật"] },
  { tutorId: "t1", monId: "ueb-tcc", diem: "A", hocKy: "HK1 2022–2023", noiDungKem: ON_TAP, giaBaiGiang: 200000, giaCoach: 400000, giaLopChung: 80000, lichRanh: ["Tối thứ 2", "Chiều thứ 7"] },
  { tutorId: "t1", monId: "ueb-vimo", diem: "A", hocKy: "HK1 2022–2023", noiDungKem: ["Giảng lại lý thuyết", "Chữa đề"], giaBaiGiang: 180000, giaCoach: 350000, giaLopChung: 70000, lichRanh: ["Tối thứ 4"] },

  // t2 – ca 2: GPA 3.9, 2 môn A/A+, môn thứ 3 B+ (bị loại)
  { tutorId: "t2", monId: "ueb-ktl", diem: "A+", hocKy: "HK2 2023–2024", noiDungKem: [...ON_TAP, "Hướng dẫn Eviews"], giaBaiGiang: 220000, giaCoach: 450000, giaLopChung: 90000, lichRanh: ["Tối thứ 2", "Tối thứ 6", "Chiều chủ nhật"] },
  { tutorId: "t2", monId: "ueb-tcc", diem: "A", hocKy: "HK1 2022–2023", noiDungKem: ["Giảng lại lý thuyết", "Chữa đề"], giaBaiGiang: 180000, giaCoach: 380000, giaLopChung: 75000, lichRanh: ["Tối thứ 4", "Sáng thứ 7"] },
  { tutorId: "t2", monId: "ueb-tcdn", diem: "B+", hocKy: "HK1 2024–2025", noiDungKem: ["Chữa đề"], giaBaiGiang: 150000, giaCoach: 300000, giaLopChung: 60000, lichRanh: ["Tối thứ 6"] },

  // t3 – cựu sinh viên
  { tutorId: "t3", monId: "ueb-ktl", diem: "A", hocKy: "HK2 2020–2021", noiDungKem: [...ON_TAP, "Ứng dụng vào khoá luận"], giaBaiGiang: 280000, giaCoach: 600000, giaLopChung: 120000, lichRanh: ["Tối thứ 7", "Sáng chủ nhật"] },
  { tutorId: "t3", monId: "ueb-tcc", diem: "A+", hocKy: "HK1 2019–2020", noiDungKem: ON_TAP, giaBaiGiang: 250000, giaCoach: 500000, giaLopChung: 100000, lichRanh: ["Chiều chủ nhật"] },

  // t4 – ca 3: GPA 3.5, môn điểm A nhưng KHÔNG đủ điều kiện
  { tutorId: "t4", monId: "ueb-tcc", diem: "A", hocKy: "HK1 2023–2024", noiDungKem: ["Chữa đề"], giaBaiGiang: 150000, giaCoach: 300000, giaLopChung: 60000, lichRanh: ["Tối thứ 3"] },

  // t5
  { tutorId: "t5", monId: "ueb-tcdn", diem: "A+", hocKy: "HK1 2024–2025", noiDungKem: [...ON_TAP, "Lập mô hình Excel"], giaBaiGiang: 300000, giaCoach: 550000, giaLopChung: 110000, lichRanh: ["Tối thứ 3", "Tối thứ 5"] },
  { tutorId: "t5", monId: "ueb-nlkt", diem: "A", hocKy: "HK2 2022–2023", noiDungKem: ON_TAP, giaBaiGiang: 200000, giaCoach: 400000, giaLopChung: 80000, lichRanh: ["Sáng thứ 7"] },
  { tutorId: "t5", monId: "ueb-tcc", diem: "A", hocKy: "HK1 2022–2023", noiDungKem: ["Chữa đề", "Ôn tập trọng tâm"], giaBaiGiang: 170000, giaCoach: 320000, giaLopChung: 65000, lichRanh: ["Tối chủ nhật"] },

  // t6 – cựu sinh viên NEU
  { tutorId: "t6", monId: "neu-ktl", diem: "A+", hocKy: "HK2 2019–2020", noiDungKem: [...ON_TAP, "Hướng dẫn R/Stata"], giaBaiGiang: 290000, giaCoach: 600000, giaLopChung: 120000, lichRanh: ["Tối thứ 2", "Tối thứ 4"] },
  { tutorId: "t6", monId: "neu-xstk", diem: "A", hocKy: "HK1 2019–2020", noiDungKem: ON_TAP, giaBaiGiang: 250000, giaCoach: 500000, giaLopChung: 100000, lichRanh: ["Sáng chủ nhật"] },
  { tutorId: "t6", monId: "neu-tcc", diem: "A", hocKy: "HK1 2018–2019", noiDungKem: ["Giảng lại lý thuyết", "Chữa đề"], giaBaiGiang: 230000, giaCoach: 450000, giaLopChung: 90000, lichRanh: ["Chiều thứ 7"] },

  // t7
  { tutorId: "t7", monId: "neu-ktl", diem: "A", hocKy: "HK2 2023–2024", noiDungKem: ON_TAP, giaBaiGiang: 180000, giaCoach: 350000, giaLopChung: 70000, lichRanh: ["Tối thứ 3", "Tối thứ 6"] },
  { tutorId: "t7", monId: "neu-tkkt", diem: "A+", hocKy: "HK1 2023–2024", noiDungKem: ["Giảng lại lý thuyết", "Ôn tập trọng tâm"], giaBaiGiang: 160000, giaCoach: 320000, giaLopChung: 65000, lichRanh: ["Sáng thứ 7"] },

  // t8 – Kinh tế lượng điểm B+ → không dạy được môn này
  { tutorId: "t8", monId: "neu-ktl", diem: "B+", hocKy: "HK2 2024–2025", noiDungKem: ["Chữa đề"], giaBaiGiang: 150000, giaCoach: 300000, giaLopChung: 60000, lichRanh: ["Tối thứ 5"] },
  { tutorId: "t8", monId: "neu-tcc", diem: "A+", hocKy: "HK1 2023–2024", noiDungKem: [...ON_TAP, "Luyện đề theo dạng"], giaBaiGiang: 170000, giaCoach: 330000, giaLopChung: 70000, lichRanh: ["Tối thứ 5", "Chiều chủ nhật"] },
  { tutorId: "t8", monId: "neu-xstk", diem: "A", hocKy: "HK2 2023–2024", noiDungKem: ["Chữa đề", "Ôn tập trọng tâm"], giaBaiGiang: 160000, giaCoach: 310000, giaLopChung: 65000, lichRanh: ["Tối thứ 2"] },

  // t9
  { tutorId: "t9", monId: "neu-nlkt", diem: "A+", hocKy: "HK2 2022–2023", noiDungKem: [...ON_TAP, "Bài tập tình huống"], giaBaiGiang: 220000, giaCoach: 420000, giaLopChung: 85000, lichRanh: ["Tối thứ 2", "Tối thứ 4"] },
  { tutorId: "t9", monId: "neu-kttc", diem: "A", hocKy: "HK1 2023–2024", noiDungKem: ON_TAP, giaBaiGiang: 260000, giaCoach: 500000, giaLopChung: 100000, lichRanh: ["Sáng chủ nhật"] },
  { tutorId: "t9", monId: "neu-tcdn", diem: "A", hocKy: "HK2 2023–2024", noiDungKem: ["Giảng lại lý thuyết", "Chữa đề"], giaBaiGiang: 240000, giaCoach: 460000, giaLopChung: 95000, lichRanh: ["Chiều thứ 7"] },

  // t10 – GPA 3.55 → không đủ điều kiện dù điểm A+
  { tutorId: "t10", monId: "neu-kttc", diem: "A+", hocKy: "HK1 2024–2025", noiDungKem: ["Ôn tập trọng tâm"], giaBaiGiang: 150000, giaCoach: 300000, giaLopChung: 60000, lichRanh: ["Tối thứ 7"] },

  // t11 – Khoa Quản trị kinh doanh NEU
  { tutorId: "t11", monId: "neu-qtcl", diem: "A+", hocKy: "HK1 2024–2025", noiDungKem: [...ON_TAP, "Phân tích case"], giaBaiGiang: 220000, giaCoach: 450000, giaLopChung: 90000, lichRanh: ["Tối thứ 3", "Tối thứ 5"] },
  { tutorId: "t11", monId: "neu-qtcu", diem: "A", hocKy: "HK2 2024–2025", noiDungKem: ON_TAP, giaBaiGiang: 200000, giaCoach: 400000, giaLopChung: 80000, lichRanh: ["Sáng thứ 7"] },
  { tutorId: "t11", monId: "neu-kskd", diem: "A", hocKy: "HK2 2023–2024", noiDungKem: ["Giảng lại lý thuyết", "Phân tích case"], giaBaiGiang: 180000, giaCoach: 380000, giaLopChung: 75000, lichRanh: ["Chiều chủ nhật"] },

  // t12 – cựu SV: Quản trị vận hành 2 điểm B+ → bị ẩn
  { tutorId: "t12", monId: "neu-qtcl2", diem: "A+", hocKy: "HK1 2021–2022", noiDungKem: [...ON_TAP, "Ứng dụng vào khoá luận"], giaBaiGiang: 280000, giaCoach: 580000, giaLopChung: 110000, lichRanh: ["Tối thứ 4", "Sáng chủ nhật"] },
  { tutorId: "t12", monId: "neu-qtcp", diem: "A", hocKy: "HK2 2021–2022", noiDungKem: ["Giảng lại lý thuyết", "Phân tích case"], giaBaiGiang: 250000, giaCoach: 520000, giaLopChung: 100000, lichRanh: ["Tối thứ 6"] },
  { tutorId: "t12", monId: "neu-qtvh", diem: "B+", hocKy: "HK2 2020–2021", noiDungKem: ["Chữa đề"], giaBaiGiang: 200000, giaCoach: 400000, giaLopChung: 80000, lichRanh: ["Tối thứ 6"] },

  // t13
  { tutorId: "t13", monId: "neu-kskd", diem: "A+", hocKy: "HK2 2024–2025", noiDungKem: [...ON_TAP, "Lập kế hoạch kinh doanh"], giaBaiGiang: 170000, giaCoach: 350000, giaLopChung: 70000, lichRanh: ["Tối thứ 2", "Chiều thứ 7"] },
  { tutorId: "t13", monId: "neu-qtvh", diem: "A", hocKy: "HK1 2025–2026", noiDungKem: ["Giảng lại lý thuyết", "Chữa đề"], giaBaiGiang: 160000, giaCoach: 320000, giaLopChung: 65000, lichRanh: ["Tối thứ 4"] },
];

// ---------- Đánh giá (theo từng môn) ----------

export const danhGias: DanhGia[] = [
  // t1
  { tutorId: "t1", monId: "ueb-ktl", soSao: 5, nhanXet: "Chị giải thích hồi quy bằng ví dụ giá nhà dễ hiểu cực. Thi cuối kỳ được A.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t1", monId: "ueb-ktl", soSao: 5, nhanXet: "Phần kiểm định giả thuyết trước mình mù mờ, học 2 buổi là thông.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t1", monId: "ueb-ktl", soSao: 4, nhanXet: "Nhiệt tình, trả lời tin nhắn nhanh. Mong có thêm đề luyện.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t1", monId: "ueb-tcc", soSao: 5, nhanXet: "Phần ma trận chị dạy có mẹo nhớ rất hay.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t1", monId: "ueb-tcc", soSao: 4, nhanXet: "Dạy chắc, hơi nhanh ở phần tích phân nhưng hỏi lại là chị giảng tiếp.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t1", monId: "ueb-vimo", soSao: 5, nhanXet: "Vẽ đồ thị cung cầu siêu rõ, không còn sợ bài tập nữa.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t1", monId: "ueb-vimo", soSao: 4, nhanXet: "Ổn áp, giá hợp lý.", nguoiDanhGia: "Sinh viên năm 2" },

  // t2
  { tutorId: "t2", monId: "ueb-ktl", soSao: 5, nhanXet: "Anh chữa đề kỹ từng câu, chỉ ra luôn lỗi hay mất điểm.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t2", monId: "ueb-ktl", soSao: 5, nhanXet: "Buổi 1-1 90 phút rất đáng tiền, hỏi gì cũng được.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t2", monId: "ueb-ktl", soSao: 4, nhanXet: "Bài giảng chất lượng, mong anh quay thêm phần đa cộng tuyến.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t2", monId: "ueb-ktl", soSao: 5, nhanXet: "Nhờ anh mà mình đọc được bảng kết quả Eviews.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t2", monId: "ueb-tcc", soSao: 4, nhanXet: "Dạy dễ hiểu, bài tập nhiều.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t2", monId: "ueb-tcc", soSao: 5, nhanXet: "Học lớp chung vui, anh hay cho bài thử thách.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t2", monId: "ueb-tcc", soSao: 3, nhanXet: "Nội dung tốt nhưng lịch hơi khó xếp.", nguoiDanhGia: "Sinh viên năm 1" },

  // t3
  { tutorId: "t3", monId: "ueb-ktl", soSao: 5, nhanXet: "Chị chỉ cách áp dụng Kinh tế lượng vào khoá luận, quá hữu ích.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t3", monId: "ueb-ktl", soSao: 5, nhanXet: "Kinh nghiệm đi làm thực tế nên ví dụ rất sát.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t3", monId: "ueb-ktl", soSao: 4, nhanXet: "Giá hơi cao nhưng xứng đáng.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t3", monId: "ueb-tcc", soSao: 5, nhanXet: "Chị dạy chậm rãi, ai mất gốc cũng theo được.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t3", monId: "ueb-tcc", soSao: 5, nhanXet: "Ôn trọng tâm đúng phần thi.", nguoiDanhGia: "Sinh viên năm 1" },

  // t5
  { tutorId: "t5", monId: "ueb-tcdn", soSao: 5, nhanXet: "Chị làm mẫu mô hình dòng tiền trên Excel rất trực quan.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t5", monId: "ueb-tcdn", soSao: 4, nhanXet: "Nội dung chắc, bài tập sát đề.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t5", monId: "ueb-nlkt", soSao: 4, nhanXet: "Định khoản được giải thích logic, dễ nhớ.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t5", monId: "ueb-nlkt", soSao: 5, nhanXet: "Chị tận tâm, gửi thêm tài liệu tự soạn.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t5", monId: "ueb-tcc", soSao: 4, nhanXet: "Học ổn, giá mềm.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t5", monId: "ueb-tcc", soSao: 3, nhanXet: "Tạm ổn, phần đạo hàm cần luyện thêm.", nguoiDanhGia: "Sinh viên năm 1" },

  // t6
  { tutorId: "t6", monId: "neu-ktl", soSao: 5, nhanXet: "Anh giảng bản chất OLS rõ ràng nhất mình từng nghe.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t6", monId: "neu-ktl", soSao: 5, nhanXet: "Chuẩn bị kỹ, có file thực hành R đi kèm.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t6", monId: "neu-ktl", soSao: 4, nhanXet: "Hơi học thuật nhưng hiểu sâu.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t6", monId: "neu-xstk", soSao: 5, nhanXet: "Phân phối xác suất được giải thích bằng ví dụ rất đời.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t6", monId: "neu-xstk", soSao: 4, nhanXet: "Giảng hay, bài tập vừa sức.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t6", monId: "neu-tcc", soSao: 4, nhanXet: "Anh dạy chắc, nhưng lịch ít.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t6", monId: "neu-tcc", soSao: 5, nhanXet: "Qua môn với điểm A, cảm ơn anh!", nguoiDanhGia: "Sinh viên năm 1" },

  // t7
  { tutorId: "t7", monId: "neu-ktl", soSao: 5, nhanXet: "Chị kiên nhẫn lắm, mình hỏi đi hỏi lại vẫn giảng.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t7", monId: "neu-ktl", soSao: 4, nhanXet: "Giá sinh viên, chất lượng tốt.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t7", monId: "neu-ktl", soSao: 3, nhanXet: "Ổn nhưng muốn có thêm bài giảng quay sẵn.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t7", monId: "neu-tkkt", soSao: 5, nhanXet: "Tóm tắt công thức 1 trang giấy, cực tiện ôn thi.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t7", monId: "neu-tkkt", soSao: 4, nhanXet: "Dễ hiểu, thân thiện.", nguoiDanhGia: "Sinh viên năm 2" },

  // t8
  { tutorId: "t8", monId: "neu-tcc", soSao: 5, nhanXet: "Kho đề phân theo mức độ rất hữu ích.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t8", monId: "neu-tcc", soSao: 4, nhanXet: "Giải bài nhanh, gọn.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t8", monId: "neu-xstk", soSao: 4, nhanXet: "Chữa đề kỹ.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t8", monId: "neu-xstk", soSao: 4, nhanXet: "Học xong tự tin làm bài hơn nhiều.", nguoiDanhGia: "Sinh viên năm 1" },

  // t9
  { tutorId: "t9", monId: "neu-nlkt", soSao: 5, nhanXet: "Sơ đồ chữ T của chị là chân ái.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t9", monId: "neu-nlkt", soSao: 5, nhanXet: "Bài tập tình huống sát thực tế.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t9", monId: "neu-nlkt", soSao: 4, nhanXet: "Tốt, nên mở thêm lớp chung.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t9", monId: "neu-kttc", soSao: 5, nhanXet: "Phần báo cáo tài chính được hệ thống lại rất gọn.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t9", monId: "neu-kttc", soSao: 4, nhanXet: "Nhiệt tình, đúng giờ.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t9", monId: "neu-tcdn", soSao: 4, nhanXet: "Giải thích NPV, IRR dễ hiểu.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t9", monId: "neu-tcdn", soSao: 5, nhanXet: "Học 1-1 rất hiệu quả.", nguoiDanhGia: "Sinh viên năm 3" },

  // t11
  { tutorId: "t11", monId: "neu-qtcl", soSao: 5, nhanXet: "Chị phân tích case Toyota rồi mới vào lý thuyết, nhớ lâu hẳn.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t11", monId: "neu-qtcl", soSao: 5, nhanXet: "Các công cụ kiểm soát chất lượng được chị tóm gọn trong 1 trang.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t11", monId: "neu-qtcl", soSao: 4, nhanXet: "Nhiều case hay, lịch hơi kín.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t11", monId: "neu-qtcu", soSao: 5, nhanXet: "Hiểu được hiệu ứng Bullwhip nhờ trò chơi mô phỏng của chị.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t11", monId: "neu-qtcu", soSao: 4, nhanXet: "Dễ hiểu, bài tập vừa sức.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t11", monId: "neu-kskd", soSao: 4, nhanXet: "Chị góp ý kế hoạch kinh doanh của nhóm rất kỹ.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t11", monId: "neu-kskd", soSao: 5, nhanXet: "Bài thuyết trình cuối kỳ nhóm mình được điểm cao.", nguoiDanhGia: "Sinh viên năm 2" },

  // t12
  { tutorId: "t12", monId: "neu-qtcl2", soSao: 5, nhanXet: "Anh đi làm chiến lược thật nên ví dụ rất sát.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t12", monId: "neu-qtcl2", soSao: 5, nhanXet: "Ma trận SWOT, BCG giờ mình dùng được thật chứ không chỉ học thuộc.", nguoiDanhGia: "Sinh viên năm 4" },
  { tutorId: "t12", monId: "neu-qtcl2", soSao: 4, nhanXet: "Giá hơi cao nhưng đáng.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t12", monId: "neu-qtcp", soSao: 4, nhanXet: "Phần phân loại và phân bổ chi phí được giải thích rõ ràng.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t12", monId: "neu-qtcp", soSao: 5, nhanXet: "Anh chữa đề rất có tâm.", nguoiDanhGia: "Sinh viên năm 3" },

  // t13
  { tutorId: "t13", monId: "neu-kskd", soSao: 5, nhanXet: "Chị chia sẻ kinh nghiệm mở shop thật, cực kỳ thực tế.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t13", monId: "neu-kskd", soSao: 5, nhanXet: "Template kế hoạch kinh doanh của chị dùng được luôn.", nguoiDanhGia: "Sinh viên năm 2" },
  { tutorId: "t13", monId: "neu-kskd", soSao: 4, nhanXet: "Vui, dễ gần.", nguoiDanhGia: "Sinh viên năm 1" },
  { tutorId: "t13", monId: "neu-qtvh", soSao: 4, nhanXet: "Bài toán hàng tồn kho được giải từng bước.", nguoiDanhGia: "Sinh viên năm 3" },
  { tutorId: "t13", monId: "neu-qtvh", soSao: 3, nhanXet: "Ổn, nhưng mong có thêm đề luyện.", nguoiDanhGia: "Sinh viên năm 3" },
];

// ---------- Bài giảng ----------
// Tên chương để chung chung – nhóm sửa trực tiếp trong danh sách bên dưới.
// id bài giảng có dạng: "<tutorId>-<monId>-c<số chương>", vd "t2-ueb-ktl-c1".
// Link video dán ở src/data/videoConfig.ts theo id này.

function taoChuong(tutorId: string, monId: string, thoiLuong: string[]): BaiGiang[] {
  return thoiLuong.map((tl, i) => ({
    id: `${tutorId}-${monId}-c${i + 1}`,
    tutorId,
    monId,
    chuongSo: i + 1,
    tieuDe: `Bài giảng chương ${i + 1}`,
    moTa: "Mô tả chương – nhóm sẽ bổ sung.",
    thoiLuong: tl,
    videoUrl: null,
    xemThu: i === 0, // chương 1 cho xem thử
    trangThai: "Đã đăng",
  }));
}

export const baiGiangs: BaiGiang[] = [
  ...taoChuong("t1", "ueb-ktl", ["14:20", "18:05", "21:40", "16:30", "19:10", "22:00"]),
  ...taoChuong("t1", "ueb-tcc", ["12:30", "17:45", "20:10", "15:55", "18:20"]),
  ...taoChuong("t1", "ueb-vimo", ["13:10", "16:40", "18:30", "15:00"]),
  ...taoChuong("t2", "ueb-ktl", ["15:00", "19:30", "22:15", "17:40", "20:05"]),
  ...taoChuong("t2", "ueb-tcc", ["11:45", "16:20", "18:50", "14:30"]),
  ...taoChuong("t3", "ueb-ktl", ["16:10", "20:00", "23:30", "18:45", "21:15", "19:40"]),
  ...taoChuong("t3", "ueb-tcc", ["13:00", "17:15", "19:45", "16:05", "18:30"]),
  ...taoChuong("t5", "ueb-tcdn", ["15:30", "18:40", "21:20", "17:10", "20:45"]),
  ...taoChuong("t5", "ueb-nlkt", ["12:15", "15:50", "17:30", "14:40"]),
  ...taoChuong("t5", "ueb-tcc", ["11:30", "15:10", "17:20", "13:50"]),
  ...taoChuong("t6", "neu-ktl", ["17:00", "21:30", "24:10", "19:20", "22:40", "20:15"]),
  ...taoChuong("t6", "neu-xstk", ["14:50", "18:25", "20:40", "16:15", "19:00"]),
  ...taoChuong("t6", "neu-tcc", ["13:40", "17:05", "19:30", "15:45"]),
  ...taoChuong("t7", "neu-ktl", ["13:20", "16:50", "19:10", "15:30"]),
  ...taoChuong("t7", "neu-tkkt", ["12:40", "15:20", "17:55", "14:10", "16:35"]),
  ...taoChuong("t8", "neu-tcc", ["12:00", "16:30", "18:15", "14:45", "17:20"]),
  ...taoChuong("t8", "neu-xstk", ["13:15", "17:40", "19:25", "15:05"]),
  ...taoChuong("t9", "neu-nlkt", ["14:00", "17:30", "20:20", "16:10", "18:55", "15:40"]),
  ...taoChuong("t9", "neu-kttc", ["16:30", "20:15", "22:50", "18:05", "21:30"]),
  ...taoChuong("t9", "neu-tcdn", ["15:15", "19:00", "21:10", "17:25"]),
  ...taoChuong("t11", "neu-qtcl", ["14:30", "18:10", "20:45", "16:20", "19:05"]),
  ...taoChuong("t11", "neu-qtcu", ["15:40", "19:20", "17:50", "21:05"]),
  ...taoChuong("t11", "neu-kskd", ["12:50", "16:15", "18:40", "14:25"]),
  ...taoChuong("t12", "neu-qtcl2", ["17:30", "22:10", "19:45", "24:00", "20:30", "18:15"]),
  ...taoChuong("t12", "neu-qtcp", ["16:00", "19:35", "21:50", "17:15"]),
  ...taoChuong("t13", "neu-kskd", ["13:45", "17:20", "15:55", "19:10", "16:40"]),
  ...taoChuong("t13", "neu-qtvh", ["14:05", "18:30", "16:50", "20:15"]),
];

// ---------- Buổi ôn thi (meeting) sắp tới ----------
// Hiện ở khu "Lịch ôn thi sắp tới" trên trang chủ. Giá lấy theo giá lớp chung của tutor–môn.
// Buổi của tutor không đủ điều kiện dạy môn đó sẽ tự bị ẩn (đi qua duDieuKienDay).

export type BuoiOnThi = {
  id: string;
  tutorId: string;
  monId: string;
  tieuDe: string;
  batDau: string; // "YYYY-MM-DDTHH:mm" giờ Việt Nam
  thoiLuongPhut: number;
  hinhThuc: string; // "Online – Google Meet", "Trực tiếp – …"
  soCho: number;
  daDangKy: number;
};

export const buoiOnThis: BuoiOnThi[] = [
  { id: "b1", tutorId: "t2", monId: "ueb-ktl", tieuDe: "Ôn thi giữa kỳ Kinh tế lượng", batDau: "2026-09-29T19:30", thoiLuongPhut: 90, hinhThuc: "Online – Google Meet", soCho: 30, daDangKy: 22 },
  { id: "b2", tutorId: "t3", monId: "ueb-tcc", tieuDe: "Chữa đề cuối kỳ Toán cao cấp", batDau: "2026-09-30T20:00", thoiLuongPhut: 120, hinhThuc: "Online – Google Meet", soCho: 25, daDangKy: 18 },
  { id: "b3", tutorId: "t1", monId: "ueb-ktl", tieuDe: "Thực hành Stata cho người mới", batDau: "2026-10-01T19:00", thoiLuongPhut: 90, hinhThuc: "Trực tiếp – phòng tự học thư viện", soCho: 20, daDangKy: 20 },
  { id: "b4", tutorId: "t6", monId: "neu-ktl", tieuDe: "Tổng ôn Kinh tế lượng trước thi", batDau: "2026-10-02T20:00", thoiLuongPhut: 120, hinhThuc: "Online – Zoom", soCho: 40, daDangKy: 31 },
  { id: "b5", tutorId: "t2", monId: "ueb-tcc", tieuDe: "Luyện đề Toán cao cấp theo dạng", batDau: "2026-10-03T09:00", thoiLuongPhut: 90, hinhThuc: "Online – Google Meet", soCho: 30, daDangKy: 12 },
  { id: "b6", tutorId: "t5", monId: "ueb-tcdn", tieuDe: "Ôn tập Tài chính doanh nghiệp", batDau: "2026-10-04T14:00", thoiLuongPhut: 90, hinhThuc: "Online – Google Meet", soCho: 25, daDangKy: 9 },
  { id: "b7", tutorId: "t9", monId: "neu-nlkt", tieuDe: "Chữa đề Nguyên lý kế toán", batDau: "2026-10-05T19:30", thoiLuongPhut: 90, hinhThuc: "Online – Zoom", soCho: 35, daDangKy: 27 },
  { id: "b8", tutorId: "t1", monId: "ueb-tcc", tieuDe: "Ôn trọng tâm Toán cao cấp", batDau: "2026-10-07T19:00", thoiLuongPhut: 90, hinhThuc: "Online – Google Meet", soCho: 30, daDangKy: 6 },
  // Cố ý: tutor GPA 3.5 → buổi này KHÔNG được hiện
  { id: "b10", tutorId: "t11", monId: "neu-qtcl", tieuDe: "Chữa đề cuối kỳ Quản trị chất lượng", batDau: "2026-10-01T20:30", thoiLuongPhut: 90, hinhThuc: "Online – Zoom", soCho: 35, daDangKy: 19 },
  { id: "b11", tutorId: "t13", monId: "neu-kskd", tieuDe: "Workshop viết kế hoạch khởi sự kinh doanh", batDau: "2026-10-04T09:00", thoiLuongPhut: 120, hinhThuc: "Trực tiếp – phòng học nhóm NEU", soCho: 25, daDangKy: 23 },
  { id: "b12", tutorId: "t12", monId: "neu-qtcl2", tieuDe: "Ôn thi Quản trị chiến lược 2 qua case", batDau: "2026-10-06T20:00", thoiLuongPhut: 90, hinhThuc: "Online – Google Meet", soCho: 30, daDangKy: 14 },
  // Cố ý: t12 điểm B+ môn này → buổi này KHÔNG được hiện
  { id: "b13", tutorId: "t12", monId: "neu-qtvh", tieuDe: "Ôn tập Quản trị vận hành 2", batDau: "2026-10-08T19:30", thoiLuongPhut: 90, hinhThuc: "Online – Google Meet", soCho: 30, daDangKy: 5 },
  { id: "b9", tutorId: "t4", monId: "ueb-tcc", tieuDe: "Ôn thi Toán cao cấp", batDau: "2026-10-06T19:00", thoiLuongPhut: 60, hinhThuc: "Online – Google Meet", soCho: 20, daDangKy: 2 },
];

// ---------- Môn người học đang tham gia ----------
// Hiện ở mục "Các môn học của bạn" trên thanh chức năng bên trái (người học giả định, chưa có đăng nhập).

export const monDangHoc: { monId: string; tutorId: string }[] = [
  { monId: "ueb-ktl", tutorId: "t2" },
  { monId: "ueb-tcc", tutorId: "t3" },
];

// ---------- Lịch cá nhân của người học (trang "Lịch của tôi") ----------

/** Buổi ôn thi người học đã đăng ký sẵn (id trong buoiOnThis). */
export const buoiDaDangKyMacDinh: string[] = ["b1", "b2"];

export type SuKienCaNhan = {
  id: string;
  tieuDe: string;
  batDau: string; // "YYYY-MM-DDTHH:mm"
  ketThuc: string;
  loai: "ca-nhan" | "thi"; // lịch cá nhân | lịch thi & hạn nộp
  ghiChu?: string;
};

export const suKienCaNhanMacDinh: SuKienCaNhan[] = [
  { id: "sk1", tieuDe: "Học nhóm Kinh tế lượng", batDau: "2026-09-30T14:00", ketThuc: "2026-09-30T16:00", loai: "ca-nhan", ghiChu: "Thư viện tầng 3" },
  { id: "sk2", tieuDe: "Nộp bài tập lớn Toán cao cấp", batDau: "2026-10-02T23:00", ketThuc: "2026-10-02T23:30", loai: "thi" },
  { id: "sk3", tieuDe: "Tự ôn chương 3–4 Kinh tế lượng", batDau: "2026-10-03T19:30", ketThuc: "2026-10-03T21:30", loai: "ca-nhan" },
  { id: "sk4", tieuDe: "Thi giữa kỳ Kinh tế lượng", batDau: "2026-10-09T08:00", ketThuc: "2026-10-09T09:30", loai: "thi", ghiChu: "Phòng 301 – nhà E4" },
  { id: "sk5", tieuDe: "Thi giữa kỳ Toán cao cấp", batDau: "2026-10-12T13:30", ketThuc: "2026-10-12T15:00", loai: "thi" },
];
