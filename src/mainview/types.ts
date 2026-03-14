export type SteamUser = {
   AccountName: string;
   PersonaName: string;
   Timestamp: string;
   MostRecent: string;
};

export type Game = {
   id: number;
   name: string;
   hours: number;
   lastPlayed: string;
   size: string;
   status: string;
   owner: string;
   iconHash?: string;
};

export type SortKey = "name" | "hours" | "lastPlayed" | "size";

export type View = "library" | "user" | "settings";
