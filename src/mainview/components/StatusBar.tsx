type StatusBarProps = {
   label: string;
};

export function StatusBar({ label }: StatusBarProps) {
   return (
      <div className="bg-bg-panel border-border flex shrink-0 justify-between border-t px-3 py-1 text-xs">
         <span>{label}</span>
         <span className="text-fg-dim">steam-viewer@1.0.0</span>
      </div>
   );
}
