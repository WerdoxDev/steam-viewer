import { BrowserView, BrowserWindow, Updater } from "electrobun/bun";
import { join } from "node:path";
import vdf from "vdf-parser";

import { WebviewRPCType } from "../shared/types";

const CONFIG_DIR = join(Bun.env.APPDATA ?? Bun.env.HOME ?? ".", "steam-viewer");
const API_KEY_PATH = join(CONFIG_DIR, "api-key.txt");

async function loadApiKey(): Promise<string> {
   try {
      return (await Bun.file(API_KEY_PATH).text()).trim();
   } catch {
      return "";
   }
}

async function saveApiKey(key: string): Promise<void> {
   await Bun.write(API_KEY_PATH, key.trim());
}

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

// Check if Vite dev server is running for HMR
async function getMainViewUrl(): Promise<string> {
   const channel = await Updater.localInfo.channel();
   if (channel === "dev") {
      try {
         await fetch(DEV_SERVER_URL, { method: "HEAD" });
         console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
         return DEV_SERVER_URL;
      } catch {
         console.log("Vite dev server not running. Run 'bun run dev:hmr' for HMR support.");
      }
   }
   return "views://mainview/index.html";
}

// Create the main application window
const url = await getMainViewUrl();

const webviewRPC = BrowserView.defineRPC<WebviewRPCType>({
   maxRequestTime: 15000,
   handlers: {
      requests: {
         readLoginUsersVDF: async () => {
            const filePath = "C:\\Program Files (x86)\\Steam\\config\\loginusers.vdf";
            const content = await Bun.file(filePath).text();
            return await vdf.parse(content);
         },
         readLibraryFoldersVDF: async () => {
            const filePath = "C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf";
            const content = await Bun.file(filePath).text();
            const parsed = await vdf.parse(content);
            const raw = parsed?.libraryfolders ?? {};
            const folders = Object.keys(raw)
               .filter((k) => /^\d+$/.test(k))
               .map((k) => ({
                  path: raw[k].path ?? "",
                  label: raw[k].label ?? "",
                  totalsize: raw[k].totalsize ?? "0",
                  apps: raw[k].apps ?? {},
               }));
            return { folders };
         },
         getSteamApiKey: async () => {
            const key = await loadApiKey();
            return { key };
         },
         setSteamApiKey: async ({ key }: { key: string }) => {
            await saveApiKey(key);
            return { success: true };
         },
         getOwnedGames: async ({ steamId }: { steamId: string }) => {
            if (!/^\d+$/.test(steamId)) throw new Error("Invalid Steam ID");

            const apiKey = await loadApiKey();
            if (!apiKey) throw new Error("Steam API key not configured. Go to Settings to enter your key.");

            const url = new URL("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/");
            url.searchParams.set("key", apiKey);
            url.searchParams.set("steamid", steamId);
            url.searchParams.set("include_appinfo", "1");
            url.searchParams.set("include_played_free_games", "1");
            url.searchParams.set("format", "json");

            const res = await fetch(url);
            if (!res.ok) throw new Error(`Steam API error: ${res.status}`);
            const data = await res.json();
            return data.response;
         },
      },
   },
});

const mainWindow = new BrowserWindow({
   title: "Steam Viewer",
   url,
   frame: {
      width: 900,
      height: 700,
      x: 200,
      y: 200,
   },
   rpc: webviewRPC,
});

console.log("React Tailwind Vite app started!");
