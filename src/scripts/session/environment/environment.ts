export function isStagingHost(hostname: string = window.location.hostname): boolean {
  return hostname.endsWith('.webflow.io');
}

export function isProdHost(hostname: string = window.location.hostname): boolean {
  return !isStagingHost(hostname);
}

export const isStaging = isStagingHost();
export const isProd = isProdHost();

export function onStaging(callback: () => void): void {
  if (isStagingHost()) callback();
}

export function onProd(callback: () => void): void {
  if (isProdHost()) callback();
}
