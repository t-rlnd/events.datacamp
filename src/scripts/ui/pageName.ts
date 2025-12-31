/**
 * Modifies the page title by adding "STAGING" as a prefix if on a .webflow.io environment.
 * @param {string} pageName - The original page name.
 */
export function addStagingPrefix(pageName: string): void {
  if (window.location.hostname.includes('.webflow.io')) {
    document.title = `[DEV] - ${pageName}`;
  } else {
    document.title = pageName;
  }
}
