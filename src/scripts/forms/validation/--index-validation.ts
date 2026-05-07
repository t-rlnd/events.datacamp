import { initEmailValidation } from './emailField/emailValidation';
import { initPhoneFields } from './phoneField/phoneField';
import { initPhoneValidation } from './phoneField/phoneValidation';

export function indexValidation() {
  function initAllValidation() {
    initPhoneFields();
    initPhoneValidation();
    initEmailValidation();
  }

  return { initAllValidation };
}
