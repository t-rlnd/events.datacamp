/**
 * DC MODAL SYSTEM
 * ----------------
 * Modales pilotées uniquement via des attributs data-dc-*.
 * Classes = CSS | data-dc-* = JavaScript
 *
 * STRUCTURE
 * - data-dc-modal                → racine du composant
 * - data-dc-modal-id="id"        → identifiant unique
 * - data-dc-modal-element="..."  → overlay | wrapper | content | close
 *
 * ACTIONS
 * - data-dc-modal-open           → ouvrir
 * - data-dc-modal-close          → fermer
 * - data-dc-modal-toggle         → toggle
 * - data-dc-modal-target="id"    → modale ciblée
 *
 * STATE / OPTIONS
 * - data-dc-modal-state="open|closed"
 * - data-dc-modal-close-on-overlay="true|false"
 * - data-dc-modal-close-on-esc="true|false"
 * - data-dc-modal-lock-scroll="true|false"
 *
 * Notes : toujours data-dc-*, jamais de classes pour le JS.
 */

import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyScroll';

// Récupère la modale correspondante à un identifiant donné
function getModalById(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-dc-modal][data-dc-modal-id="${id}"]`);
}

// Vérifie si au moins une modale est actuellement ouverte
function isAnyModalOpen(): boolean {
  return Boolean(document.querySelector('[data-dc-modal-state="open"]'));
}

// Ouvre la modale d'identifiant spécifié (affiche et applique l'état ouvert)
function openModal(id: string) {
  const modal = getModalById(id);
  if (!modal) return;

  modal.style.display = 'flex';
  modal.setAttribute('data-dc-modal-state', 'open');

  lockBodyScroll();
}

// Ferme la modale spécifiée (masque et applique l'état fermé)
function closeModal(modal: HTMLElement) {
  modal.style.display = 'none';
  modal.setAttribute('data-dc-modal-state', 'closed');

  if (!isAnyModalOpen()) {
    unlockBodyScroll();
  }
}

// Indique si la modale autorise la fermeture via la touche Échap
function isCloseOnEscEnabled(modal: HTMLElement): boolean {
  return modal.getAttribute('data-dc-modal-close-on-esc') !== 'false';
}

// Retourne la modale ouverte la plus récente autorisée à se fermer avec Échap
function getTopOpenModalCloseableOnEsc(): HTMLElement | null {
  const openModals = document.querySelectorAll<HTMLElement>(
    '[data-dc-modal][data-dc-modal-state="open"]',
  );

  for (let index = openModals.length - 1; index >= 0; index -= 1) {
    const modal = openModals[index];
    if (isCloseOnEscEnabled(modal)) {
      return modal;
    }
  }

  return null;
}

// Initialise tous les événements d'ouverture et de fermeture des modales sur la page
export function initModals() {
  /* ---------- OPEN ---------- */
  document.querySelectorAll<HTMLElement>('[data-dc-modal-open]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = trigger.dataset.dcModalTarget;
      if (targetId) {
        openModal(targetId);
      }
    });
  });

  /* ---------- CLOSE ---------- */
  document.querySelectorAll<HTMLElement>('[data-dc-modal-close]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();

      const modal = trigger.closest<HTMLElement>('[data-dc-modal]');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  /* ---------- ESC ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    const modal = getTopOpenModalCloseableOnEsc();
    if (!modal) return;

    e.preventDefault();
    closeModal(modal);
  });
}
