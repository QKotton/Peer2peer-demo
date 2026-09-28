// Dán link YouTube (chế độ "Không công khai") cho từng bài giảng tại đây.
// Khoá = id bài giảng, dạng "<tutorId>-<monId>-c<số chương>" (xem mockData.ts).
// Chấp nhận các dạng link: https://www.youtube.com/watch?v=XXXX, https://youtu.be/XXXX
//
// Ví dụ:
//   "t2-ueb-ktl-c1": "https://youtu.be/XXXXXXXXXXX",
//
// Bài giảng chưa có link sẽ hiện khung "Video mẫu – nhóm sẽ bổ sung".

export const videoConfig: Record<string, string> = {
  // "t2-ueb-ktl-c1": "",
  // "t2-ueb-tcc-c1": "",
};
