import { RPCSchema } from "electrobun";

export type LibraryFolder = {
   path: string;
   label: string;
   totalsize: string;
   apps: Record<string, string>;
};

export type LibraryFoldersResponse = {
   folders: LibraryFolder[];
};

export type OwnedGamesResponse = {
   game_count?: number;
   games?: Array<{
      appid: number;
      name: string;
      playtime_forever: number;
      rtime_last_played: number;
      img_icon_url: string;
   }>;
};

export type WebviewRPCType = {
   // functions that execute in the main process
   bun: RPCSchema<{
      requests: {
         readLoginUsersVDF: { params: undefined; response: Record<string, any> };
         readLibraryFoldersVDF: { params: undefined; response: LibraryFoldersResponse };
         getOwnedGames: { params: { steamId: string }; response: OwnedGamesResponse };
         getSteamApiKey: { params: undefined; response: { key: string } };
         setSteamApiKey: { params: { key: string }; response: { success: boolean } };
      };
   }>;
   // functions that execute in the browser context
   webview: RPCSchema<{}>;
};
