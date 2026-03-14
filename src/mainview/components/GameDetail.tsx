import type { Game } from "../types";

type GameDetailProps = {
   game: Game | undefined;
   maxHours: number;
};

export function GameDetail({ game, maxHours }: GameDetailProps) {
   return (
      <div className="flex flex-1 flex-col overflow-hidden">
         <div className="bg-bg-panel border-border text-fg-dim shrink-0 border-b px-3 py-1.5 text-[11px] font-bold tracking-widest">DETAILS</div>
         <div className="flex-1 overflow-y-auto px-5 py-4">
            {game ? (
               <>
                  <img
                     key={game.id}
                     src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.id}/library_hero.jpg`}
                     alt={game.name}
                     className="mb-4 max-w-3xl"
                     onError={(e) => {
                        e.currentTarget.style.display = "none";
                     }}
                  />
                  <div className="text-fg-bright text-base font-bold tracking-wider">{game.name}</div>
                  <div className="text-fg-dim mb-4">{"=".repeat(game.name.length)}</div>
                  <div className="border-border flex justify-between border-b py-1">
                     <span className="text-fg-dim min-w-30 text-xs tracking-wider">STATUS</span>
                     <span className={game.status === "installed" ? "text-accent" : "text-fg-dim"}>{game.status.toUpperCase()}</span>
                  </div>
                  <div className="border-border flex justify-between border-b py-1">
                     <span className="text-fg-dim min-w-30 text-xs tracking-wider">PLAYTIME</span>
                     <span>{game.hours} hours</span>
                  </div>
                  <div className="border-border flex justify-between border-b py-1">
                     <span className="text-fg-dim min-w-30 text-xs tracking-wider">LAST PLAYED</span>
                     <span>{game.lastPlayed}</span>
                  </div>
                  <div className="border-border flex justify-between border-b py-1">
                     <span className="text-fg-dim min-w-30 text-xs tracking-wider">SIZE</span>
                     <span>{game.size}</span>
                  </div>
                  <div className="mt-4">
                     <span className="text-fg-dim text-xs tracking-wider">HOURS BAR</span>
                     <div className="bg-border mt-1 h-2 overflow-hidden">
                        <div
                           className="bg-accent h-full"
                           style={{
                              width: `${Math.min(100, (game.hours / maxHours) * 100)}%`,
                           }}
                        />
                     </div>
                  </div>
                  <div className="mt-5">
                     <button
                        className="border-border text-fg hover:border-accent hover:text-accent cursor-pointer border px-4 py-1.5 tracking-wider"
                        onClick={() => {
                           if (game.status === "installed") {
                              window.open(`steam://rungameid/${game.id}`);
                           } else {
                              window.open(`steam://install/${game.id}`);
                           }
                        }}
                     >
                        {game.status === "installed" ? "[ LAUNCH ]" : "[ INSTALL ]"}
                     </button>
                  </div>
               </>
            ) : (
               <div className="text-fg-dim pt-10">{">"} Select a game from the list</div>
            )}
         </div>
      </div>
   );
}
