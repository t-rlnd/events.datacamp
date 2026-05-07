import { getCurrentTier, getCurrentTierCategory } from '../../session/state/tierState';

function getKeys(value?: string): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function updateTierConditionalDisplay() {
  const currentTier = getCurrentTier();
  const currentCategory = getCurrentTierCategory();

  const applyConditionalDisplay = (
    selector: string,
    actionKey: string,
    keysKey: string,
    currentValue: string
  ) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      const action = el.dataset[actionKey];
      const keys = getKeys(el.dataset[keysKey]);

      if (!action || keys.length === 0) return;

      const conditionMet = keys.includes(currentValue);
      const shouldShow = (conditionMet && action === 'show') || (!conditionMet && action === 'hide');
      el.style.display = shouldShow ? 'flex' : 'none';
    });
  };

  // New tier attributes
  applyConditionalDisplay(
    '[data-dc-user-tier-conditional]',
    'dcUserTierAction',
    'dcUserTierKeys',
    currentTier
  );

  // New category attributes
  applyConditionalDisplay(
    '[data-dc-user-cat-conditional]',
    'dcUserCatAction',
    'dcUserCatKeys',
    currentCategory
  );

  // Backward compatibility during transition
  applyConditionalDisplay('[data-dc-tier-conditional]', 'dcTierAction', 'dcTierKeys', currentTier);
}
