import { updateFormsJSONAfterSubmit } from '../../session/state/formsState';
import { saveSessionDataOnSubmit } from '../../session/storage/sessionDataStorage';
import { getAccessID } from '../../state/accessState';
import { updateConditionalDisplay } from '../../ui/conditional/scopeConditionalDisplay';
import { getFormFields, persistFormFields } from './formPersistence';
import { getJobTitleField, syncJobTitleDerivedData } from './jobTitleSync';

export function initFormSubmitListener(pagePath: string) {
  const forms = document.querySelectorAll<HTMLFormElement>('form');
  if (!forms.length) return;

  forms.forEach((form) => {
    const formFields = getFormFields(form);
    const jobTitleField = getJobTitleField(form);

    formFields.forEach((field) => {
      field.addEventListener('blur', () => {
        persistFormFields(form);
      });
    });

    if (jobTitleField) {
      jobTitleField.addEventListener('blur', () => {
        syncJobTitleDerivedData(form);
      });
    }

    form.addEventListener('submit', () => {
      syncJobTitleDerivedData(form);
      persistFormFields(form);

      const accessID = getAccessID();
      saveSessionDataOnSubmit(form, { accessID });

      const formKey = accessID === 'none' ? 'global' : accessID;
      updateFormsJSONAfterSubmit(pagePath, formKey);
      updateConditionalDisplay();
    });
  });
}
