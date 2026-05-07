import { saveFormFieldsOnSubmit } from '../../session/storage/formDataStorage';

export function getFormFields(form: HTMLFormElement) {
  return form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    'input[name], textarea[name], select[name]'
  );
}

export function persistFormFields(form: HTMLFormElement) {
  saveFormFieldsOnSubmit(form);
}
