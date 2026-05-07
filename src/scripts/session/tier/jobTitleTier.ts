/**
 * README — Tier Logic (Job Title -> Tier)
 * =======================================
 *
 * Goal
 * ----
 * This module classifies a job title into a front-end tier:
 * - tier1
 * - tier2
 * - tier3
 * - red-flag
 * - unknown
 *
 * Decision pipeline
 * -----------------
 * 1) Job title normalization:
 *    - lowercase
 *    - accents removed
 *    - punctuation removed
 *    - whitespace normalized
 *
 * 2) Red-flag detection (highest priority):
 *    - If a red-flag keyword is detected, result is "red-flag"
 *    - This step runs before any other classification
 *
 * 3) Seniority detection (order matters):
 *    - founders-owners
 *    - c-suite
 *    - heads-vps
 *    - leads-managers
 *    - senior-ics
 *    - juniors
 *    - upper-faculty
 *    - lower-faculty
 *    - else: other
 *
 * 4) Seniority -> tier mapping:
 *    - tier1: c-suite, heads-vps, upper-faculty
 *    - tier2: leads-managers, senior-ics, lower-faculty
 *    - tier3: juniors, other
 *
 * Keyword customization
 * ---------------------
 * - Read config:
 *   getJobTitleTierKeywordConfig()
 *
 * - Partial update:
 *   updateJobTitleTierKeywordConfig({ redFlagKeywords: [...] })
 *
 * - Runtime (Webflow/console):
 *   window.dcTierLogic?.updateKeywords({ ... })
 *
 * Important notes
 * ---------------
 * - Matching is based on substring inclusion (`includes`).
 * - Seniority rule order is decisive (first matching rule wins).
 * - Updating keywords may change overall classification: test key cases.
 */
import { DEFAULT_TIER_KEYWORDS } from '../../config/tierKeys';
import { EDUCATION_BODY_KEYWORDS } from '../../config/tierKeys';

export type JobTitleTier = 'tier1' | 'tier2' | 'tier3' | 'red-flag' | 'unknown';
export type JobTitleCategory =
  | 'education-body'
  | 'red-flag'
  | 'founders-owners'
  | 'c-suite'
  | 'heads-vps'
  | 'leads-managers'
  | 'senior-ics'
  | 'juniors'
  | 'upper-faculty'
  | 'lower-faculty'
  | 'other'
  | 'unknown';
type SeniorityBucket =
  | 'founders-owners'
  | 'c-suite'
  | 'heads-vps'
  | 'leads-managers'
  | 'senior-ics'
  | 'juniors'
  | 'upper-faculty'
  | 'lower-faculty'
  | 'other';

export interface JobTitleTierKeywordConfig {
  redFlagKeywords: string[];
  foundersOwnersKeywords: string[];
  foundersOwnersExcludeKeywords: string[];
  cSuiteKeywords: string[];
  cSuiteCtoExcludeKeywords: string[];
  cSuiteCooExcludeKeywords: string[];
  headsVpsKeywords: string[];
  leadsManagersKeywords: string[];
  leadsManagersExcludeKeywords: string[];
  seniorIcKeywords: string[];
  juniorsKeywords: string[];
  juniorsAssistantExcludeKeywords: string[];
  upperFacultyKeywords: string[];
  upperFacultyRectorExcludeKeywords: string[];
  lowerFacultyKeywords: string[];
}

interface KeywordMatchers {
  cSuiteGeneralKeywords: string[];
  headsVpsGeneralKeywords: string[];
  leadsManagersGeneralKeywords: string[];
  seniorIcGeneralKeywords: string[];
  juniorsGeneralKeywords: string[];
  upperFacultyGeneralKeywords: string[];
}

interface SeniorityRule {
  bucket: SeniorityBucket;
  match: (title: string) => boolean;
}

function cloneConfig(config: JobTitleTierKeywordConfig): JobTitleTierKeywordConfig {
  return JSON.parse(JSON.stringify(config)) as JobTitleTierKeywordConfig;
}

function buildMatchers(config: JobTitleTierKeywordConfig): KeywordMatchers {
  return {
    cSuiteGeneralKeywords: config.cSuiteKeywords.filter(
      (keyword) => !['cto', 'coo'].includes(keyword)
    ),
    headsVpsGeneralKeywords: config.headsVpsKeywords.filter((keyword) => keyword !== 'md'),
    leadsManagersGeneralKeywords: config.leadsManagersKeywords.filter(
      (keyword) => keyword !== 'manager'
    ),
    seniorIcGeneralKeywords: config.seniorIcKeywords.filter((keyword) => keyword !== 'sr'),
    juniorsGeneralKeywords: config.juniorsKeywords.filter((keyword) => keyword !== 'assistan'),
    upperFacultyGeneralKeywords: config.upperFacultyKeywords.filter(
      (keyword) => keyword !== 'rector'
    ),
  };
}

