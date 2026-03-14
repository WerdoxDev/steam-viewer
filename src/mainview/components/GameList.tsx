import { clsx } from "clsx";
import { useState } from "react";

import type { Game } from "../types";

type GameListProps = {
   games: Game[];
   gameEntries: Map<number, Game[]>;
   selectedGame: number | null;
   onSelect: (id: number) => void;
};

export function GameList({ games, gameEntries, selectedGame, onSelect }: GameListProps) {
   const [expandedGames, setExpandedGames] = useState<Set<number>>(new Set());
   const [searchQuery, setSearchQuery] = useState("");

   const filteredGames = searchQuery.trim() ? games.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase())) : games;

   function toggleAccordion(id: number) {
      setExpandedGames((prev) => {
         const next = new Set(prev);
         if (next.has(id)) next.delete(id);
         else next.add(id);
         return next;
      });
   }

   return (
      <div className="border-border flex w-95 min-w-75 flex-col overflow-hidden border-r">
         <div className="bg-bg-panel border-border text-fg-dim shrink-0 border-b px-3 py-1.5 text-[11px] font-bold tracking-widest">
            GAMES ({searchQuery.trim() ? `${filteredGames.length}/` : ""}
            {games.length})
         </div>
         <div className="border-border bg-bg shrink-0 border-b px-3 py-1">
            <div className="flex items-center gap-1.5">
               <span className="text-accent text-xs font-bold">&gt;</span>
               <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH..."
                  className="text-fg placeholder:text-fg-dim flex-1 bg-transparent font-mono text-xs tracking-wider outline-none"
               />
               {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-fg-dim hover:text-fg px-0.5 text-xs">
                     [X]
                  </button>
               )}
            </div>
         </div>
         <div className="flex-1 overflow-y-auto">
            {filteredGames.map((game, i) => {
               const entries = gameEntries.get(game.id) ?? [];
               const isMulti = entries.length > 1;
               const isExpanded = expandedGames.has(game.id);

               return (
                  <div key={game.id}>
                     <button
                        className={clsx(
                           "border-border hover:bg-bg-hover flex w-full cursor-pointer items-center gap-2.5 border-b px-3 py-1.25 text-left",
                           selectedGame === game.id ? "bg-bg-active text-fg-bright border-l-accent border-l-2" : "text-fg",
                        )}
                        onClick={() => onSelect(game.id)}
                     >
                        <span className="text-fg-dim w-5 shrink-0 text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                        {game.iconHash ? (
                           <img
                              src={`https:/shared.fastly.steamstatic.com/community_assets/images/apps/${game.id}/${game.iconHash}.jpg`}
                              alt=""
                              className="h-5 w-5 shrink-0"
                              onError={(e) => {
                                 e.currentTarget.style.display = "none";
                              }}
                           />
                        ) : (
                           <span className="h-5 w-5 shrink-0" />
                        )}
                        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{game.name}</span>
                        <span className="text-fg-dim shrink-0 text-xs">{game.hours}h</span>
                        <span className={clsx("w-3.5 shrink-0 text-center", game.status === "installed" ? "text-accent" : "text-fg-dim")}>
                           {game.status === "installed" ? "+" : "-"}
                        </span>
                        {isMulti && (
                           <span
                              className="text-fg-dim hover:text-accent shrink-0 cursor-pointer px-1 text-[11px]"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 toggleAccordion(game.id);
                              }}
                           >
                              {isExpanded ? "▾" : "▸"} {entries.length}
                           </span>
                        )}
                     </button>
                     {isMulti && isExpanded && (
                        <div className="bg-bg-panel">
                           {entries.map((entry) => (
                              <button
                                 key={`${entry.id}-${entry.owner}`}
                                 className={clsx(
                                    "border-border hover:bg-bg-hover flex w-full cursor-pointer items-center gap-2.5 border-b py-1.25 pr-3 pl-6 text-left text-xs",
                                    selectedGame === entry.id ? "bg-bg-active text-fg-bright border-l-accent border-l-2" : "text-fg",
                                 )}
                                 onClick={() => onSelect(entry.id)}
                              >
                                 <span className="text-fg-dim w-5 shrink-0 text-[11px]">└</span>
                                 <span className="text-fg-dim flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{entry.owner}</span>
                                 <span className="text-fg-dim shrink-0 text-xs">{entry.hours}h</span>
                                 <span className="text-fg-dim shrink-0 text-[11px]">{entry.lastPlayed}</span>
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
   );
}
