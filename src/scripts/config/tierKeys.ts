import type { JobTitleTierKeywordConfig } from '../session/tier/jobTitleTier';

/**
 * Quick tier map (for fast reading)
 * ---------------------------------
 * Red Flag:
 * - any match in redFlagKeywords => red-flag
 *
 * Tier 1 buckets:
 * - c-suite
 * - heads-vps
 * - upper-faculty
 *
 * Tier 2 buckets:
 * - leads-managers
 * - senior-ics
 * - lower-faculty
 *
 * Tier 3 buckets:
 * - juniors
 * - other
 */
export const TIER1_BUCKETS = ['c-suite', 'heads-vps', 'upper-faculty'] as const;
export const TIER2_BUCKETS = ['leads-managers', 'senior-ics', 'lower-faculty'] as const;
export const TIER3_BUCKETS = ['juniors', 'other'] as const;
export const EDUCATION_BODY_KEYWORDS = [
  'academician',
  'student',
  'etudiant',
  'estudiante',
  'phd',
  'teacher',
  'educator',
  'docent',
  'instructor',
  'lecturer',
  'professor',
  'fellow',
  'researcher',
  'postdoc',
  'alumni',
  'intern',
  'aspiring',
] as const;

export const DEFAULT_TIER_KEYWORDS: JobTitleTierKeywordConfig = {
  redFlagKeywords: [...EDUCATION_BODY_KEYWORDS],
  foundersOwnersKeywords: ['owner', 'founder'],
  foundersOwnersExcludeKeywords: ['product'],
  cSuiteKeywords: [
    'chief',
    'ceo',
    'cto',
    'coo',
    'cfo',
    'cio',
    'cmo',
    'cdo',
    'controller',
    'partner',
    'president',
  ],
  cSuiteCtoExcludeKeywords: ['ctor'],
  cSuiteCooExcludeKeywords: ['coor'],
  headsVpsKeywords: ['vp', 'head', 'director', 'senior manager', 'md'],
  leadsManagersKeywords: [
    'lead',
    'manager',
    'jefe',
    'principal',
    'staff',
    'mgr',
    'associate',
    'executive',
    'supervisor',
  ],
  leadsManagersExcludeKeywords: ['account'],
  seniorIcKeywords: ['senior', 'snr', 'sr'],
  juniorsKeywords: ['graduate', 'junior', 'assistan', 'entry', 'intern'],
  juniorsAssistantExcludeKeywords: ['exec'],
  upperFacultyKeywords: [
    'rector',
    'dean',
    'doyen',
    'decaan',
    'chancellor',
    'chair',
    'principal',
    'provost',
    'warden',
    'faculty',
  ],
  upperFacultyRectorExcludeKeywords: ['director'],
  lowerFacultyKeywords: ['fellow', 'professor', 'lecturer'],
};
