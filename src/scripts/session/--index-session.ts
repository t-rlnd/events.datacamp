import { initAccessFromURL } from './access/access';
import { isProd, isStaging, onProd, onStaging } from './environment/environment';
import { initFormDataStorage, saveUserDataField } from './storage/formDataStorage';
import { initSessionDataStorage, saveSessionDataOnSubmit } from './storage/sessionDataStorage';
import { initFormsState } from './state/formsState';
import {
  getJobTitleTierKeywordConfig,
  type JobTitleTierKeywordConfig,
  updateJobTitleTierKeywordConfig,
} from './tier/jobTitleTier';
import {
  FORMS_STATE_STORAGE_KEY,
  PERSIST_FORM_STATE_ON_RELOAD,
  SAVED_USER_FIELDS,
  SESSION_DATA_FIELDS,
  SESSION_DATA_STORAGE_KEY,
  USER_DATA_STORAGE_KEY,
} from '../config/keys';

export type { JobTitleTierKeywordConfig };

export function indexSession() {
  return {
    initAccessFromURL,
    isProd,
    isStaging,
    onProd,
    onStaging,
    initFormDataStorage,
    saveUserDataField,
    initSessionDataStorage,
    saveSessionDataOnSubmit,
    initFormsState,
    PERSIST_FORM_STATE_ON_RELOAD,
    USER_DATA_STORAGE_KEY,
    SESSION_DATA_STORAGE_KEY,
    FORMS_STATE_STORAGE_KEY,
    SAVED_USER_FIELDS,
    SESSION_DATA_FIELDS,
    getJobTitleTierKeywordConfig,
    updateJobTitleTierKeywordConfig,
  };
}
