import { useEffect, useState } from "react";

import { electrobun } from "../main";

export function SettingsView() {
   const [apiKey, setApiKey] = useState("");
   const [saved, setSaved] = useState(false);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      electrobun.rpc?.request("getSteamApiKey").then((res) => {
         if (res?.key) setApiKey(res.key);
         setLoading(false);
      });
   }, []);

   const handleSave = async () => {
      await electrobun.rpc?.request("setSteamApiKey", { key: apiKey });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
   };

   if (loading) return <div className="text-fg-dim p-6">Loading...</div>;

   return (
      <div className="flex-1 overflow-y-auto p-6">
         <h2 className="text-accent mb-4 text-sm font-bold tracking-widest uppercase">Settings</h2>
         <div className="max-w-md space-y-3">
            <label className="text-fg-dim block text-xs tracking-wider uppercase">Steam API Key</label>
            <input
               type="password"
               value={apiKey}
               onChange={(e) => setApiKey(e.target.value)}
               placeholder="Enter your Steam API key"
               className="border-border bg-bg-hover text-fg focus:border-accent w-full border px-3 py-2 text-sm outline-none"
            />
            <p className="text-fg-dim text-xs">
               Get your key from <span className="text-accent">https://steamcommunity.com/dev/apikey</span>
            </p>
            <button
               onClick={handleSave}
               className="border-border hover:bg-bg-hover text-fg-dim hover:text-fg cursor-pointer border px-4 py-1.5 text-xs tracking-wider uppercase"
            >
               {saved ? "SAVED ✓" : "SAVE"}
            </button>
         </div>
      </div>
   );
}
