import { clsx } from "clsx";

import type { SortKey, View } from "../types";

type NavBarProps = {
   view: View;
   setView: (v: View) => void;
   sortKey: SortKey;
   setSortKey: (k: SortKey) => void;
   filterInstalled: boolean;
   setFilterInstalled: (v: boolean) => void;
};

const SORT_KEYS: SortKey[] = ["name", "hours", "lastPlayed", "size"];

const tab = "px-1.5 py-0.5 cursor-pointer hover:text-fg hover:bg-bg-hover";

export function NavBar({ view, setView, sortKey, setSortKey, filterInstalled, setFilterInstalled }: NavBarProps) {
   return (
      <div className="bg-bg border-border flex shrink-0 items-center gap-1 border-b px-3 py-1">
         <button className={clsx(tab, view === "library" ? "text-accent" : "text-fg-dim")} onClick={() => setView("library")}>
            [LIBRARY]
         </button>
         <button className={clsx(tab, view === "user" ? "text-accent" : "text-fg-dim")} onClick={() => setView("user")}>
            [USERS]
         </button>
         <button className={clsx(tab, view === "settings" ? "text-accent" : "text-fg-dim")} onClick={() => setView("settings")}>
            [SETTINGS]
         </button>
         <div className="flex-1" />
         {view === "library" && (
            <div className="flex items-center gap-1">
               <button className={clsx(tab, "text-fg-dim")} onClick={() => setFilterInstalled(!filterInstalled)}>
                  {filterInstalled ? "[*] INSTALLED ONLY" : "[ ] INSTALLED ONLY"}
               </button>
               <span className="text-border">|</span>
               <span className="text-fg-dim text-xs tracking-wider">SORT:</span>
               {SORT_KEYS.map((k) => (
                  <button key={k} className={clsx(tab, sortKey === k ? "text-accent" : "text-fg-dim")} onClick={() => setSortKey(k)}>
                     {k.toUpperCase()}
                  </button>
               ))}
            </div>
         )}
      </div>
   );
}
