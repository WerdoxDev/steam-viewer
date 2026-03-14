import { useEffect, useState } from "react";

export function LoadingScreen() {
   const [dots, setDots] = useState("");

   useEffect(() => {
      const id = setInterval(() => {
         setDots((d) => (d.length >= 3 ? "" : d + "."));
      }, 400);
      return () => clearInterval(id);
   }, []);

   return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
         <div className="text-fg-bright flex justify-center text-sm font-bold tracking-[0.15em]">
            <span className="invisible inline-block w-[3ch]" />
            LOADING
            <span className="inline-block w-[3ch] text-left">{dots}</span>
         </div>
         <div className="bg-border relative h-1.5 w-[200px] overflow-hidden">
            <div className="bg-accent animate-loading-slide absolute top-0 left-0 h-full w-2/5" />
         </div>
         <div className="text-fg-dim">Fetching library data</div>
      </div>
   );
}
