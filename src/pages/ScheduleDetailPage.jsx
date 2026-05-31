import { useState } from "react";
import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    Plus,
    Trash2,
    Wand2,
    Ban,
    SplitSquareHorizontal,
    Users,
    Pencil,
    FileText,
    FileSpreadsheet,
} from "lucide-react";
import {
    exportScheduleToExcel,
    exportScheduleToPDF,
} from "../utils/exportSchedule";

import { days, hours, classroomGroups } from "../data/classrooms";

const blockPatternOptions = {
    1: [{ label: "1", value: "1", blocks: [1] }],
    2: [
        { label: "2", value: "2", blocks: [2] },
        { label: "1 + 1", value: "1+1", blocks: [1, 1] },
    ],
    3: [
        { label: "3", value: "3", blocks: [3] },
        { label: "2 + 1", value: "2+1", blocks: [2, 1] },
        { label: "1 + 1 + 1", value: "1+1+1", blocks: [1, 1, 1] },
    ],
    4: [
        { label: "4", value: "4", blocks: [4] },
        { label: "2 + 2", value: "2+2", blocks: [2, 2] },
        { label: "3 + 1", value: "3+1", blocks: [3, 1] },
        { label: "2 + 1 + 1", value: "2+1+1", blocks: [2, 1, 1] },
    ],
    5: [
        { label: "5", value: "5", blocks: [5] },
        { label: "3 + 2", value: "3+2", blocks: [3, 2] },
        { label: "2 + 2 + 1", value: "2+2+1", blocks: [2, 2, 1] },
    ],
};

