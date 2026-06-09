import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import CreateScheduleModal from "./components/CreateScheduleModal";

import HomePage from "./pages/HomePage";
import SchedulesPage from "./pages/SchedulesPage";
import ScheduleDetailPage from "./pages/ScheduleDetailPage";

import { generateSchedule } from "./utils/generateSchedule";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const [schedules, setSchedules] = useState(() => {
    const savedSchedules = localStorage.getItem("schedules");

    if (savedSchedules) {
      return JSON.parse(savedSchedules);
    }

    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState("");

  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  const handleCreateSchedule = () => {
    if (!scheduleName.trim()) return;

    const newSchedule = {
      id: Date.now(),
      name: scheduleName,
      createdAt: new Date().toLocaleDateString("tr-TR"),
      courses: [],
      generatedSchedule: null,
    };

    setSchedules([...schedules, newSchedule]);
    setScheduleName("");
    setIsModalOpen(false);
  };

  const handleDeleteSchedule = (scheduleId) => {
    const confirmDelete = window.confirm(
      "Bu ders programını silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) return;

    setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));

    if (selectedScheduleId === scheduleId) {
      setSelectedScheduleId(null);
      setActivePage("schedules");
    }
  };

  const handleOpenSchedule = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    setActivePage("scheduleDetail");
  };

  const handleBackToSchedules = () => {
    setSelectedScheduleId(null);
    setActivePage("schedules");
  };

  const handleAddCourse = (scheduleId, courseData) => {
    const newCourse = {
      id: Date.now(),
      ...courseData,
    };

    setSchedules(
      schedules.map((schedule) => {
        if (schedule.id !== scheduleId) return schedule;

        return {
          ...schedule,
          courses: [...(schedule.courses || []), newCourse],
          generatedSchedule: null,
        };
      })
    );
  };

  const handleDeleteCourse = (scheduleId, courseId) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.id !== scheduleId) return schedule;

        return {
          ...schedule,
          courses: (schedule.courses || []).filter(
            (course) => course.id !== courseId
          ),
          generatedSchedule: null,
        };
      })
    );
  };

  const handleUpdateCourse = (scheduleId, courseId, updatedCourseData) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.id !== scheduleId) return schedule;

        return {
          ...schedule,
          courses: (schedule.courses || []).map((course) => {
            if (course.id !== courseId) return course;

            return {
              ...course,
              ...updatedCourseData,
            };
          }),
          generatedSchedule: null,
        };
      })
    );
  };

  const handleGenerateSchedule = (scheduleId) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.id !== scheduleId) return schedule;

        const result = generateSchedule(schedule.courses || []);

        return {
          ...schedule,
          generatedSchedule: result,
        };
      })
    );
  };

  const selectedSchedule = schedules.find(
    (schedule) => schedule.id === selectedScheduleId
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {activePage === "home" && <HomePage schedules={schedules} />}

        {activePage === "schedules" && (
          <SchedulesPage
            schedules={schedules}
            onOpenModal={() => setIsModalOpen(true)}
            onDeleteSchedule={handleDeleteSchedule}
            onOpenSchedule={handleOpenSchedule}
          />
        )}

        {activePage === "scheduleDetail" && selectedSchedule && (
          <ScheduleDetailPage
            schedule={selectedSchedule}
            onBack={handleBackToSchedules}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            onUpdateCourse={handleUpdateCourse}
            onGenerateSchedule={handleGenerateSchedule}
          />
        )}
      </main>

      {isModalOpen && (
        <CreateScheduleModal
          scheduleName={scheduleName}
          setScheduleName={setScheduleName}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateSchedule}
        />
      )}
    </div>
  );
}

export default App;