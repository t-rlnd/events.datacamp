import { setCurrentTier, setCurrentTierCategory } from '../../session/state/tierState';
import { saveUserDataField } from '../../session/storage/formDataStorage';
import { getTierCategoryFromJobTitle, getTierFromJobTitle } from '../../session/tier/jobTitleTier';
import { updateTierConditionalDisplay } from '../../ui/conditional/tierConditionalDisplay';

export function getJobTitleField(form: HTMLFormElement) {
  return form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    '[name="jobTitle"]'
  );
}

export function syncJobTitleDerivedData(form: HTMLFormElement) {
  const jobTitleValue = getJobTitleField(form)?.value ?? '';
  const tier = getTierFromJobTitle(jobTitleValue);
  const category = getTierCategoryFromJobTitle(jobTitleValue);

  setCurrentTier(tier);
  setCurrentTierCategory(category);

  // Keep computed fields and source field synchronized in dc_user_data.
  saveUserDataField('jobTitle', jobTitleValue.trim());
  saveUserDataField('jobTitleTier', tier);
  saveUserDataField('jobTitleCategory', category);

  updateTierConditionalDisplay();
}