let keywordConfig: JobTitleTierKeywordConfig = cloneConfig(DEFAULT_TIER_KEYWORDS);
let keywordMatchers: KeywordMatchers = buildMatchers(keywordConfig);

export function getJobTitleTierKeywordConfig(): JobTitleTierKeywordConfig {
  return cloneConfig(keywordConfig);
}

export function updateJobTitleTierKeywordConfig(
  overrides: Partial<JobTitleTierKeywordConfig>
): JobTitleTierKeywordConfig {
  keywordConfig = {
    ...keywordConfig,
    ...overrides,
  };
  keywordMatchers = buildMatchers(keywordConfig);
  return getJobTitleTierKeywordConfig();
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsAny(title: string, words: string[]): boolean {
  return words.some((word) => title.includes(word));
}

function containsWithExclusion(title: string, includes: string[], excludes: string[]): boolean {
  return containsAny(title, includes) && !containsAny(title, excludes);
}

function getSeniorityRules(): SeniorityRule[] {
  return [
    {
      bucket: 'founders-owners',
      match: (title) =>
        containsWithExclusion(
          title,
          keywordConfig.foundersOwnersKeywords,
          keywordConfig.foundersOwnersExcludeKeywords
        ),
    },
    {
      bucket: 'c-suite',
      match: (title) =>
        containsAny(title, keywordMatchers.cSuiteGeneralKeywords) ||
        containsWithExclusion(title, ['cto'], keywordConfig.cSuiteCtoExcludeKeywords) ||
        containsWithExclusion(title, ['coo'], keywordConfig.cSuiteCooExcludeKeywords),
    },
    {
      bucket: 'heads-vps',
      match: (title) =>
        containsAny(title, keywordMatchers.headsVpsGeneralKeywords) ||
        title === 'md' ||
        (title.includes('senior') && title.includes('manager')),
    },
    {
      bucket: 'leads-managers',
      match: (title) =>
        containsAny(title, keywordMatchers.leadsManagersGeneralKeywords) ||
        containsWithExclusion(title, ['manager'], keywordConfig.leadsManagersExcludeKeywords),
    },
    {
      bucket: 'senior-ics',
      match: (title) =>
        containsAny(title, keywordMatchers.seniorIcGeneralKeywords) || /\bsr\.?\b/.test(title),
    },
    {
      bucket: 'juniors',
      match: (title) =>
        containsAny(title, keywordMatchers.juniorsGeneralKeywords) ||
        containsWithExclusion(title, ['assistan'], keywordConfig.juniorsAssistantExcludeKeywords),
    },
    {
      bucket: 'upper-faculty',
      match: (title) =>
        containsWithExclusion(title, ['rector'], keywordConfig.upperFacultyRectorExcludeKeywords) ||
        containsAny(title, keywordMatchers.upperFacultyGeneralKeywords),
    },
    {
      bucket: 'lower-faculty',
      match: (title) => containsAny(title, keywordConfig.lowerFacultyKeywords),
    },
  ];
}

function getSeniority(title: string): SeniorityBucket {
  const matchingRule = getSeniorityRules().find((rule) => rule.match(title));
  return matchingRule?.bucket ?? 'other';
}

function analyzeTitle(jobTitle: string) {
  if (!jobTitle || !jobTitle.trim()) return null;
  const title = normalizeTitle(jobTitle);
  if (!title) return null;

  const isEducationBody = containsAny(title, [...EDUCATION_BODY_KEYWORDS]);
  const isRedFlag = containsAny(title, keywordConfig.redFlagKeywords);
  const seniority = getSeniority(title);

  return { isEducationBody, isRedFlag, seniority };
}

export function getTierCategoryFromJobTitle(jobTitle: string): JobTitleCategory {
  const analysis = analyzeTitle(jobTitle);
  if (!analysis) return 'unknown';

  if (analysis.isEducationBody) return 'education-body';
  if (analysis.isRedFlag) return 'red-flag';
  return analysis.seniority;
}

export function getTierFromJobTitle(jobTitle: string): JobTitleTier {
  const analysis = analyzeTitle(jobTitle);
  if (!analysis) return 'unknown';

  if (analysis.isRedFlag) return 'red-flag';

  if (['c-suite', 'heads-vps', 'upper-faculty'].includes(analysis.seniority)) {
    return 'tier1';
  }

  if (['leads-managers', 'senior-ics', 'lower-faculty'].includes(analysis.seniority)) {
    return 'tier2';
  }

  return 'tier3';
}
