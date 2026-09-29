import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import FilterPanel from "./components/FilterPanel";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import CourseTutors from "./pages/CourseTutors";
import Home from "./pages/Home";
import MyCalendar from "./pages/MyCalendar";
import TutorDashboard from "./pages/TutorDashboard";
import TutorDirectory from "./pages/TutorDirectory";
import TutorProfile from "./pages/TutorProfile";

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex min-h-[calc(100vh-4rem)] min-w-0 flex-1 flex-col">
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mon/:monId" element={<CourseTutors />} />
              <Route path="/lich-cua-toi" element={<MyCalendar />} />
              <Route path="/tutors" element={<TutorDirectory />} />
              <Route path="/tutor/:tutorId" element={<TutorProfile />} />
              <Route path="/tutor-dashboard" element={<TutorDashboard />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
      <FilterPanel />
      <Toast />
    </div>
  );
}
