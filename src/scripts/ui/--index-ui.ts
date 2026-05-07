import { initAccessButtons } from './access/accessButtons';
import { initAccessRadios } from './access/accessRadios';
import { updateConditionalDisplay } from './conditional/scopeConditionalDisplay';
import { initDropdowns } from './dropdowns/dropdowns';
import { initModals } from './modals/modals';
import { updateTierConditionalDisplay } from './conditional/tierConditionalDisplay';
import { addStagingPrefix } from './page/pageName';

export function indexUI() {
  return {
    initAccessButtons,
    initAccessRadios,
    updateConditionalDisplay,
    initDropdowns,
    initModals,
    addStagingPrefix,
    updateTierConditionalDisplay,
  };
}
