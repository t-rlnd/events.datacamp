const LEGACY_MARKETO_ID_ATTRIBUTE = 'dc-marketo-formid';
const ROOT_SELECTOR = `[${LEGACY_MARKETO_ID_ATTRIBUTE}], [data-dc-marketo-formid]`;
const MARKETO_INPUT_SELECTOR = 'input[name="marketoformid"]';

function getMarketoFormId(root: HTMLElement): string {
  const dataAttributeValue = root.dataset.dcMarketoFormid?.trim();
  if (dataAttributeValue) return dataAttributeValue;
  return root.getAttribute(LEGACY_MARKETO_ID_ATTRIBUTE)?.trim() ?? '';
}

function syncMarketoFormIdOnElement(root: HTMLElement): void {
  const marketoFormId = getMarketoFormId(root);
  const input = root.querySelector<HTMLInputElement>(MARKETO_INPUT_SELECTOR);
  if (!input || !marketoFormId) return;
  input.value = marketoFormId;
}

export function addMarketoFormID() {
  document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => {
    syncMarketoFormIdOnElement(root);
  });
}
