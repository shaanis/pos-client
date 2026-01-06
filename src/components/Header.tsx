import React from "react";
import { Search, Mic, SlidersHorizontal } from "lucide-react";

const Header = () => {
  return (
    <header className="mb-6 w-full lg:mb-10">
      {/* MOBILE HEADER WRAPPER:
          Adds a subtle background, padding, and blur on small screens 
          to create a premium "sticky header" feel.
      */}
      <div className="flex items-center justify-start lg:justify-center w-full p-1 sm:p-0 rounded-3xl lg:bg-transparent">
        
        {/* --- SEARCH BOX CONTAINER --- */}
        <div className="relative w-full max-w-2xl group ml-12 lg:ml-0">
          
          {/* Animated Gradient Border (Subtle Glow) */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/40 to-teal-500/40 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-700"></div>
          
          <div className="relative flex items-center bg-white lg:bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            
            {/* Search Icon */}
            <div className="pl-4 lg:pl-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300">
              <Search size={18}  strokeWidth={2.5} />
            </div>

            {/* Input Field */}
            <input
              type="text"
              placeholder="Search for food..."
              className="w-full pl-3 lg:pl-4 pr-12 lg:pr-24 py-3.5 lg:py-4 bg-transparent text-slate-600 placeholder:text-slate-400 outline-none text-sm font-medium"
            />

            {/* MOBILE ONLY: Mic Icon or Filter Icon */}
            <div className="flex lg:hidden items-center pr-3 gap-2">
               <button className="p-2 bg-slate-50 rounded-xl text-slate-400 active:bg-emerald-50 active:text-emerald-500 transition-all">
                  <Mic size={18} />
               </button>
            </div>

            {/* DESKTOP ONLY: Quick Actions */}
            <div className="hidden lg:flex absolute right-4 items-center gap-3">
              <button className="p-1.5 text-slate-300 hover:text-emerald-500 transition-colors">
                <Mic size={16} />
              </button>
              <div className="w-px h-4 bg-slate-200"></div>
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg select-none">
                <span className="text-[10px] font-bold text-slate-400">Search</span>
              </div>
            </div>

          </div>

         

        </div>
      </div>
    </header>
  );
};

export default Header;