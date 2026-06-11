import { ParsedScript, ExtractedFeatures, FullReport } from '../types';
import { parseScript, parseScriptFromFile } from './parser';
import { extractFeatures } from './featureExtractor';
import { estimateCosts, computeTotalBudget } from './costEstimator';
import { findCompTitles } from './compTitles';

/**
 * Generate warnings based on extracted features
 */
function generateWarnings(features: ExtractedFeatures, parserWarning?: string): string[] {
  const warnings: string[] = [];

  // Add parser warning if present (e.g., PDF not looking like screenplay)
  if (parserWarning) {
    warnings.push(parserWarning);
  }

  // Terse script detection
  if (features.estimatedPages < 80 && features.actionRatio > 0.5) {
    warnings.push(
      '⚠️ Terse Script Warning: This script is under 80 pages with high action density. It may underestimate production complexity—action sequences often expand significantly during production.'
    );
  }

  // Anachronism detection
  if (features.periodSetting === 'contemporary') {
    const periodWords = ['telegram', 'cassette tape', 'typewriter', 'gramophone', 'quill', 'parchment', 'horse-drawn', 'gas lamp'];
    const found = features.vfxKeywords.length > 0
      ? periodWords.filter(w => features.vfxKeywords.some(vw => vw.includes(w)))
      : [];
    if (found.length > 0) {
      warnings.push(
        `⚠️ Anachronism Flag: Script is detected as contemporary but contains period-specific references (${found.join(', ')}). Verify the time period setting.`
      );
    }
  }

  // Very high VFX count
  if (features.vfxPages > 20) {
    warnings.push(
      '🎬 Heavy VFX Warning: This script contains extensive VFX requirements. Budget estimates for VFX may have high variance—consider getting specialized VFX vendor bids.'
    );
  }

  // Many locations
  if (features.uniqueLocations > 40) {
    warnings.push(
      '📍 Location Complexity: Over 40 unique locations detected. This significantly impacts scheduling and budget. Consider consolidating locations where possible.'
    );
  }

  // Large cast
  if (features.speakingRoles > 40) {
    warnings.push(
      '👥 Large Cast: Over 40 speaking roles detected. Casting, scheduling, and SAG compliance costs may be significant.'
    );
  }

  // Night scenes
  if (features.nightSceneRatio > 0.5) {
    warnings.push(
      '🌙 Night Shooting: Over 50% night scenes detected. Night shoots typically cost 20-30% more due to overtime, lighting, and crew scheduling.'
    );
  }

  // Multiple countries
  if (features.detectedCountries.length > 2) {
    warnings.push(
      `🌍 International Production: Multiple countries detected (${features.detectedCountries.join(', ')}). International productions require additional budgets for travel, permits, fixers, and local crews.`
    );
  }

  return warnings;
}

/**
 * Main prediction pipeline (synchronous, for text content)
 */
export function predict(content: string, filename: string): FullReport {
  // Stage 1: Parse
  const parsed: ParsedScript = parseScript(content, filename);

  // Stage 2: Extract Features
  const features: ExtractedFeatures = extractFeatures(parsed);

  // Stage 3: Estimate Costs
  const estimates = estimateCosts(features);
  const totalBudget = computeTotalBudget(estimates);

  // Stage 4: Find Comparable Titles
  const comps = findCompTitles(features, 5);

  // Stage 5: Generate Warnings
  const warnings = generateWarnings(features);

  return {
    scriptTitle: parsed.title || filename.replace(/\.[^/.]+$/, ''),
    features,
    estimates,
    totalBudget,
    comps,
    warnings,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Main prediction pipeline (async, handles File objects including PDFs)
 */
export async function predictFromFile(file: File): Promise<FullReport> {
  // Stage 1: Parse (async for PDF support)
  const { script: parsed, warning: parserWarning } = await parseScriptFromFile(file);

  // Stage 2: Extract Features
  const features: ExtractedFeatures = extractFeatures(parsed);

  // Stage 3: Estimate Costs
  const estimates = estimateCosts(features);
  const totalBudget = computeTotalBudget(estimates);

  // Stage 4: Find Comparable Titles
  const comps = findCompTitles(features, 5);

  // Stage 5: Generate Warnings
  const warnings = generateWarnings(features, parserWarning);

  return {
    scriptTitle: parsed.title || file.name.replace(/\.[^/.]+$/, ''),
    features,
    estimates,
    totalBudget,
    comps,
    warnings,
    timestamp: new Date().toISOString(),
  };
}
