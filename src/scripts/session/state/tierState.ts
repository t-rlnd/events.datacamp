import {
  getTierCategoryFromJobTitle,
  getTierFromJobTitle,
  type JobTitleCategory,
  type JobTitleTier,
} from '../tier/jobTitleTier';
import { USER_DATA_STORAGE_KEY } from '../../config/keys';

interface UserDataPayload {
  user: Record<string, string>;
}

const DEFAULT_STATE: UserDataPayload = {
  user: {},
};

function readState(): UserDataPayload {
  try {
    const raw = localStorage.getItem(USER_DATA_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<UserDataPayload>;
    if (!parsed.user || typeof parsed.user !== 'object') return DEFAULT_STATE;
    return { user: parsed.user as Record<string, string> };
  } catch {
    return DEFAULT_STATE;
  }
}

export function getCurrentTier(): JobTitleTier {
  const state = readState();
  const storedTier = state.user.jobTitleTier;
  if (storedTier) return storedTier as JobTitleTier;

  const storedJobTitle = state.user.jobTitle;
  if (!storedJobTitle) return 'unknown';

  const computedTier = getTierFromJobTitle(storedJobTitle);
  setCurrentTier(computedTier);
  return computedTier;
}

export function setCurrentTier(tier: JobTitleTier): void {
  const current = readState();
  const payload: UserDataPayload = {
    user: {
      ...current.user,
      jobTitleTier: tier,
    },
  };
  localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(payload));
}

export function getCurrentTierCategory(): JobTitleCategory {
  const state = readState();
  const storedCategory = state.user.jobTitleCategory;
  if (storedCategory) return storedCategory as JobTitleCategory;

  const storedJobTitle = state.user.jobTitle;
  if (!storedJobTitle) return 'unknown';

  const computedCategory = getTierCategoryFromJobTitle(storedJobTitle);
  setCurrentTierCategory(computedCategory);
  return computedCategory;
}

export function setCurrentTierCategory(category: JobTitleCategory): void {
  const current = readState();
  const payload: UserDataPayload = {
    user: {
      ...current.user,
      jobTitleCategory: category,
    },
  };
  localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(payload));
}