function ScheduleDetailPage({
    schedule,
    onBack,
    onAddCourse,
    onDeleteCourse,
    onUpdateCourse,
    onGenerateSchedule,
}) {
    const [courseCode, setCourseCode] = useState("");
    const [courseName, setCourseName] = useState("");
    const [instructor, setInstructor] = useState("");
    const [classGroup, setClassGroup] = useState("");

    const [classroomGroup, setClassroomGroup] = useState("iibf");
    const [classroom, setClassroom] = useState("C-001");

    const [weeklyHours, setWeeklyHours] = useState("2");
    const [blockPattern, setBlockPattern] = useState("2");
    const [preventSameDayBlocks, setPreventSameDayBlocks] = useState(true);
    const [unavailableDays, setUnavailableDays] = useState([]);
    const [unavailableHours, setUnavailableHours] = useState([]);
    const [editingCourseId, setEditingCourseId] = useState(null);

    const courses = schedule.courses || [];

    const generatedSchedule = schedule.generatedSchedule;
    const occupiedSlots = generatedSchedule?.occupiedSlots || {};
    const unplacedCourses = generatedSchedule?.unplacedCourses || [];
    const logs = generatedSchedule?.logs || [];

    const selectedWeeklyHours = Number(weeklyHours);
    const availableBlockPatterns = blockPatternOptions[selectedWeeklyHours] || [];

    const selectedClassroomGroup = classroomGroups.find(
        (group) => group.id === classroomGroup
    );

    const availableClassrooms = selectedClassroomGroup?.rooms || [];

    const toggleUnavailableDay = (day) => {
        if (unavailableDays.includes(day)) {
            setUnavailableDays(unavailableDays.filter((item) => item !== day));
        } else {
            setUnavailableDays([...unavailableDays, day]);
        }
    };

    const toggleUnavailableHour = (hour) => {
        if (unavailableHours.includes(hour)) {
            setUnavailableHours(unavailableHours.filter((item) => item !== hour));
        } else {
            setUnavailableHours([...unavailableHours, hour]);
        }
    };

    const handleWeeklyHoursChange = (value) => {
        setWeeklyHours(value);

        const firstPattern = blockPatternOptions[Number(value)]?.[0];

        if (firstPattern) {
            setBlockPattern(firstPattern.value);
        }
    };

    const handleClassroomGroupChange = (value) => {
        setClassroomGroup(value);

        const selectedGroup = classroomGroups.find((group) => group.id === value);
        const firstRoom = selectedGroup?.rooms?.[0] || "";

        setClassroom(firstRoom);
    };

    const resetForm = () => {
        setCourseCode("");
        setCourseName("");
        setInstructor("");
        setClassGroup("");
        setClassroomGroup("iibf");
        setClassroom("C-001");
        setWeeklyHours("2");
        setBlockPattern("2");
        setPreventSameDayBlocks(true);
        setUnavailableDays([]);
        setUnavailableHours([]);
        setEditingCourseId(null);
    };

    const handleEditCourse = (course) => {
        const groupId = course.classroomGroup || "iibf";
        const group = classroomGroups.find((item) => item.id === groupId);
        const firstRoom = group?.rooms?.[0] || "C-001";

        setEditingCourseId(course.id);

        setCourseCode(course.courseCode || "");
        setCourseName(course.name || "");

        setInstructor(
            course.instructor === "Belirtilmedi" ? "" : course.instructor || ""
        );

        setClassGroup(
            course.classGroup === "Belirtilmedi" ? "" : course.classGroup || ""
        );

        setClassroomGroup(groupId);
        setClassroom(course.classroom || firstRoom);

        setWeeklyHours(String(course.weeklyHours || 2));
        setBlockPattern(course.blockPattern || String(course.weeklyHours || 2));
        setPreventSameDayBlocks(course.preventSameDayBlocks ?? true);
        setUnavailableDays(course.unavailableDays || []);
        setUnavailableHours(course.unavailableHours || []);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!courseCode.trim() || !courseName.trim()) return;

        const selectedPattern = availableBlockPatterns.find(
            (pattern) => pattern.value === blockPattern
        );

        const coursePayload = {
            courseCode: courseCode.trim().toUpperCase(),
            name: courseName.trim(),

            instructor: instructor || "Belirtilmedi",
            classGroup: classGroup || "Belirtilmedi",

            classroomGroup,
            classroomGroupLabel: selectedClassroomGroup?.label || "Belirtilmedi",
            classroom: classroomGroup === "online" ? "Online" : classroom,

            weeklyHours: selectedWeeklyHours,
            blockPattern,
            blocks: selectedPattern?.blocks || [selectedWeeklyHours],
            preventSameDayBlocks,
            unavailableDays,
            unavailableHours,
        };

        if (editingCourseId) {
            onUpdateCourse(schedule.id, editingCourseId, coursePayload);
        } else {
            onAddCourse(schedule.id, coursePayload);
        }

        resetForm();
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-5">
                <div>
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
                    >
                        <ArrowLeft size={18} />
                        Ders programlarına dön
                    </button>

                    <h2 className="mt-4 text-3xl font-bold text-slate-900">
                        {schedule.name}
                    </h2>

                    <p className="mt-2 text-slate-600">
                        Ders kataloğunu oluşturun, kısıtları belirleyin ve haftalık programa
                        otomatik yerleştirin.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onGenerateSchedule(schedule.id)}
                        disabled={courses.length === 0}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950 text-white font-semibold hover:bg-slate-800 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Wand2 size={20} />
                        Programı Otomatik Oluştur
                    </button>

                    <button
                        onClick={() => exportScheduleToPDF(schedule)}
                        disabled={!generatedSchedule}
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <FileText size={19} />
                        PDF
                    </button>

                    <button
                        onClick={() => exportScheduleToExcel(schedule)}
                        disabled={!generatedSchedule}
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <FileSpreadsheet size={19} />
                        Excel
                    </button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-6">
                <section className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                <BookOpen className="text-cyan-600" size={24} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {editingCourseId ? "Dersi Düzenle" : "Ders Kataloğu"}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {editingCourseId
                                        ? "Seçili dersin bilgilerini güncelleyin"
                                        : "Ders bilgisi ve kısıtları buradan girilir"}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Ders Kodu
                                </label>
                                <input
                                    value={courseCode}
                                    onChange={(e) => setCourseCode(e.target.value)}
                                    placeholder="Örn: MAT101"
                                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Dersin Tam Adı
                                </label>
                                <input
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                    placeholder="Örn: Matematik I"
                                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Öğretim Elemanı
                                </label>
                                <input
                                    value={instructor}
                                    onChange={(e) => setInstructor(e.target.value)}
                                    placeholder="Örn: Dr. Ahmet Yılmaz"
                                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Sınıf / Grup
                                </label>
                                <input
                                    value={classGroup}
                                    onChange={(e) => setClassGroup(e.target.value)}
                                    placeholder="Örn: Bilgisayar Müh. 2. Sınıf"
                                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">
                                        Fakülte / Derslik Kategorisi
                                    </label>

                                    <select
                                        value={classroomGroup}
                                        onChange={(e) => handleClassroomGroupChange(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                    >
                                        {classroomGroups.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.label}
                                            </option>
                                        ))}
                                    </select>

                                    <p className="mt-2 text-xs text-slate-500">
                                        {selectedClassroomGroup?.description}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700">
                                        Derslik
                                    </label>

                                    <select
                                        value={classroom}
                                        onChange={(e) => setClassroom(e.target.value)}
                                        disabled={classroomGroup === "online"}
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                                    >
                                        {availableClassrooms.map((room) => (
                                            <option key={room} value={room}>
                                                {room}
                                            </option>
                                        ))}
                                    </select>

                                    {classroomGroup === "online" && (
                                        <p className="mt-2 text-xs text-cyan-700 font-semibold">
                                            Online dersler 21:00’e kadar programa yerleştirilebilir.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">
                                        Haftalık Ders Saati
                                    </label>
                                    <select
                                        value={weeklyHours}
                                        onChange={(e) => handleWeeklyHoursChange(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                    >
                                        <option value="1">1 saat</option>
                                        <option value="2">2 saat</option>
                                        <option value="3">3 saat</option>
                                        <option value="4">4 saat</option>
                                        <option value="5">5 saat</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700">
                                        Blok Yapısı
                                    </label>
                                    <select
                                        value={blockPattern}
                                        onChange={(e) => setBlockPattern(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                    >
                                        {availableBlockPatterns.map((pattern) => (
                                            <option key={pattern.value} value={pattern.value}>
                                                {pattern.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                                        <SplitSquareHorizontal
                                            size={20}
                                            className="text-cyan-700"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-800">
                                            Ders bloklara bölünsün
                                        </h4>

                                        <p className="mt-1 text-xs text-slate-600">
                                            Örneğin 4 saatlik Matematik dersi “2 + 2” seçilirse iki
                                            ayrı 2 saatlik blok olarak programa yerleşir.
                                        </p>

                                        <label className="mt-4 flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preventSameDayBlocks}
                                                onChange={(e) =>
                                                    setPreventSameDayBlocks(e.target.checked)
                                                }
                                                className="w-4 h-4 accent-cyan-600"
                                            />

                                            <span className="text-sm font-semibold text-slate-700">
                                                Bölünen blokları aynı güne koyma
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                                <div className="flex items-center gap-2">
                                    <Ban size={18} className="text-red-500" />
                                    <h4 className="text-sm font-bold text-slate-800">
                                        Uygun Olmayan Günler
                                    </h4>
                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    Dersin kesinlikle yerleştirilmemesi gereken günleri seç.
                                </p>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {days.map((day) => {
                                        const isSelected = unavailableDays.includes(day);

                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleUnavailableDay(day)}
                                                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${isSelected
                                                    ? "bg-red-500 text-white border-red-500"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-500"
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                                <div className="flex items-center gap-2">
                                    <Ban size={18} className="text-red-500" />
                                    <h4 className="text-sm font-bold text-slate-800">
                                        Uygun Olmayan Saatler
                                    </h4>
                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    Dersin yerleştirilmemesi gereken saatleri seç.
                                </p>

                                <div className="mt-4 grid grid-cols-4 gap-2">
                                    {hours.map((hour) => {
                                        const isSelected = unavailableHours.includes(hour);

                                        return (
                                            <button
                                                key={hour}
                                                type="button"
                                                onClick={() => toggleUnavailableHour(hour)}
                                                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${isSelected
                                                    ? "bg-red-500 text-white border-red-500"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-500"
                                                    }`}
                                            >
                                                {hour}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
                                >
                                    {editingCourseId ? <Pencil size={20} /> : <Plus size={20} />}
                                    {editingCourseId ? "Dersi Güncelle" : "Dersi Ekle"}
                                </button>

                                {editingCourseId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                                    >
                                        İptal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">
                                Eklenen Dersler
                            </h3>
                            <span className="text-sm font-semibold text-cyan-600">
                                {courses.length} ders
                            </span>
                        </div>

                        {courses.length === 0 ? (
                            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Henüz ders eklenmedi. Üstteki formdan ilk dersi
                                    ekleyebilirsin.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-3">
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-black tracking-wide text-slate-900">
                                                    {course.courseCode || "KOD YOK"}
                                                </p>

                                                <h4 className="mt-1 font-bold text-slate-700">
                                                    {course.name}
                                                </h4>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {course.instructor}
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                                                        <Users size={13} />
                                                        {course.classGroup || "Belirtilmedi"}
                                                    </span>

                                                    <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
                                                        {course.classroomGroupLabel || "Derslik"} /{" "}
                                                        {course.classroom || "Belirtilmedi"}
                                                    </span>

                                                    <span className="px-2 py-1 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-semibold">
                                                        Haftalık {course.weeklyHours} saat
                                                    </span>

                                                    <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                                        Blok: {(course.blocks || []).join(" + ")}
                                                    </span>

                                                    {course.preventSameDayBlocks && (
                                                        <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold">
                                                            Aynı güne koyma
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEditCourse(course)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition"
                                                    title="Dersi düzenle"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    onClick={() => onDeleteCourse(schedule.id, course.id)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                                                    title="Dersi sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <ConstraintRow
                                                title="Uygun olmayan günler"
                                                values={course.unavailableDays}
                                            />

                                            <ConstraintRow
                                                title="Uygun olmayan saatler"
                                                values={course.unavailableHours}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                    <div className="flex items-center justify-between gap-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center">
                                <CalendarDays className="text-white" size={24} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Haftalık Program
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Otomatik oluşturulan ders programı burada görünecek
                                </p>
                            </div>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            {generatedSchedule ? "Oluşturuldu" : "Taslak"}
                        </span>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <div className="min-w-[950px] rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="grid grid-cols-[90px_repeat(5,1fr)] bg-slate-950 text-white">
                                <div className="p-3 text-sm font-semibold border-r border-slate-800">
                                    Saat
                                </div>

                                {days.map((day) => (
                                    <div
                                        key={day}
                                        className="p-3 text-sm font-semibold text-center border-r border-slate-800 last:border-r-0"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="grid grid-cols-[90px_repeat(5,1fr)] min-h-20 border-t border-slate-200"
                                >
                                    <div className="p-3 text-sm font-semibold text-slate-500 bg-slate-50 border-r border-slate-200">
                                        {hour}
                                    </div>

                                    {days.map((day) => {
                                        const slotKey = `${day}-${hour}`;
                                        const slot = occupiedSlots[slotKey];

                                        return (
                                            <div
                                                key={slotKey}
                                                className="p-2 border-r border-slate-200 last:border-r-0 hover:bg-cyan-50/50 transition"
                                            >
                                                {slot ? (
                                                    <div
                                                        className={`h-full rounded-xl p-3 border ${slot.isStart
                                                            ? "bg-cyan-500 text-slate-950 border-cyan-500"
                                                            : "bg-cyan-50 text-cyan-800 border-cyan-100"
                                                            }`}
                                                    >
                                                        <p className="text-sm font-black tracking-wide leading-tight">
                                                            {slot.courseCode || "KOD YOK"}
                                                        </p>

                                                        <p className="mt-1 text-xs font-semibold leading-tight opacity-90">
                                                            {slot.courseName}
                                                        </p>

                                                        <p className="mt-1 text-xs font-semibold opacity-80">
                                                            {slot.startHour} - {slot.endHour}
                                                        </p>

                                                        <p className="mt-1 text-xs opacity-80">
                                                            {slot.classroomGroupLabel} / {slot.classroom}
                                                        </p>

                                                        {slot.totalBlocks > 1 && (
                                                            <p className="mt-2 inline-block rounded-lg bg-white/50 px-2 py-1 text-[11px] font-bold">
                                                                Blok {slot.blockIndex}/{slot.totalBlocks}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="h-full rounded-xl border border-dashed border-slate-200"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                            <h4 className="font-bold text-slate-900">Algoritma Durumu</h4>

                            {!generatedSchedule ? (
                                <p className="mt-2 text-sm text-slate-600">
                                    Henüz program oluşturulmadı. Dersleri ekledikten sonra
                                    “Programı Otomatik Oluştur” butonuna bas.
                                </p>
                            ) : (
                                <div className="mt-3 space-y-2">
                                    <p className="text-sm text-slate-600">
                                        Oluşturulma zamanı:{" "}
                                        <span className="font-semibold">
                                            {generatedSchedule.generatedAt}
                                        </span>
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        Yerleşen blok sayısı:{" "}
                                        <span className="font-semibold">
                                            {generatedSchedule.placements.length}
                                        </span>
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        Yerleşemeyen ders sayısı:{" "}
                                        <span className="font-semibold text-red-600">
                                            {unplacedCourses.length}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                            <h4 className="font-bold text-slate-900">Uyarılar</h4>

                            {logs.length === 0 ? (
                                <p className="mt-2 text-sm text-slate-600">
                                    Henüz algoritma çıktısı yok.
                                </p>
                            ) : (
                                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                    {logs.map((log, index) => (
                                        <div
                                            key={index}
                                            className={`rounded-xl px-3 py-2 text-sm font-medium ${log.type === "success"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-red-50 text-red-700"
                                                }`}
                                        >
                                            {log.message}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function ConstraintRow({ title, values = [] }) {
    return (
        <div>
            <p className="text-xs font-semibold text-slate-500">{title}</p>

            {values.length === 0 ? (
                <p className="mt-1 text-xs text-slate-400">Kısıt yok</p>
            ) : (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {values.map((value) => (
                        <span
                            key={value}
                            className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-semibold"
                        >
                            {value}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ScheduleDetailPage;