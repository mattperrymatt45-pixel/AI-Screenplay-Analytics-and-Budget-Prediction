export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-accent text-lg tracking-tight">■</span>
          <div>
            <h1 className="text-bright text-sm font-bold tracking-widest uppercase">ScriptBudget</h1>
            <p className="text-dim text-[10px] tracking-wider uppercase mt-0.5">screenplay budget estimator</p>
          </div>
        </div>
        <span className="text-[10px] text-muted tracking-wider uppercase hidden sm:block">v1.0 — heuristic model</span>
      </div>
    </header>
  );
}
