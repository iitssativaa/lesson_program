import { Home, CalendarDays, User, LogOut } from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold">DersPlan</h1>
          <p className="text-sm text-slate-400">Otomatik Programlama</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <button
          onClick={() => setActivePage("home")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            activePage === "home"
              ? "bg-cyan-500 text-slate-950"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Home size={20} />
          <span>Anasayfa</span>
        </button>

        <button
          onClick={() => setActivePage("schedules")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            activePage === "schedules"
              ? "bg-cyan-500 text-slate-950"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <CalendarDays size={20} />
          <span>Ders Programları</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <User size={20} />
          <span>Profil</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition">
          <LogOut size={20} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;