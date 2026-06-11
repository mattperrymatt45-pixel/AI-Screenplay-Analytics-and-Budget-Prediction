import * as XLSX from 'xlsx';
import { FullReport } from '../types';

function pct(v: number): string {
  return `${Math.round(v * 100)}%`;
}

export function exportReportToExcel(report: FullReport) {
  const wb = XLSX.utils.book_new();
  const { features: f, estimates, totalBudget, comps, warnings } = report;

  // ─── 1. SUMMARY ──────────────────────────────────────────────────
  const summaryRows: (string | number)[][] = [
    ['SCRIPTBUDGET — BUDGET ESTIMATION REPORT'],
    [],
    ['Script Title', report.scriptTitle],
    ['Report Date', new Date(report.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
    ['Report Time', new Date(report.timestamp).toLocaleTimeString('en-US')],
    [],
    ['TOTAL ESTIMATED BUDGET', totalBudget],
    [],
    ['SCRIPT OVERVIEW'],
    ['Detected Genre', f.genre],
    ['Sub-Genres', f.subGenres.length > 0 ? f.subGenres.join(', ') : 'None'],
    ['Genre Confidence', pct(f.genreConfidence)],
    ['Estimated Pages', f.estimatedPages],
    ['Total Scenes', f.totalScenes],
    ['Period Setting', f.periodSetting.charAt(0).toUpperCase() + f.periodSetting.slice(1)],
    ['Period Confidence', pct(f.periodConfidence)],
    ['Speaking Roles', f.speakingRoles],
    ['Unique Locations', f.uniqueLocations],
    ['Dialogue Ratio', pct(f.dialogueRatio)],
    ['Action Ratio', pct(f.actionRatio)],
    ['Night Scene Ratio', pct(f.nightSceneRatio)],
    ['Avg Dialogue Length (words)', f.averageDialogueLength],
    [],
    ['SCENE BREAKDOWN'],
    ['Interior Scenes', f.interiorCount],
    ['Exterior Scenes', f.exteriorCount],
    ['INT/EXT Scenes', f.intExtCount],
    ['Stunt-Heavy Pages', f.stuntPages],
    ['VFX-Heavy Pages', f.vfxPages],
    [],
    ['COUNTRIES DETECTED', f.detectedCountries.length > 0 ? f.detectedCountries.join(', ') : 'None'],
    ['VFX INDICATORS', f.vfxKeywords.length > 0 ? f.vfxKeywords.join(', ') : 'None'],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 30 }, { wch: 50 }];
  // Currency format for budget cell
  const budgetCell = wsSummary['B7'];
  if (budgetCell) budgetCell.z = '$#,##0';
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // ─── 2. BUDGET BREAKDOWN ─────────────────────────────────────────
  const budgetHeader = ['Category', 'Type', 'Estimate', 'Description'];
  const budgetData: (string | number)[][] = [budgetHeader];

  const aboveTheLine = estimates.slice(0, 5);
  const belowTheLine = estimates.slice(5);

  budgetData.push(['── ABOVE THE LINE ──', '', '', '']);
  aboveTheLine.forEach(e => {
    budgetData.push([e.category, 'Above the Line', e.estimate, e.description]);
  });
  const atlTotal = aboveTheLine.reduce((s, e) => s + e.estimate, 0);
  budgetData.push(['  Subtotal (Above the Line)', '', atlTotal, '']);

  budgetData.push(['', '', '', '']);
  budgetData.push(['── BELOW THE LINE ──', '', '', '']);
  belowTheLine.forEach(e => {
    budgetData.push([e.category, 'Below the Line', e.estimate, e.description]);
  });
  const btlTotal = belowTheLine.reduce((s, e) => s + e.estimate, 0);
  budgetData.push(['  Subtotal (Below the Line)', '', btlTotal, '']);

  budgetData.push(['', '', '', '']);
  budgetData.push(['GRAND TOTAL', '', totalBudget, '']);

  const wsBudget = XLSX.utils.aoa_to_sheet(budgetData);
  wsBudget['!cols'] = [{ wch: 32 }, { wch: 16 }, { wch: 20 }, { wch: 50 }];
  // Currency format for estimate column (C, index 2)
  const budgetRange = XLSX.utils.decode_range(wsBudget['!ref'] || 'A1');
  for (let r = 1; r <= budgetRange.e.r; r++) {
    const ref = XLSX.utils.encode_cell({ r, c: 2 });
    const cell = wsBudget[ref];
    if (cell && typeof cell.v === 'number') cell.z = '$#,##0';
  }
  XLSX.utils.book_append_sheet(wb, wsBudget, 'Budget Breakdown');

  // ─── 3. CAST BREAKDOWN ─────────────────────────────────────────
  const charData: (string | number)[][] = [
    ['Rank', 'Character Name', 'Tier', 'Lines', 'Scenes', '% of Dialogue'],
  ];
  f.castBreakdown.forEach((ch, i) => {
    charData.push([
      i + 1, ch.name, ch.tier.replace('_', ' ').toUpperCase(),
      ch.lineCount, ch.sceneCount,
      `${ch.percentOfDialogue}%`,
    ]);
  });
  charData.push([]);
  charData.push(['Total Speaking Roles', f.speakingRoles]);
  charData.push(['Leads', f.castBreakdown.filter(c => c.tier === 'lead').length]);
  charData.push(['Supporting', f.castBreakdown.filter(c => c.tier === 'supporting').length]);
  charData.push(['Featured', f.castBreakdown.filter(c => c.tier === 'featured').length]);
  charData.push(['Day Players', f.castBreakdown.filter(c => c.tier === 'day_player').length]);

  const wsChars = XLSX.utils.aoa_to_sheet(charData);
  wsChars['!cols'] = [
    { wch: 6 }, { wch: 25 }, { wch: 14 }, { wch: 8 }, { wch: 8 }, { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, wsChars, 'Cast Breakdown');

  // ─── 4. COMPARABLE TITLES ────────────────────────────────────────
  const compsData: (string | number)[][] = [
    ['Rank', 'Title', 'Year', 'Genre', 'Budget', 'Similarity', 'Locations', 'Cast', 'VFX', 'Stunts', 'Period', 'Dialogue %'],
  ];
  comps.forEach((c, i) => {
    compsData.push([
      i + 1, c.title, c.year, c.genre, c.budget,
      `${Math.round(c.similarity * 100)}%`,
      c.features.uniqueLocations ?? '', c.features.speakingRoles ?? '',
      c.features.vfxPages !== undefined ? `${c.features.vfxPages}/10` : '',
      c.features.stuntPages !== undefined ? `${c.features.stuntPages}/10` : '',
      c.features.periodSetting ?? '',
      c.features.dialogueRatio !== undefined ? pct(c.features.dialogueRatio) : '',
    ]);
  });
  compsData.push([]);
  compsData.push(['Your Script', '', '', f.genre, totalBudget, '', f.uniqueLocations, f.speakingRoles, f.vfxPages, f.stuntPages, f.periodSetting, pct(f.dialogueRatio)]);

  const wsComps = XLSX.utils.aoa_to_sheet(compsData);
  wsComps['!cols'] = [
    { wch: 6 }, { wch: 36 }, { wch: 8 }, { wch: 12 }, { wch: 18 },
    { wch: 12 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 14 }, { wch: 12 },
  ];
  const compsRange = XLSX.utils.decode_range(wsComps['!ref'] || 'A1');
  for (let r = 1; r <= compsRange.e.r; r++) {
    const ref = XLSX.utils.encode_cell({ r, c: 4 });
    const cell = wsComps[ref];
    if (cell && typeof cell.v === 'number') cell.z = '$#,##0';
  }
  XLSX.utils.book_append_sheet(wb, wsComps, 'Comparable Titles');

  // ─── 5. WARNINGS ─────────────────────────────────────────────────
  if (warnings.length > 0) {
    const warnData: (string | number)[][] = [['#', 'Warning']];
    warnings.forEach((w, i) => warnData.push([i + 1, w]));
    const wsWarn = XLSX.utils.aoa_to_sheet(warnData);
    wsWarn['!cols'] = [{ wch: 5 }, { wch: 100 }];
    XLSX.utils.book_append_sheet(wb, wsWarn, 'Warnings');
  }

  // ─── 6. RAW FEATURES ─────────────────────────────────────────────
  const rawData: (string | number | string[])[][] = [
    ['Feature', 'Value'],
    ['totalScenes', f.totalScenes], ['uniqueLocations', f.uniqueLocations],
    ['interiorCount', f.interiorCount], ['exteriorCount', f.exteriorCount],
    ['intExtCount', f.intExtCount], ['detectedCountries', f.detectedCountries.join(', ')],
    ['speakingRoles', f.speakingRoles], ['stuntPages', f.stuntPages],
    ['vfxPages', f.vfxPages], ['vfxKeywords', f.vfxKeywords.join(', ')],
    ['periodSetting', f.periodSetting], ['periodConfidence', f.periodConfidence],
    ['dialogueRatio', f.dialogueRatio], ['actionRatio', f.actionRatio],
    ['estimatedPages', f.estimatedPages], ['genre', f.genre],
    ['subGenres', f.subGenres.join(', ')],
    ['genreConfidence', f.genreConfidence], ['nightSceneRatio', f.nightSceneRatio],
    ['averageDialogueLength', f.averageDialogueLength],
    ['characterNames', f.characterNames.join(', ')],
  ];
  const wsRaw = XLSX.utils.aoa_to_sheet(rawData);
  wsRaw['!cols'] = [{ wch: 25 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, wsRaw, 'Raw Features');

  // ─── DOWNLOAD ─────────────────────────────────────────────────────
  const safeTitle = report.scriptTitle.replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, '_');
  XLSX.writeFile(wb, `${safeTitle}_Budget_Report.xlsx`);
}
