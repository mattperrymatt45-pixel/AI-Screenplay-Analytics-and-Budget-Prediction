interface WarningsPanelProps {
  warnings: string[];
}

export default function WarningsPanel({ warnings }: WarningsPanelProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-2">
      {warnings.map((warning, i) => (
        <div key={i} className="px-4 py-3 border border-line rounded text-xs text-body leading-relaxed anim-in"
          style={{ animationDelay: `${i * 0.05}s` }}>
          {warning}
        </div>
      ))}
    </div>
  );
}
