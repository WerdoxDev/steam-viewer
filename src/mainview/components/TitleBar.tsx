type TitleBarProps = {
   installedCount: number;
   totalCount: number;
   totalHours: number;
};

export function TitleBar({ installedCount, totalCount, totalHours }: TitleBarProps) {
   return (
      <div className="bg-bg-panel border-border text-fg-bright flex shrink-0 items-center justify-between border-b px-3 py-1.5 font-bold tracking-[0.08em] select-none">
         <span>STEAM VIEWER v1.0</span>
         <span className="text-fg-dim text-xs font-normal">
            [{installedCount}/{totalCount} installed] [{totalHours.toLocaleString()} hrs total]
         </span>
      </div>
   );
}
