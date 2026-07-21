const app = document.getElementById("app");
app.classList="min-h-screen bg-gray-800 text-gray-200 min-w-md";
const script = document.createElement("script");
const header = document.createElement("header");
const main = document.createElement("main");
const aside = document.createElement("aside");
const button = document.createElement("button");
const container = document.createElement("div");

header.id="header";
header.classList ="fixed top-0 left-0 h-16 right-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-black backdrop-blur bg-slate-900";
header.innerHTML= `<div class="px-4 sm:px-6 lg:px-8 h-full flex items-center">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-4">
          <button id="sidebar-toggle" class="p-2 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition-all duration-200 active:scale-95 shadow-sm" aria-label="Toggle sidebar">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-xl font-bold gradient-text hidden sm:block">Nexus</span>
          </div>
        </div>
        <div class="flex-1 max-w-2xl mx-4 hidden md:block">
          <div class="relative search-glow transition-all duration-300 rounded-xl">
            <input type="text" id="search-input" placeholder="Search anything..." class="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:focus:ring-indigo-400/60 transition-all duration-300 backdrop-blur-sm">
            <svg class="w-5 h-5 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button id="theme-toggle" class="p-2.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition-all duration-200 active:scale-95" aria-label="Toggle theme">
            <svg id="sun-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg id="moon-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>

          <button id="new-item-btn" class="gradient-bg hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 shadow-lg shadow-indigo-500/30 hidden sm:flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Item
          </button>

          <button class="relative p-2 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition-all duration-200" aria-label="Notifications">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          <div class="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25">
            JD
          </div>
        </div>
      </div>
      <div class="md:hidden pb-3 pt-1 w-full">
        <div class="relative search-glow transition-all duration-300 rounded-xl">
          <input type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all duration-300 backdrop-blur-sm">
          <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>`;

app.append(header,main,footer,aside);
