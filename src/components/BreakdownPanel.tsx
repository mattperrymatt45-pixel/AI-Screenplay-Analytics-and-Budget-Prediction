import { ExtractedFeatures, CastTier } from '../types';

interface BreakdownPanelProps {
  features: ExtractedFeatures;
}

function Row({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between py-2.5 border-b border-line-light last:border-0">
      <span className="text-xs text-dim uppercase tracking-wider">{label}</span>
      <div className="text-right">
        <span className="text-sm text-bright">{value}</span>
        {sub && <span className="text-[11px] text-muted block">{sub}</span>}
      </div>
    </div>
  );
}

const TIER_LABELS: Record<CastTier, { label: string; color: string }> = {
  lead:       { label: 'LEAD',       color: 'text-accent' },
  supporting: { label: 'SUPPORTING', color: 'text-heading' },
  featured:   { label: 'FEATURED',   color: 'text-body' },
  day_player: { label: 'DAY PLAYER', color: 'text-muted' },
};

export default function BreakdownPanel({ features: f }: BreakdownPanelProps) {
  return (
    <div className="space-y-8">
      {/* Script overview */}
      <section>
        <h3 className="text-[10px] text-accent uppercase tracking-[0.2em] mb-3">Script Overview</h3>
        <div className="border border-line rounded">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-line">
            {[
              { l: 'Pages', v: f.estimatedPages },
              { l: 'Scenes', v: f.totalScenes },
              { l: 'Locations', v: f.uniqueLocations },
              { l: 'Roles', v: f.speakingRoles },
            ].map(({ l, v }) => (
              <div key={l} className="px-4 py-4 text-center">
                <p className="text-2xl text-bright font-bold">{v}</p>
                <p className="text-[10px] text-dim uppercase tracking-widest mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-[10px] text-accent uppercase tracking-[0.2em] mb-3">Scene Breakdown</h3>
          <div className="border border-line rounded px-4">
            <Row label="Interior" value={f.interiorCount} />
            <Row label="Exterior" value={f.exteriorCount} />
            <Row label="Int/Ext" value={f.intExtCount} />
            <Row label="Night Scenes" value={`${Math.round(f.nightSceneRatio * 100)}%`} sub={f.nightSceneRatio > 0.4 ? 'heavy night schedule' : 'standard'} />
            <Row label="Stunt Pages" value={f.stuntPages} sub={f.stuntPages > 5 ? 'high action' : f.stuntPages > 0 ? 'moderate' : 'low'} />
            <Row label="VFX Pages" value={f.vfxPages} sub={`${f.vfxKeywords.length} indicators`} />
          </div>
        </div>

        <div>
          <h3 className="text-[10px] text-accent uppercase tracking-[0.2em] mb-3">Script Analysis</h3>
          <div className="border border-line rounded px-4">
            <Row label="Genre" value={f.genre} sub={f.subGenres.length > 0 ? f.subGenres.join(', ') : `${Math.round(f.genreConfidence * 100)}% conf.`} />
            <Row label="Period" value={f.periodSetting} sub={`${Math.round(f.periodConfidence * 100)}% conf.`} />
            <Row label="Dialogue" value={`${Math.round(f.dialogueRatio * 100)}%`} sub={f.dialogueRatio > 0.6 ? 'dialogue-heavy' : f.dialogueRatio < 0.4 ? 'action-heavy' : 'balanced'} />
            <Row label="Action" value={`${Math.round(f.actionRatio * 100)}%`} />
            <Row label="Avg Dialogue" value={`${f.averageDialogueLength} words`} />
            <Row label="Countries" value={f.detectedCountries.length || 0} sub={f.detectedCountries.slice(0, 3).join(', ') || 'none detected'} />
          </div>
        </div>
      </section>

      {/* Cast Breakdown */}
      {f.castBreakdown.length > 0 && (
        <section>
          <h3 className="text-[10px] text-accent uppercase tracking-[0.2em] mb-3">Cast Breakdown</h3>
          <div className="border border-line rounded overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-2 border-b border-line text-[10px] text-dim uppercase tracking-wider">
              <span className="w-4">#</span>
              <span>Character</span>
              <span className="w-14 text-right">Lines</span>
              <span className="w-14 text-right">Scenes</span>
              <span className="w-20 text-center">Tier</span>
            </div>
            {/* Rows */}
            {f.castBreakdown.slice(0, 15).map((ch, i) => {
              const t = TIER_LABELS[ch.tier];
              return (
                <div key={i} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 items-center px-4 py-2 border-b border-line-light last:border-0">
                  <span className="text-[11px] text-muted w-4 text-right tabular-nums">{i + 1}</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-heading uppercase tracking-wide truncate">{ch.name}</span>
                    <span className="text-[10px] text-muted tabular-nums">{ch.percentOfDialogue}%</span>
                  </div>
                  <span className="text-xs text-body tabular-nums w-14 text-right">{ch.lineCount}</span>
                  <span className="text-xs text-body tabular-nums w-14 text-right">{ch.sceneCount}</span>
                  <span className={`text-[10px] ${t.color} w-20 text-center uppercase tracking-wider`}>{t.label}</span>
                </div>
              );
            })}
            {f.castBreakdown.length > 15 && (
              <div className="px-4 py-2 border-t border-line">
                <span className="text-[11px] text-muted">
                  + {f.castBreakdown.length - 15} additional roles
                </span>
              </div>
            )}
          </div>
          {/* Tier summary */}
          <div className="grid grid-cols-4 gap-px bg-line rounded overflow-hidden mt-3">
            {(['lead', 'supporting', 'featured', 'day_player'] as const).map(tier => {
              const members = f.castBreakdown.filter(c => c.tier === tier);
              const t = TIER_LABELS[tier];
              return (
                <div key={tier} className="bg-surface px-3 py-2 text-center">
                  <p className="text-sm text-bright font-bold">{members.length}</p>
                  <p className={`text-[9px] ${t.color} uppercase tracking-widest`}>{t.label}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* VFX keywords */}
      {f.vfxKeywords.length > 0 && (
        <section>
          <h3 className="text-[10px] text-accent uppercase tracking-[0.2em] mb-3">VFX Indicators</h3>
          <div className="flex flex-wrap gap-2">
            {f.vfxKeywords.map((kw, i) => (
              <span key={i} className="px-2 py-0.5 text-[11px] text-body border border-line rounded">{kw}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
