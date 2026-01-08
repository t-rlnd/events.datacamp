/**
 * Modifies the page title by adding "[DEV]" as a prefix
 * ONLY if the JS is executed from localhost (i.e., served by local dev bundler/server),
 * even if the page host is .webflow.io.
 * Does NOT add prefix if JS runs from NPM/CDN like JSDelivr.
 * @param {string} pageName - The original page name.
 */
export function addStagingPrefix(pageName: string): void {
  // Check if the JS is running from localhost (port is typical for local dev)
  // and the script origin is localhost, not CDN
  const isScriptServedLocally = Boolean(
    Array.from(document.scripts).some(
      (script) =>
        script.src.startsWith('http://localhost') ||
        script.src.startsWith('http://127.0.0.1') ||
        script.src.startsWith('http://[::1]')
    )
  );
  if (isScriptServedLocally) {
    document.title = `[DEV] - ${pageName}`;
  } else {
    document.title = pageName;
  }
}
