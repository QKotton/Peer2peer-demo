# Peer2Peer – bản demo

Demo cho cuộc thi **Khởi nghiệp Sáng tạo ĐHQGHN – RND to Startup 2026** (Bảng Ý tưởng).
Web tĩnh (React + Vite + TypeScript + Tailwind), không backend, không đăng nhập. Mọi dữ liệu là dữ liệu minh hoạ.

## Chạy thử

Cần Node.js ≥ 20.

```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # build ra thư mục dist/
npm run check    # kiểm tra nhanh các ca của quy tắc duDieuKienDay
```

## Kịch bản demo (~90 giây)

0. Trang chủ kiểu YouTube: lưới video bài giảng (chip lọc theo môn, "Xem thêm"), bên dưới là **Lịch ôn thi sắp tới** với nút "Đăng ký tham gia".
1. Bấm **"Lọc tutor"** trên thanh chức năng bên trái (hoặc ô tìm trên header) → panel lọc trượt ra → **UEB → Khoa Kinh tế Phát triển → Kinh tế lượng** → "Tìm tutor" (hoặc gõ "kinh te luong" ở ô tìm nhanh).
2. Có 3 tutor; mỗi thẻ có điểm môn, huy hiệu xác thực, số sao riêng của môn.
3. Mở hồ sơ **Trần Hoàng Phúc** (GPA 3.90) → tab Kinh tế lượng → 3 gói + chương bài giảng + đánh giá riêng của môn → bấm "Xem thử" chương 1.
4. Ở phần "Các môn nhận dạy" chỉ có **2 môn**: môn Tài chính doanh nghiệp (điểm B+) bị ẩn dù GPA 3.90.
5. Bật **"Tôi là tutor"** → tab **Bài giảng** → môn Kinh tế lượng → "Thêm chương" → chọn video → xem trước → tích cam kết → Đăng.
6. Chuyển về **"Người học"** → chương mới nằm đầu lưới video trang chủ (nhãn "MỚI") và có trong hồ sơ Trần Hoàng Phúc → tab Kinh tế lượng.
7. Tìm **UEB → KTPT → Toán cao cấp**: Phạm Quang Huy (GPA 3.5, điểm A môn này) **không** xuất hiện – kể cả buổi ôn thi của bạn này trong lịch cũng bị ẩn.

Kịch bản gốc trong spec (NEU → Khoa Toán kinh tế → Kinh tế lượng) vẫn chạy: có 2 tutor, tutor điểm B+ bị lọc.

### Giao diện học sinh – trang "Tutor"

- Mục **Tutor** trên thanh bên trái: danh bạ profile chung của mọi tutor đủ điều kiện (GPA, huy hiệu, giới thiệu, thành tích, các môn dạy kèm điểm).
- Hàng chip **lọc theo môn học** (vd "Toán cao cấp · UEB") + ô tìm theo tên. Bấm "Xem hồ sơ" để mở hồ sơ đầy đủ.

### Lịch của tôi (cá nhân hoá, kiểu Google Calendar)

- Mục **Lịch của tôi** trên thanh bên trái. Xem theo **Ngày / Tuần / Tháng**, nút "Hôm nay", ‹ ›, lịch tháng thu nhỏ, danh sách "Sắp tới"; vạch đỏ là giờ hiện tại.
- 4 lớp lịch bật/tắt được: **buổi ôn thi đã đăng ký** (xanh), **gợi ý** – các buổi ôn thi của môn bạn đang học mà chưa đăng ký (viền nét đứt), **lịch cá nhân** (xanh lá), **lịch thi & hạn nộp** (đỏ).
- Bấm ô trống để tạo sự kiện; bấm sự kiện để xem chi tiết, đăng ký / huỷ đăng ký buổi ôn thi hoặc xoá sự kiện.
- Nút **"Đăng ký tham gia"** ở khu lịch ôn thi trang chủ giờ đăng ký thật: buổi học tự vào Lịch của tôi, số chỗ giảm 1.
- Ở chế độ **Tôi là tutor**, mục này đổi thành **Lịch dạy**: chỉ hiện lớp ôn thi tutor tổ chức (kèm số học viên đã đăng ký) và các buổi **coach 1-1**; không có lịch cá nhân, gợi ý hay nút tạo sự kiện. Dữ liệu coach: `buoiCoachs` trong `mockData.ts`.
- Dữ liệu mẫu: `buoiDaDangKyMacDinh` và `suKienCaNhanMacDinh` ở cuối `mockData.ts` (sự kiện rơi vào 28/9 – 12/10/2026).

### Kho tài liệu

