import { initFormSubmitListener } from './lifecycle/formLifecycle';
import { addMarketoFormID } from './marketo';

export function indexForms() {
  return {
    initFormSubmitListener,
    addMarketoFormID,
  };
}
