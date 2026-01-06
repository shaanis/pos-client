import {
    LayoutGrid,
    Utensils,
    CreditCard,
    CalendarDays,
    MessageSquareText,
    HelpCircle,
    Menu,
    X,
  } from "lucide-react";
  import { useState, useEffect } from "react";
  
  type MenuItem = {
    label: string;
    icon: any;
  };
  
  const menuItems: MenuItem[] = [
    { label: "Overview", icon: LayoutGrid },
    { label: "Menu", icon: Utensils },
    { label: "History", icon: CreditCard },
    { label: "Manage Food", icon: CalendarDays },

  ];
  
  type SidebarProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setIsExpanded?: (expanded: boolean) => void;
  };
  
  const Sidebar = ({ activeTab, setActiveTab, setIsExpanded }: SidebarProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
  
    // Notify parent about expansion (only relevant for desktop layout)
    useEffect(() => {
      if (setIsExpanded) setIsExpanded(isHovered);
    }, [isHovered, setIsExpanded]);
  
    const handleTabClick = (label: string) => {
      setActiveTab(label);
      setIsMobileOpen(false); // Close drawer on mobile after selection
    };
  
    return (
      <>
        {/* --- MOBILE HAMBURGER BUTTON --- */}
        {!isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden fixed top-5 left-4 z-[60] p-2 bg-emerald-500 text-white rounded-lg shadow-lg"
          >
            <Menu size={24} />
          </button>
        )}
  
        {/* --- MOBILE OVERLAY --- */}
        {isMobileOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55]"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
  
        {/* --- SIDEBAR ASIDE --- */}
        <aside
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            fixed left-0 top-0 h-screen transition-all duration-300 
            bg-gradient-to-b from-emerald-400 to-emerald-500 text-white 
            lg:rounded-r-3xl shadow-xl flex flex-col justify-between overflow-hidden z-[56]
            
            /* Mobile Logic: Hidden off-left, width 256px when open */
            ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
            
            /* Desktop Logic: Toggle width between 20 (80px) and 64 (256px) */
            ${!isMobileOpen && (isHovered ? "lg:w-64" : "lg:w-20")}
          `}
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center px-4 py-8 mb-4 relative">
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden absolute top-4 right-4 text-emerald-100"
            >
              <X size={20} />
            </button>
  
            <div className={`transition-all duration-300 ${(isHovered || isMobileOpen) ? "scale-100" : "scale-110"}`}>
              <h1 className="text-2xl font-bold tracking-wide flex items-center">
                {(isHovered || isMobileOpen) ? (
                  <>
                    Food<span className="font-light text-emerald-100">Dash</span>
                  </>
                ) : (
                  <span className="w-10 h-10 text-lg flex items-center justify-center bg-white backdrop-blur-md rounded-full text-emerald-500 shadow-inner">
                    fd
                  </span>
                )}
              </h1>
            </div>
            <p className={`text-[10px] uppercase tracking-widest mt-1 transition-all duration-300 ${(isHovered || isMobileOpen) ? "opacity-70 h-auto" : "opacity-0 h-0"}`}>
              Admin Panel
            </p>
          </div>
  
          {/* Navigation Menu */}
          <nav className="flex flex-col px-3 gap-2 flex-1">
            {menuItems.map(({ label, icon: Icon }) => {
              const isActive = activeTab === label;
              const expanded = isHovered || isMobileOpen;
  
              return (
                <button
                  key={label}
                  onClick={() => handleTabClick(label)}
                  className={`group relative flex items-center transition-all duration-300 rounded-xl p-3 ${
                    expanded ? "w-full" : "w-12 text-center"
                  } ${isActive ? "bg-white text-emerald-600 shadow-md" : "text-white hover:bg-white/20"}`}
                >
                  <Icon
                    size={22}
                    className={`shrink-0 transition-colors duration-300 ${
                      isActive
                        ? "text-emerald-500"
                        : !expanded
                        ? "text-white scale-110"
                        : "text-white/80 group-hover:text-white"
                    }`}
                  />
  
                  <span className={`ml-4 font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${expanded ? "max-w-xs opacity-100" : "max-w-0 opacity-0"}`}>
                    {label}
                  </span>
  
                  {/* Tooltip for collapsed state (Desktop only) */}
                  {!expanded && (
                    <div className="hidden lg:block absolute left-16 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-xs p-2 rounded-md whitespace-nowrap z-50">
                      {label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
  
          {/* Footer / User Profile */}
          <div className="p-4">
            <div className={`flex items-center bg-white/10 backdrop-blur-md rounded-2xl transition-all duration-300 ${ (isHovered || isMobileOpen) ? "p-2 gap-3" : "p-2 justify-center"}`}>
              <div className="w-8 h-8 bg-white rounded-full flex-shrink-0 flex items-center justify-center text-emerald-500 font-bold shadow-sm">
                A
              </div>
              <div className={`flex flex-col transition-all duration-300 overflow-hidden ${(isHovered || isMobileOpen) ? "max-w-full opacity-100" : "max-w-0 opacity-0"}`}>
                <p className="text-xs font-semibold truncate">Admin User</p>
                <p className="text-[10px] opacity-60">Store #01</p>
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  };
  
  export default Sidebar;