- Mục **Kho tài liệu** trên thanh bên trái: tóm tắt lý thuyết, đề cương, bài tập có lời giải, đề luyện do tutor tự soạn.
- Lọc theo **Trường** (chip, có đếm số tài liệu) → Khoa → Môn, theo loại tài liệu, tìm theo từ khoá (không cần gõ dấu), sắp xếp mới nhất / xem nhiều. Bộ lọc nằm trên URL nên gửi link được, vd `#/tai-lieu?truong=ueb`.
- Bấm thẻ để mở trình xem: tài liệu mẫu hiện trang minh hoạ; tài liệu tutor upload xem trực tiếp (PDF, ảnh); tài liệu "Trong gói" bị khoá.
- Hồ sơ tutor có thêm mục **Tài liệu môn này** trong từng tab môn.
- Tutor đăng tài liệu ở tab **Tài liệu** (chỉ các môn đủ điều kiện, bắt buộc tích cam kết tự soạn). Tài liệu của tutor không đủ điều kiện tự bị ẩn.
- Dữ liệu mẫu: `taiLieus` ở cuối `mockData.ts`.

#### Tự đưa file tài liệu mẫu lên

1. Đặt file vào `public/tai-lieu/` (tên không dấu, không khoảng trắng, vd `tom-tat-kinh-te-luong.pdf`).
2. Mở `src/data/taiLieuConfig.ts`, thêm dòng `tl1: "tom-tat-kinh-te-luong.pdf",` (id `tl1`, `tl2`… xem trong `taiLieus`).
3. Push lên GitHub – web tự cập nhật sau 1–2 phút. Định dạng tự nhận theo đuôi file; PDF và ảnh xem trước được, Word/PowerPoint thì tải xuống.

Làm trên giao diện GitHub: vào thư mục `public/tai-lieu` → **Add file → Upload files**, sau đó mở `src/data/taiLieuConfig.ts` → biểu tượng bút chì để sửa → **Commit changes**.

### Giao diện tutor – 5 tab (bật "Tôi là tutor")

| Tab | Làm được gì |
| --- | --- |
| **Thông tin chung** | Sửa họ tên, chuyên ngành, năm nhập học, trạng thái, GPA, giới thiệu, thành tích / hoạt động / kỹ năng mềm. Hạ GPA xuống < 3.6 → mọi môn tự ẩn khỏi người học. |
| **Môn dạy** | Danh sách môn đã đăng ký (kèm trạng thái "Đang hiển thị" / "Không đủ điều kiện · đang ẩn"). Form **Đăng ký môn mới**: chọn khoa, môn, điểm, lịch rảnh, 3 mức giá; kiểm tra điều kiện ngay khi chọn điểm – B+ thì nút đăng ký bị khoá. |
| **Minh chứng** | Upload **bảng điểm** (bắt buộc), **thẻ sinh viên / bằng tốt nghiệp**, và minh chứng cho **từng thành tích** (ảnh hoặc PDF ≤ 10 MB). Có xem trước, trạng thái "Đang xác thực…" → "Đã xác thực" (mô phỏng 2,5 giây). Minh chứng đã xác thực hiện ở hồ sơ công khai. |
| **Bài giảng** | Thêm chương video cho các môn đủ điều kiện (như bước 5). |
| **Tài liệu** | Đăng PDF / Word / PowerPoint / ảnh lên Kho tài liệu, chọn môn, loại, quyền xem (miễn phí hoặc trong gói). |

Kịch bản gợi ý: tab Môn dạy → đăng ký "Nguyên lý kế toán" điểm B+ (bị chặn) → đổi sang A (đăng ký được) → chuyển "Người học" → mục Tutor → chip "Nguyên lý kế toán · UEB" → thấy tutor vừa đăng ký.

Mọi thay đổi ở chế độ tutor chỉ lưu trong bộ nhớ trình duyệt, **tải lại trang là về dữ liệu mẫu**.

## Sửa dữ liệu – `src/data/mockData.ts`

Toàn bộ dữ liệu nằm trong một file, chia theo khối: `truongs`, `khoas`, `monHocs`, `tutors`, `tutorMons`, `danhGias`, `baiGiangs`.

- **Thêm môn:** thêm một dòng vào `monHocs` với `khoaId` của khoa tương ứng.
- **Thêm tutor:** thêm vào `tutors`, rồi thêm các dòng `tutorMons` (điểm, giá, lịch rảnh) cho từng môn.
  Tutor chỉ hiện ở một môn khi `gpa >= 3.6` **và** điểm môn đó là `A`/`A+` (hàm `duDieuKienDay` trong `src/lib/rules.ts`) – không cần tự lọc tay.
