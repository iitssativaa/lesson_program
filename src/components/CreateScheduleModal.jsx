import { X } from "lucide-react";

function CreateScheduleModal({
  scheduleName,
  setScheduleName,
  onClose,
  onCreate,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Yeni Ders Programı
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Oluşturmak istediğiniz ders programına bir isim verin.
        </p>

        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Program Adı
          </label>

          <input
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCreate();
            }}
            autoFocus
            placeholder="Örn: 2025-2026 Güz Dönemi"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            Vazgeç
          </button>

          <button
            onClick={onCreate}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
          >
            Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateScheduleModal;