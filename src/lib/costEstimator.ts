import { ExtractedFeatures, CostEstimate } from '../types';

/**
 * Rule-based cost estimation model.
 * Returns a single estimate per category derived from industry averages.
 */
export function estimateCosts(features: ExtractedFeatures): CostEstimate[] {
  const estimates: CostEstimate[] = [];

  // --- Above the Line ---

  estimates.push({
    category: 'Story & Rights',
    estimate: Math.round(features.periodSetting === 'period' ? 250000 : 100000),
    description: 'Script acquisition, underlying rights, options',
  });

  estimates.push({
    category: 'Screenplay',
    estimate: Math.round(150000 + (features.estimatedPages > 120 ? 50000 : 0)),
    description: 'Writer fees, rewrites, polishes',
  });

  estimates.push({
    category: 'Producer Fees',
    estimate: Math.round(300000 + (features.totalScenes > 80 ? 100000 : 0)),
    description: 'Line producer, executive producers, associate producers',
  });

  const directorComplexity = 1 + (features.vfxPages > 5 ? 0.3 : 0) + (features.stuntPages > 5 ? 0.2 : 0);
  estimates.push({
    category: 'Director',
    estimate: Math.round(500000 * directorComplexity),
    description: 'Director fee, based on complexity and scope',
  });

  const leadCastCount = Math.min(features.topCharacters.length, 5);
  const supportingCastCount = Math.max(features.speakingRoles - leadCastCount, 0);
  estimates.push({
    category: 'Cast',
    estimate: Math.round((leadCastCount * 500000) + (supportingCastCount * 50000) + (features.speakingRoles > 30 ? 500000 : 0)),
    description: `${leadCastCount} leads, ${supportingCastCount} supporting roles, day players`,
  });

  // --- Below the Line ---

  const crewSize = features.totalScenes > 60 ? 'large' : features.totalScenes > 30 ? 'medium' : 'small';
  estimates.push({
    category: 'Production Staff',
    estimate: crewSize === 'large' ? 2000000 : crewSize === 'medium' ? 1200000 : 600000,
    description: `${crewSize} crew based on scene count and complexity`,
  });

  estimates.push({
    category: 'Art Department',
    estimate: Math.round(
      500000
      + (features.uniqueLocations * 30000)
      + (features.periodSetting === 'period' ? 800000 : 0)
      + (features.periodSetting === 'futuristic' ? 600000 : 0)
    ),
    description: 'Production design, set construction, dressing, props',
  });

  estimates.push({
    category: 'Locations & Travel',
    estimate: Math.round(Math.max(
      (features.uniqueLocations * 40000)
      + (features.detectedCountries.length * 500000)
      + (features.exteriorCount * 5000)
      + (features.nightSceneRatio > 0.3 ? 200000 : 0),
      200000
    )),
    description: `${features.uniqueLocations} unique locations, ${features.detectedCountries.length} countries`,
  });

  estimates.push({
    category: 'Costumes & Wardrobe',
    estimate: Math.round(
      150000
      + (features.speakingRoles * 5000)
      + (features.periodSetting === 'period' ? 500000 : 0)
      + (features.periodSetting === 'futuristic' ? 300000 : 0)
    ),
    description: 'Period-appropriate wardrobe, specialty costumes',
  });

  estimates.push({
    category: 'Makeup & Hair',
    estimate: Math.round(
      100000
      + (features.periodSetting !== 'contemporary' ? 150000 : 0)
      + (features.vfxPages > 3 ? 100000 : 0)
      + (features.speakingRoles * 3000)
    ),
    description: 'Key makeup, prosthetics, specialty effects',
  });

  estimates.push({
    category: 'Camera & Lighting',
    estimate: Math.round(
      400000
      + (features.nightSceneRatio > 0.3 ? 200000 : 0)
      + (features.exteriorCount > 30 ? 150000 : 0)
    ),
    description: 'Camera package, grip, lighting equipment',
  });

  estimates.push({
    category: 'Sound',
    estimate: Math.round(200000 + (features.estimatedPages > 120 ? 50000 : 0)),
    description: 'Production sound, boom, wireless systems',
  });

  estimates.push({
    category: 'Stunts & Action',
    estimate: Math.round(features.stuntPages > 0 ? 200000 + (features.stuntPages * 80000) : 50000),
    description: `${features.stuntPages} stunt-heavy pages identified`,
  });

  estimates.push({
    category: 'Visual Effects',
    estimate: Math.round(features.vfxPages > 0 ? 500000 + (features.vfxPages * 200000) : 100000),
    description: `${features.vfxPages} VFX-heavy pages, ${features.vfxKeywords.length} VFX indicators`,
  });

  estimates.push({
    category: 'Music & Score',
    estimate: Math.round(300000 + (features.estimatedPages > 100 ? 100000 : 0)),
    description: 'Composer, orchestration, licensed music',
  });

  estimates.push({
    category: 'Post-Production',
    estimate: Math.round(
      500000
      + (features.vfxPages > 5 ? 300000 : 0)
      + (features.estimatedPages > 120 ? 100000 : 0)
    ),
    description: 'Editing, color grading, DI, sound mix, deliverables',
  });

  const subtotal = estimates.reduce((s, e) => s + e.estimate, 0);

  estimates.push({
    category: 'Insurance & Legal',
    estimate: Math.round(subtotal * 0.04),
    description: 'E&O insurance, completion bond, legal fees',
  });

  estimates.push({
    category: 'Contingency',
    estimate: Math.round(subtotal * 0.10),
    description: '10% contingency buffer for unforeseen costs',
  });

  return estimates;
}

export function computeTotalBudget(estimates: CostEstimate[]): number {
  return estimates.reduce((s, e) => s + e.estimate, 0);
}
