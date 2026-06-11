import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CompTitle } from '../types';

interface CompsPanelProps {
  comps: CompTitle[];
  predictedBudget: number;
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

export default function CompsPanel({ comps, predictedBudget }: CompsPanelProps) {
  const chartData = [
    { name: 'YOUR SCRIPT', budget: predictedBudget, yours: true },
    ...comps.map(c => ({
      name: c.title.length > 20 ? c.title.substring(0, 20) + '…' : c.title,
      budget: c.budget,
      yours: false,
    })),
  ];

  return (
    <div className="space-y-8">
      {/* Chart */}
      <section>
        <h3 className="text-[10px] text-accent uppercase tracking-[0.2em] mb-3">Budget Comparison</h3>
        <div className="border border-line rounded p-4">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#c8c8d4', fontFamily: 'Courier New' }} angle={-20} textAnchor="end" height={55} stroke="#2a2a32" />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#8b8b9a', fontFamily: 'Courier New' }} stroke="#2a2a32" />
                <Tooltip
                  formatter={(value: unknown) => [fmt(Number(value)), 'Budget']}
                  contentStyle={{ background: '#17171c', border: '1px solid #2a2a32', borderRadius: '4px', fontSize: '11px', fontFamily: 'Courier New', color: '#e8e8ee' }}
                  cursor={{ fill: 'rgba(212,180,92,0.04)' }}
                />
                <Bar dataKey="budget" radius={[3, 3, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.yours ? '#d4b45c' : '#8b8b9a'} opacity={entry.yours ? 0.85 : 0.35} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Comp table */}
      <section>
        <h3 className="text-[10px] text-accent uppercase tracking-[0.2em] mb-3">Comparable Titles</h3>
        <div className="border border-line rounded divide-y divide-line-light overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 text-[10px] text-dim uppercase tracking-wider border-b border-line">
            <span>Title</span>
            <span className="w-20 text-right">Budget</span>
            <span className="w-16 text-right">Match</span>
          </div>
          {comps.map((comp, i) => (
            <div key={i} className="px-4 py-3">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-baseline">
                <div>
                  <p className="text-xs text-heading">{comp.title}</p>
                  <p className="text-[11px] text-dim mt-0.5">{comp.year} · {comp.genre}</p>
                </div>
                <span className="text-xs text-body tabular-nums w-20 text-right">{fmt(comp.budget)}</span>
                <span className="text-xs text-accent tabular-nums w-16 text-right">{Math.round(comp.similarity * 100)}%</span>
              </div>
              {/* Feature tags */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {comp.features.uniqueLocations !== undefined && <Tag label="loc" value={comp.features.uniqueLocations} />}
                {comp.features.speakingRoles !== undefined && <Tag label="cast" value={comp.features.speakingRoles} />}
                {comp.features.vfxPages !== undefined && <Tag label="vfx" value={`${comp.features.vfxPages}/10`} />}
                {comp.features.stuntPages !== undefined && <Tag label="stunts" value={`${comp.features.stuntPages}/10`} />}
                {comp.features.periodSetting && <Tag label="period" value={comp.features.periodSetting} />}
                {comp.features.dialogueRatio !== undefined && <Tag label="dial" value={`${Math.round(comp.features.dialogueRatio * 100)}%`} />}
              </div>
              {/* Match bar */}
              <div className="mt-2.5 h-[2px] bg-line rounded-full overflow-hidden">
                <div className="h-full bg-accent/50 rounded-full" style={{ width: `${comp.similarity * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Tag({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="text-[11px]">
      <span className="text-muted">{label}</span>{' '}
      <span className="text-body">{value}</span>
    </span>
  );
}
