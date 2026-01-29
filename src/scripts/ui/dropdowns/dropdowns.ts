export function initDropdowns() {
  const dropdownsLists = document.querySelectorAll('[data-dc-element="dropdown-list"]');

  dropdownsLists.forEach((dropdownsList) => {
    const dropdowns = dropdownsList.querySelectorAll('[data-dc-element="dropdown"]');

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
          const status = dropdown.getAttribute('data-dc-status');
          // Supprime l'attribut status="active" de tous les dropdowns
          dropdowns.forEach((openedDropdown) => {
            openedDropdown.removeAttribute('data-dc-status');
          });
          // Si le dropdown est déjà actif, on le ferme et on arrête l'exécution
          if (status === 'active') {
            console.log('Fermeture du dropdown');
            dropdown.removeAttribute('data-dc-status');
          } else {
            console.log('Ouverture du dropdown');
            dropdown.setAttribute('data-dc-status', 'active');
          }
        });
      }
    });
  });
}
