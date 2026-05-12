import { CalendarDays, Plus, Trash2 } from "lucide-react";

function SchedulesPage({
  schedules,
  onOpenModal,
  onDeleteSchedule,
  onOpenSchedule,
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Ders Programları
          </h2>
          <p className="mt-2 text-slate-600">
            Daha önce oluşturduğunuz ders programları burada listelenir.
          </p>
        </div>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition shadow-sm"
        >
          <Plus size={20} />
          Yeni Ders Programı Oluştur
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="mt-8 bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 flex items-center justify-center">
            <CalendarDays className="text-cyan-600" size={32} />
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-900">
            Henüz ders programı oluşturulmamış
          </h3>

          <p className="mt-2 text-slate-500 max-w-md mx-auto">
            İlk ders programınızı oluşturarak dersleri ve kısıtları eklemeye
            başlayabilirsiniz.
          </p>

          <button
            onClick={onOpenModal}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
          >
            <Plus size={20} />
            İlk Programı Oluştur
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              onClick={() => onOpenSchedule(schedule.id)}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <CalendarDays className="text-cyan-600" size={26} />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSchedule(schedule.id);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                  title="Ders programını sil"
                >
                  <Trash2 size={19} />
                </button>
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {schedule.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Oluşturulma tarihi: {schedule.createdAt}
              </p>

              <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {schedule.courses?.length || 0} ders eklendi
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSchedule(schedule.id);
                  }}
                  className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                >
                  Aç →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SchedulesPage;