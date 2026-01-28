export function initDropdowns() {
  // 1. Sélectionne toutes les listes de Dropdowns
  const dropdownsLists = document.querySelectorAll('[data-dc-element="dropdown-list"]');
  console.log(dropdownsLists);

  dropdownsLists.forEach((dropdownsList) => {
    // 2. Sélectionne tous les Dropdowns dans la liste actuelle
    const dropdowns = dropdownsList.querySelectorAll('[data-dc-element="dropdown"]');

    // Initialise tous les dropdowns avec l'attribut data-dc-status vide
    dropdowns.forEach((dropdown) => {
      dropdown.removeAttribute('data-dc-status');
    });

    // Ouvre par défaut le premier dropdown de la liste, s'il existe
    if (dropdowns.length > 0) {
      dropdowns[0].setAttribute('data-dc-status', 'active');
    }

    dropdowns.forEach((dropdown) => {
      // 3. Sélectionne l'élément "Toggle" & l'élément "Content" du dropdown actuel
      const dropdownToggle = dropdown.querySelector(
        '[data-dc-element="dropdown-toggle"]'
      ) as HTMLElement;
      const dropdownContent = dropdown.querySelector(
        '[data-dc-element="dropdown-content"]'
      ) as HTMLElement;

      if (dropdownToggle && dropdownContent) {
        // 4. Ajoute un écouteur d'événement de clic sur l'élément "Toggle"
        dropdownToggle.addEventListener('click', () => {
          // Si le dropdown est déjà actif, on le ferme et on arrête l'exécution
          if (dropdown.getAttribute('data-dc-status') === 'active') {
            dropdown.removeAttribute('data-dc-status');

            return;
          }
          // Supprime l'attribut status="active" de tous les dropdowns
          dropdowns.forEach((openedDropdown) => {
            openedDropdown.removeAttribute('data-dc-status');
          });

          // Ajoute l'attribut status="active" uniquement sur le dropdown cliqué
          dropdown.setAttribute('data-dc-status', 'active');
        });
      }
    });
  });
}
