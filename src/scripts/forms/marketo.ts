export function addMarketoFormID() {
  document.querySelectorAll<HTMLElement>('[dc-marketo-formid]').forEach((el) => {
    const marketoFormID = el.getAttribute('dc-marketo-formid');
    const input = el.querySelector<HTMLInputElement>('input[name="marketoformid"]');
    if (!input || !marketoFormID) return;
    input.value = marketoFormID;
  });
}
