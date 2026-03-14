import type { SteamUser } from "../types";

type UsersViewProps = {
   users: Record<string, SteamUser>;
};

export function UsersView({ users }: UsersViewProps) {
   return (
      <div className="flex flex-1 flex-col overflow-hidden">
         <div className="bg-bg-panel border-border text-fg-dim shrink-0 border-b px-3 py-1.5 text-[11px] font-bold tracking-widest">STEAM USERS</div>
         <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
            {Object.keys(users).length === 0 ? (
               <div className="text-fg-dim">Loading user data...</div>
            ) : (
               Object.entries(users).map(([id, user]) => (
                  <div key={id} className="border-border border px-4 py-3">
                     <div className="border-border flex justify-between border-b py-1">
                        <span className="text-fg-dim min-w-30 text-xs tracking-wider">STEAM ID</span>
                        <span>{id}</span>
                     </div>
                     <div className="border-border flex justify-between border-b py-1">
                        <span className="text-fg-dim min-w-30 text-xs tracking-wider">ACCOUNT</span>
                        <span>{user.AccountName}</span>
                     </div>
                     <div className="border-border flex justify-between border-b py-1">
                        <span className="text-fg-dim min-w-30 text-xs tracking-wider">PERSONA</span>
                        <span className="text-accent">{user.PersonaName}</span>
                     </div>
                     <div className="border-border flex justify-between border-b py-1">
                        <span className="text-fg-dim min-w-30 text-xs tracking-wider">MOST RECENT</span>
                        <span>{user.MostRecent === "1" ? "YES" : "NO"}</span>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}
