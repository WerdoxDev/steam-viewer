import { useEffect, useRef, useState } from "react";

import type { Game, SortKey, SteamUser, View } from "./types";

import { GameDetail } from "./components/GameDetail";
import { GameList } from "./components/GameList";
import { LoadingScreen } from "./components/LoadingScreen";
import { NavBar } from "./components/NavBar";
import { SettingsView } from "./components/SettingsView";
import { StatusBar } from "./components/StatusBar";
import { TitleBar } from "./components/TitleBar";
import { UsersView } from "./components/UsersView";
import { electrobun } from "./main";

function formatBytes(bytes: number): string {
   if (bytes < 1024) return `${bytes} B`;
   const units = ["KB", "MB", "GB", "TB"];
   let i = -1;
   let size = bytes;
   do {
      size /= 1024;
      i++;
   } while (size >= 1024 && i < units.length - 1);
   return `${size.toFixed(1)} ${units[i]}`;
}

function App() {
   const [users, setUsers] = useState<Record<string, SteamUser>>({});
   const [games, setGames] = useState<Game[]>([]);
   const [selectedGame, setSelectedGame] = useState<number | null>(null);
   const [view, setView] = useState<View>("library");
   const [sortKey, setSortKey] = useState<SortKey>("name");
   const [filterInstalled, setFilterInstalled] = useState(false);
   const [gameEntries, setGameEntries] = useState<Map<number, Game[]>>(new Map());
   const [isLoading, setIsLoading] = useState(true);
   const isFetching = useRef(false);

   useEffect(() => {
      if (isFetching.current) return;
      isFetching.current = true;
      console.log("Fetching user data...");

      Promise.all([electrobun.rpc?.request("readLoginUsersVDF"), electrobun.rpc?.request("readLibraryFoldersVDF")]).then(
         async ([data, libraryData]) => {
            if (data?.users) setUsers(data.users);

            // Build a map of appId -> size from library folders
            const installedApps = new Map<number, number>();
            if (libraryData?.folders) {
               for (const folder of libraryData.folders) {
                  for (const [appId, sizeStr] of Object.entries(folder.apps)) {
                     const id = Number(appId);
                     const size = Number(sizeStr);
                     installedApps.set(id, (installedApps.get(id) ?? 0) + size);
                  }
               }
            }

            const userIds = Object.keys(data?.users ?? {});
            const bestGames = new Map<number, Game>();
            const entriesByGame = new Map<number, Game[]>();

            for (const steamId of userIds) {
               try {
                  const persona = data?.users?.[steamId]?.PersonaName ?? steamId;
                  const res = await electrobun.rpc?.request("getOwnedGames", { steamId });
                  if (res?.games) {
                     for (const g of res.games) {
                        const hours = Math.round(g.playtime_forever / 60);
                        const lastPlayed = g.rtime_last_played ? new Date(g.rtime_last_played * 1000).toISOString().split("T")[0] : "Never";
                        const isInstalled = installedApps.has(g.appid);
                        const sizeBytes = installedApps.get(g.appid);
                        const sizeLabel = isInstalled && sizeBytes ? formatBytes(sizeBytes) : "\u2014";
                        const entry: Game = {
                           id: g.appid,
                           name: g.name,
                           hours,
                           lastPlayed,
                           size: sizeLabel,
                           status: isInstalled ? "installed" : "not installed",
                           owner: persona,
                           iconHash: g.img_icon_url || undefined,
                        };

                        const entries = entriesByGame.get(g.appid) ?? [];
                        entries.push(entry);
                        entriesByGame.set(g.appid, entries);

                        const existing = bestGames.get(g.appid);
                        if (!existing) {
                           bestGames.set(g.appid, { ...entry });
                        } else {
                           existing.hours += hours;
                           if (lastPlayed !== "Never" && (existing.lastPlayed === "Never" || lastPlayed > existing.lastPlayed)) {
                              existing.lastPlayed = lastPlayed;
                           }
                        }
                     }
                  }
               } catch (e) {
                  console.error(`Failed to fetch games for ${steamId}:`, e);
               }
            }

            setGames(Array.from(bestGames.values()));
            setGameEntries(entriesByGame);
            setIsLoading(false);
            isFetching.current = false;
         },
      );
   }, []);

   const sortedGames = [...games]
      .filter((g) => !filterInstalled || g.status === "installed")
      .sort((a, b) => {
         if (sortKey === "name") return a.name.localeCompare(b.name);
         if (sortKey === "hours") return b.hours - a.hours;
         if (sortKey === "lastPlayed") return b.lastPlayed.localeCompare(a.lastPlayed);
         if (sortKey === "size") return parseFloat(b.size) - parseFloat(a.size);
         return 0;
      });

   const active = games.find((g) => g.id === selectedGame);
   const totalHours = games.reduce((s, g) => s + g.hours, 0);
   const installedCount = games.filter((g) => g.status === "installed").length;
   const statusLabel = isLoading ? "> LOADING..." : view === "library" && active ? `> ${active.name}` : "> READY";

   return (
      <div className="flex h-screen flex-col overflow-hidden">
         <TitleBar installedCount={installedCount} totalCount={games.length} totalHours={totalHours} />
         <NavBar
            view={view}
            setView={setView}
            sortKey={sortKey}
            setSortKey={setSortKey}
            filterInstalled={filterInstalled}
            setFilterInstalled={setFilterInstalled}
         />
         <div className="flex flex-1 overflow-hidden">
            {isLoading ? (
               <LoadingScreen />
            ) : (
               <>
                  {view === "library" && (
                     <>
                        <GameList games={sortedGames} gameEntries={gameEntries} selectedGame={selectedGame} onSelect={setSelectedGame} />
                        <GameDetail game={active} maxHours={Math.max(...games.map((g) => g.hours), 1)} />
                     </>
                  )}
                  {view === "user" && <UsersView users={users} />}
                  {view === "settings" && <SettingsView />}
               </>
            )}
         </div>
         <StatusBar label={statusLabel} />
      </div>
   );
}

export default App;
