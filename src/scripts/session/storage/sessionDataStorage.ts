import { SESSION_DATA_FIELDS } from '../../config/keys';

export interface SessionDataStorageConfig {
  storageKey?: string;
}

interface SessionSubmitContext {
  accessID: string;
}

interface SessionData {
  session: Record<string, string>;
}

const DEFAULT_CONFIG: Required<SessionDataStorageConfig> = {
  storageKey: 'dc_session_data',
};

let config: Required<SessionDataStorageConfig> = { ...DEFAULT_CONFIG };

function getCurrentUTMValues() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    utm_content: params.get('utm_content') ?? '',
    utm_term: params.get('utm_term') ?? '',
  };
}

function getFieldValue(form: HTMLFormElement, fieldName: string): string {
  const field = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    `[name="${fieldName}"]`
  );
  return field?.value?.trim() ?? '';
}

function loadSessionData(): SessionData {
  try {
    const raw = localStorage.getItem(config.storageKey);
    if (!raw) return { session: {} };
    const parsed = JSON.parse(raw) as Partial<SessionData>;
    if (!parsed.session || typeof parsed.session !== 'object') return { session: {} };
    return { session: parsed.session as Record<string, string> };
  } catch {
    return { session: {} };
  }
}

export function initSessionDataStorage(userConfig?: SessionDataStorageConfig): void {
  config = { ...DEFAULT_CONFIG, ...userConfig };
}

export function saveSessionDataOnSubmit(
  form: HTMLFormElement,
  context: SessionSubmitContext
): void {
  const current = loadSessionData();
  const pageURL = window.location.href;

  const sessionCandidate: Record<string, string> = {
    ...current.session,
    page_url: pageURL,
    page_path: window.location.pathname,
    referrer: document.referrer ?? '',
    submitted_at: new Date().toISOString(),
    access_id: context.accessID,
    marketoformid: getFieldValue(form, 'marketoformid'),
    ...getCurrentUTMValues(),
  };

  const session: Record<string, string> = {};
  for (const key of SESSION_DATA_FIELDS) {
    session[key] = sessionCandidate[key] ?? '';
  }

  const next: SessionData = { session };

  localStorage.setItem(config.storageKey, JSON.stringify(next));
}

