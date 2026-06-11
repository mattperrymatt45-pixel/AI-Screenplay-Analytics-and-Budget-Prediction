import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CostEstimate } from '../types';

interface BudgetPanelProps {
  estimates: CostEstimate[];
  totalBudget: number;
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

function fmtFull(v: number): string {
  return `$${v.toLocaleString()}`;
}

export default function BudgetPanel({ estimates, totalBudget }: BudgetPanelProps) {
  const aboveLine = estimates.slice(0, 5);
  const belowLine = estimates.slice(5);

  const chartData = estimates.map(e => ({
    name: e.category,
    estimate: e.estimate,
  }));

  return (
    <div className="space-y-8">
      {/* Total */}
      <section className="border border-line rounded">
        <div className="px-4 py-2 border-b border-line flex items-baseline justify-between">
          <span className="text-[10px] text-accent uppercase tracking-[0.2em]">Total Estimated Budget</span>
        </div>
        <div className="px-6 py-6 text-center">
          <p className="text-3xl text-bright font-bold tabular-nums">{fmtFull(totalBudget)}</p>
          <p className="text-xs text-dim mt-1">{fmt(totalBudget)}</p>
        </div>
      </section>

      {/* Chart */}
      <section>
        <h3 className="text-[10px] text-accent uppercase tracking-[0.2em] mb-3">Category Breakdown</h3>
        <div className="border border-line rounded p-4">
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10, fill: '#8b8b9a', fontFamily: 'Courier New' }} stroke="#2a2a32" />
                <YAxis type="category" dataKey="name" width={125} tick={{ fontSize: 10, fill: '#c8c8d4', fontFamily: 'Courier New' }} stroke="#2a2a32" />
                <Tooltip
                  formatter={(value: unknown) => [fmtFull(Number(value)), 'Estimate']}
                  contentStyle={{ background: '#17171c', border: '1px solid #2a2a32', borderRadius: '4px', fontSize: '11px', fontFamily: 'Courier New', color: '#e8e8ee' }}
                  cursor={{ fill: 'rgba(212,180,92,0.04)' }}
                />
                <Bar dataKey="estimate" radius={[0, 3, 3, 0]} fill="#d4b45c" opacity={0.55} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Line items */}
      <section className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Above the Line', sub: 'creative & acquisition', items: aboveLine },
          { title: 'Below the Line', sub: 'production & post', items: belowLine },
        ].map(({ title, sub, items }) => (
          <div key={title} className="border border-line rounded overflow-hidden">
            <div className="px-4 py-2.5 border-b border-line">
              <span className="text-xs text-heading uppercase tracking-wider">{title}</span>
              <span className="text-[10px] text-muted ml-2">— {sub}</span>
            </div>
            <div className="divide-y divide-line-light">
              {items.map((item, i) => (
                <div key={i} className="px-4 py-3 flex justify-between items-baseline gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-heading truncate">{item.category}</p>
                    <p className="text-[11px] text-muted truncate mt-0.5">{item.description}</p>
                  </div>
                  <span className="text-xs text-bright tabular-nums flex-shrink-0">{fmt(item.estimate)}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-line flex justify-between items-baseline">
              <span className="text-[10px] text-dim uppercase tracking-wider">Subtotal</span>
              <span className="text-xs text-accent tabular-nums font-bold">{fmt(items.reduce((s, e) => s + e.estimate, 0))}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
