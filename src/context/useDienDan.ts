// Trạng thái diễn đàn: tin nhắn gửi trong phiên demo và cảm xúc mình đã thả.
import { useState } from "react";
import type { TinNhan } from "../data/mockData";
import { chuoiLocal } from "../lib/lich";

export function useDienDan(cheDo: "hoc" | "tutor", tutorDongVaiId: string) {
  const [tinNhanThem, setTinNhanThem] = useState<TinNhan[]>([]);
  // Người học gửi với tên "Bạn"; ở chế độ tutor gửi bằng tên tutor đang đóng vai
  const guiTinNhan = (kenhId: string, noiDung: string) =>
    setTinNhanThem((ds) => [
      ...ds,
      {
        id: `tn-${Date.now()}`,
        kenhId,
        noiDung,
        thoiGian: chuoiLocal(new Date()),
        tacGia: cheDo === "tutor" ? { loai: "tutor", tutorId: tutorDongVaiId } : { loai: "hoc-vien", ten: "Bạn", moTa: "Người học" },
      },
    ]);

  const [camXucCuaToi, setCamXucCuaToi] = useState<Record<string, string[]>>({}); // id tin nhắn → emoji đã thả
  const thaCamXuc = (tinId: string, emoji: string) =>
    setCamXucCuaToi((m) => {
      const ds = m[tinId] ?? [];
      return { ...m, [tinId]: ds.includes(emoji) ? ds.filter((e) => e !== emoji) : [...ds, emoji] };
    });

  return { tinNhanThem, guiTinNhan, camXucCuaToi, thaCamXuc };
}
