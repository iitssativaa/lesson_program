function HomePage({ schedules }) {
  const totalCourses = schedules.reduce((total, schedule) => {
    return total + (schedule.courses?.length || 0);
  }, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
        Hoş geldiniz
      </h2>

      <p className="mt-2 text-sm sm:text-base text-slate-600">
        Buradan ders programlarınızı oluşturabilir ve yönetebilirsiniz.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-sm text-slate-500">Toplam Program</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {schedules.length}
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-sm text-slate-500">Toplam Ders</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {totalCourses}
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-slate-500">Son Program</p>
          <h3 className="text-xl font-bold text-slate-900 mt-2 break-words">
            {schedules.length > 0
              ? schedules[schedules.length - 1].name
              : "Henüz yok"}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default HomePage;