- **Buổi ôn thi:** thêm vào `buoiOnThis` (thời gian dạng `"2026-10-01T19:00"`). Buổi của tutor không đủ điều kiện môn đó tự bị ẩn.
- **Đánh giá:** thêm vào `danhGias`, luôn kèm `monId` (đánh giá tính riêng theo môn).
- **Chương bài giảng:** mỗi dòng `taoChuong("t2", "ueb-ktl", ["15:00", "19:30", …])` sinh ra các chương với thời lượng tương ứng.
  Muốn đặt tên chương thật, thay dòng đó bằng mảng các object `BaiGiang` viết tay (xem kiểu ở đầu file).
- Avatar là chữ cái trong trường `anh` – không dùng ảnh người thật.

## Dán link YouTube – `src/data/videoConfig.ts`

Upload video lên YouTube ở chế độ **Không công khai**, rồi thêm vào object theo id bài giảng:

```ts
export const videoConfig: Record<string, string> = {
  "t2-ueb-ktl-c1": "https://youtu.be/XXXXXXXXXXX",
};
```

id bài giảng có dạng `<tutorId>-<monId>-c<số chương>`. Chương chưa có link sẽ hiện khung "Video mẫu – nhóm sẽ bổ sung".
Chỉ chương có `xemThu: true` (mặc định là chương 1) mới bấm xem được ở chế độ người học.

## Deploy lên GitHub Pages (đã cấu hình sẵn)

`vite.config.ts` dùng `base: "./"` + `HashRouter`, nên chạy được với **bất kỳ tên repo nào**, không cần sửa gì.

1. Tạo repo trên GitHub, rồi trong thư mục project:
   ```bash
   git init
   git add .
   git commit -m "Peer2Peer demo"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan>/<ten-repo>.git
   git push -u origin main
   ```
2. Trên GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` tự build và deploy mỗi lần push lên `main` (xem tab **Actions**).
   Link có dạng `https://<tai-khoan>.github.io/<ten-repo>/`.

**Vercel (cách khác):** Import repo trên vercel.com, Framework chọn *Vite*, giữ mặc định (`npm run build`, thư mục `dist`).

## Giả định

- **Phạm vi:** giữ đủ 2 trường × 2 khoa như spec. Riêng **Khoa Kinh tế Phát triển – UEB** chỉ có 2 môn theo yêu cầu: *Kinh tế lượng* và *Toán cao cấp*, là 2 môn trọng tâm của demo. Kịch bản demo chính chuyển sang UEB.
- **Mã học phần:** 2 môn của KTPT–UEB dùng mã và số tín chỉ thật lấy từ CTĐT ngành Kinh tế Phát triển (mã ngành 7310105, ban hành kèm QĐ 4327/QĐ-ĐHKT ngày 28/12/2021): **INE1052 – Kinh tế lượng – 3 TC**, **FDE1092 – Toán cao cấp – 4 TC**. Các môn khác dùng `DEMO-xxx`.
- **Tutor ca 2 (GPA 3.9, bị loại 1 môn)** thuộc UEB. Môn bị loại là Tài chính doanh nghiệp (Khoa TC–NH), vì KTPT chỉ có 2 môn. Spec muốn tutor này dạy Kinh tế lượng ở NEU. Ở đây tutor dạy Kinh tế lượng ở UEB, còn NEU vẫn có 2 tutor Kinh tế lượng khác.
- **Khoa Quản trị kinh doanh – NEU** (6 môn, mã thật theo khung CTĐT NEU): QTCL1104 Quản trị chất lượng, QTKD1114 Quản trị chiến lược 2, QTKD1149 Quản trị vận hành 2, QTTH1108 Khởi sự kinh doanh, QTKD1133 Quản trị chuỗi cung ứng, QTTH1116 Quản trị chi phí kinh doanh – đều 3 TC. Có 3 tutor; Trịnh Quốc Việt (cựu SV, GPA 3.75) điểm B+ môn Quản trị vận hành 2 nên môn đó (và buổi ôn thi của môn đó) bị ẩn.
- **Tên chương** để chung chung ("Bài giảng chương N"), nhóm tự đặt tên sau.
- Tutor không đủ điều kiện môn nào (GPA < 3.6) vẫn mở được hồ sơ nếu gõ thẳng URL, nhưng không xuất hiện ở bất kỳ danh sách hay dropdown nào.
- Ở chế độ tutor, tutor xem được mọi chương của mình (kể cả chương đã khoá với người học). Chỉ chương vừa upload trong phiên mới có nút Xoá; khi xoá sẽ thu hồi object URL.
- Trang chủ hiện chương **xem thử** của mọi tutor đủ điều kiện + chương vừa upload. Nút "Đăng ký tham gia" chỉ hiện toast "Tính năng đang phát triển".
- Video upload chỉ lưu trong bộ nhớ trình duyệt và mất khi tải lại trang (đúng spec).
