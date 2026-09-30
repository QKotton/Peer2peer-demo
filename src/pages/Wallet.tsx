import LearnerWallet from "../components/wallet/LearnerWallet";
import TutorWallet from "../components/wallet/TutorWallet";
import { useApp } from "../context/AppContext";

/** Ví của tôi: tutor xem thu nhập & rút tiền; người học xem số dư & lịch sử giao dịch. */
export default function Wallet() {
  const { cheDo, tutorDongVaiId } = useApp();
  return cheDo === "tutor" ? <TutorWallet key={tutorDongVaiId} /> : <LearnerWallet />;
}
