import { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import BreakdownPanel from './components/BreakdownPanel';
import BudgetPanel from './components/BudgetPanel';
import CompsPanel from './components/CompsPanel';
import WarningsPanel from './components/WarningsPanel';
import { predict, predictFromFile } from './lib/pipeline';
import { exportReportToExcel } from './lib/excelExport';
import { FullReport } from './types';

type TabId = 'breakdown' | 'budget' | 'comps';

function fmt(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

export default function App() {
  const [report, setReport] = useState<FullReport | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('breakdown');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleFileContent = useCallback((content: string, filename: string) => {
    setIsProcessing(true); setReport(null); setError(null);
    setTimeout(() => {
      try { setReport(predict(content, filename)); setActiveTab('breakdown'); }
      catch { setError('Could not parse script. Check format.'); }
      finally { setIsProcessing(false); }
    }, 800);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true); setReport(null); setError(null);
    try { setReport(await predictFromFile(file)); setActiveTab('breakdown'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Error processing file.'); }
    finally { setIsProcessing(false); }
  }, []);

  const handleReset = useCallback(() => { setReport(null); setError(null); }, []);

  const handleExcel = useCallback(() => {
    if (report) { exportReportToExcel(report); setShowExport(false); }
  }, [report]);

  const handleJSON = useCallback(() => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${report.scriptTitle.replace(/\s+/g, '_')}_report.json`;
    a.click(); URL.revokeObjectURL(url); setShowExport(false);
  }, [report]);

  return (
    <div className="min-h-screen bg-page">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!report && !isProcessing ? (
          <div className="max-w-xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-10 pt-6 space-y-4">
              <p className="text-[10px] text-accent uppercase tracking-[0.25em]">screenplay budget estimator</p>
              <h2 className="text-2xl text-bright tracking-tight leading-snug">
                Upload a script.<br />Get a budget.
              </h2>
              <p className="text-xs text-body leading-relaxed max-w-sm mx-auto">
                Parses .fountain, .fdx, .pdf, and .txt screenplays.
                Extracts features. Estimates costs. Finds comparable titles.
              </p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 border border-line rounded text-xs text-body">{error}</div>
            )}

            <FileUpload onFileContent={handleFileContent} onFileUpload={handleFileUpload} isProcessing={isProcessing} />

            {/* How it works */}
            <div className="mt-14 border-t border-line pt-8">
              <p className="text-[10px] text-dim uppercase tracking-[0.2em] text-center mb-6">process</p>
              <div className="grid grid-cols-3 gap-px bg-line rounded overflow-hidden">
                {[
                  { n: '01', t: 'Parse', d: 'Read screenplay format into structured elements' },
                  { n: '02', t: 'Extract', d: 'Identify scenes, cast, stunts, VFX, period, genre' },
                  { n: '03', t: 'Estimate', d: 'Apply industry rules for P10/P50/P90 ranges' },
                ].map(({ n, t, d }) => (
                  <div key={n} className="bg-surface p-4">
                    <span className="text-[10px] text-accent">{n}</span>
                    <p className="text-xs text-heading mt-1">{t}</p>
                    <p className="text-[11px] text-dim mt-1 leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : isProcessing && !report ? (
          <div className="max-w-xl mx-auto pt-6">
            <FileUpload onFileContent={handleFileContent} onFileUpload={handleFileUpload} isProcessing={true} />
          </div>
        ) : report ? (
          <div className="anim-in">
            {/* Report header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-line">
              <div>
                <p className="text-[10px] text-accent uppercase tracking-[0.2em] mb-1">analysis complete</p>
                <h2 className="text-lg text-bright uppercase tracking-wide">{report.scriptTitle}</h2>
                <p className="text-[11px] text-body mt-1">
                  {report.features.estimatedPages} pp · {report.features.genre}{report.features.subGenres.length > 0 ? ` / ${report.features.subGenres.slice(0, 2).join(' / ')}` : ''} · {report.features.totalScenes} scenes · est.&nbsp;
                  <span className="text-accent">{fmt(report.totalBudget)}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Export */}
                <div className="relative" ref={exportRef}>
                  <button onClick={() => setShowExport(!showExport)}
                    className="text-xs text-heading hover:text-bright border border-line hover:border-dim px-3 py-1.5 rounded transition-colors">
                    export {showExport ? '▴' : '▾'}
                  </button>
                  {showExport && (
                    <div className="absolute right-0 mt-1 w-44 bg-surface border border-line rounded overflow-hidden z-50 anim-in">
                      <button onClick={handleExcel}
                        className="w-full text-left px-3 py-2.5 text-xs text-heading hover:bg-raised hover:text-bright transition-colors">
                        Excel (.xlsx)
                      </button>
                      <button onClick={handleJSON}
                        className="w-full text-left px-3 py-2.5 text-xs text-heading hover:bg-raised hover:text-bright transition-colors border-t border-line-light">
                        JSON (.json)
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={handleReset}
                  className="text-xs text-accent hover:text-accent-dim px-3 py-1.5 border border-accent/30 hover:border-accent/50 rounded transition-colors">
                  new script
                </button>
              </div>
            </div>

            {/* Warnings */}
            {report.warnings.length > 0 && (
              <div className="mb-6"><WarningsPanel warnings={report.warnings} /></div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-line mb-6">
              {([
                { id: 'breakdown' as TabId, label: 'Breakdown' },
                { id: 'budget' as TabId, label: 'Budget' },
                { id: 'comps' as TabId, label: 'Comps' },
              ]).map(({ id, label }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors border-b -mb-px ${
                    activeTab === id
                      ? 'text-accent border-accent'
                      : 'text-dim border-transparent hover:text-body'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div key={activeTab} className="anim-in">
              {activeTab === 'breakdown' && <BreakdownPanel features={report.features} />}
              {activeTab === 'budget' && <BudgetPanel estimates={report.estimates} totalBudget={report.totalBudget} />}
              {activeTab === 'comps' && <CompsPanel comps={report.comps} predictedBudget={report.totalBudget} />}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-line text-center">
              <p className="text-[10px] text-muted tracking-wider">
                ScriptBudget v1.0 — heuristic model — estimates for demonstration only
              </p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
