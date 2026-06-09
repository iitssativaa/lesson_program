import { useState } from "react";
import { Home, CalendarDays, User, LogOut, Menu, X } from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      disabled: true,
    },
  ];

  const handleMenuClick = (item) => {
    if (item.disabled) return;

    setActivePage(item.id);
    setIsMobileMenuOpen(false);
  };

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
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  isActive
                    ? "bg-cyan-500 text-slate-950"
                    : item.disabled
                    ? "text-slate-600 cursor-not-allowed"
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

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800">
        <div className="h-16 px-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold leading-tight">DersPlan</h1>
            <p className="text-xs text-slate-400">Otomatik Programlama</p>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition"
            aria-label="Menüyü aç/kapat"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="px-4 pb-4 bg-slate-950 border-t border-slate-800">
            <nav className="pt-3 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-cyan-500 text-slate-950"
                        : item.disabled
                        ? "bg-slate-900/40 text-slate-600 cursor-not-allowed"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>

                    {item.disabled && (
                      <span className="ml-auto text-[11px] text-slate-500">
                        Yakında
                      </span>
                    )}
                  </button>
                );
              })}

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-red-500/10 text-red-300 hover:bg-red-500/15 transition">
                <LogOut size={18} />
                <span>Çıkış Yap</span>
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default Sidebar;