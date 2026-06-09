import { Home, CalendarDays, User, LogOut } from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      id: "home",
      label: "Anasayfa",
      icon: Home,
    },
    {
      id: "schedules",
      label: "Ders Programları",
      icon: CalendarDays,
    },
    {
      id: "profile",
      label: "Profil",
      icon: User,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 min-h-screen bg-slate-950 text-white flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-bold">DersPlan</h1>
            <p className="text-sm text-slate-400">Otomatik Programlama</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id !== "profile") {
                    setActivePage(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  isActive
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition">
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <header className="lg:hidden bg-slate-950 text-white border-b border-slate-800">
        <div className="px-4 py-4">
          <h1 className="text-lg font-bold">DersPlan</h1>
          <p className="text-xs text-slate-400">Otomatik Programlama</p>
        </div>

        <nav className="px-3 pb-3 grid grid-cols-2 gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id !== "profile") {
                    setActivePage(item.id);
                  }
                }}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-900 text-slate-300"
                }`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold bg-red-500/10 text-red-300">
            <LogOut size={17} />
            <span>Çıkış</span>
          </button>
        </nav>
      </header>
    </>
  );
}

export default Sidebar;