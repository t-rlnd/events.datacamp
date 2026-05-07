/**
 * FormDataStorage - Module pour sauvegarder les données de formulaire
 *
 * Ce module permet de sauvegarder les valeurs des champs de formulaire dans le localStorage.
 * Les données sont stockées dans un JSON avec cette structure :
 * {
 *   user: {
 *     firstName: "John",
 *     lastName: "Doe",
 *     email: "john@example.com"
 *   }
 * }
 *
 * UTILISATION :
 * 1. Initialiser le module : initFormDataStorage({ storageKey: 'mon_formulaire', fieldsToSave: ['firstName', 'lastName'] })
 * 2. Lors de la soumission du formulaire, appeler : saveFormFieldsOnSubmit(form)
 * 3. Pour récupérer une valeur : getFieldValue('firstName')
 * 4. Pour récupérer toutes les données : getAllFormData()
 */

/* ============================================
  TYPES ET INTERFACES
  ============================================ */

/**
 * Structure des données utilisateur
 * C'est un objet où chaque clé est le nom d'un champ et chaque valeur est la valeur du champ
 * Exemple: { firstName: "John", lastName: "Doe" }
 */
interface UserData {
  [fieldName: string]: string;
}

/**
 * Structure complète des données stockées dans localStorage
 * Exemple: { user: { firstName: "John", lastName: "Doe" } }
 */
interface FormData {
  user: UserData;
}

/**
 * Configuration du module
 * Permet de personnaliser le comportement du module
 */
export interface FormDataStorageConfig {
  /** Nom de la clé dans localStorage où on stocke les données (ex: 'form_data') */
  storageKey?: string;
  /** Liste des noms de champs à sauvegarder. Si vide, tous les champs seront sauvegardés */
  fieldsToSave?: string[];
  /** Préfixe pour les messages d'erreur dans la console */
  logPrefix?: string;
}

/* ============================================
  CONFIGURATION PAR DÉFAUT
  ============================================ */

/**
 * Valeurs par défaut utilisées si aucune configuration n'est fournie
 */
const DEFAULT_CONFIG: Required<FormDataStorageConfig> = {
  storageKey: 'form_data',
  fieldsToSave: [],
  logPrefix: '[formDataStorage]',
};

/* ============================================
  VARIABLES GLOBALES
  ============================================ */

/**
 * Configuration actuelle du module (valeurs par défaut ou personnalisées)
 */
let config: Required<FormDataStorageConfig> = { ...DEFAULT_CONFIG };

/**
 * Données du formulaire en mémoire
 * Structure: { user: { fieldName: value, ... } }
 * Cette variable est mise à jour quand on charge ou sauvegarde des données
 */
let formData: FormData = { user: {} };

/* ============================================
  FONCTIONS UTILITAIRES (INTERNES)
  ============================================ */

/**
 * Affiche un message d'erreur dans la console
 * @param message - Le message à afficher
 */
function log(message: string): void {
  if (typeof console !== 'undefined') {
    console.error(`${config.logPrefix} ${message}`);
  }
}

/**
 * Vérifie si un champ doit être sauvegardé
 * Si fieldsToSave est vide, tous les champs sont sauvegardés
 * Sinon, seuls les champs dans la liste sont sauvegardés
 * @param fieldName - Le nom du champ à vérifier
 * @returns true si le champ doit être sauvegardé, false sinon
 */
function shouldSaveField(fieldName: string): boolean {
  // Si aucune liste de champs n'est définie, on sauvegarde tout
  if (config.fieldsToSave.length === 0) {
    return true;
  }
  // Sinon, on vérifie si le champ est dans la liste
  return config.fieldsToSave.includes(fieldName);
}

/**
 * Charge les données depuis localStorage
 * @returns Les données chargées ou un objet vide si aucune donnée n'existe
 */
function loadFormData(): FormData {
  try {
    // Récupérer la chaîne JSON depuis localStorage
    const jsonString = localStorage.getItem(config.storageKey);

    // Si aucune donnée n'existe, retourner un objet vide
    if (!jsonString) {
      return { user: {} };
    }

    // Convertir la chaîne JSON en objet JavaScript
    const parsedData = JSON.parse(jsonString);

    // Vérifier que la structure est correcte
    // On s'attend à avoir un objet avec une propriété 'user' qui est aussi un objet
    if (
      parsedData &&
      typeof parsedData === 'object' &&
      parsedData.user &&
      typeof parsedData.user === 'object'
    ) {
      return parsedData as FormData;
    }

    // Si la structure n'est pas correcte, afficher un message et retourner un objet vide
    log('Invalid data structure in localStorage, using default');
    return { user: {} };
  } catch (error) {
    // En cas d'erreur (JSON invalide, etc.), afficher le message et retourner un objet vide
    log(`Error loading form data: ${error}`);
    return { user: {} };
  }
}

/**
 * Sauvegarde les données dans localStorage
 * Réorganise les champs selon l'ordre défini dans fieldsToSave si nécessaire
 * @param data - Les données à sauvegarder
 */
function saveFormData(data: FormData): void {
  try {
    // Copier les données utilisateur
    let userDataToSave: UserData = { ...data.user };

    // Si une liste de champs est définie, réorganiser selon cet ordre
    if (config.fieldsToSave.length > 0) {
      const reorganizedData: UserData = {};

      // Étape 1 : Ajouter les champs dans l'ordre défini dans fieldsToSave
      for (const fieldName of config.fieldsToSave) {
        if (fieldName in userDataToSave) {
          reorganizedData[fieldName] = userDataToSave[fieldName];
        }
      }

      // Étape 2 : Ajouter les champs restants qui ne sont pas dans fieldsToSave
      for (const fieldName of Object.keys(userDataToSave)) {
        if (!config.fieldsToSave.includes(fieldName)) {
          reorganizedData[fieldName] = userDataToSave[fieldName];
        }
      }

      userDataToSave = reorganizedData;
    }

    // Créer l'objet final avec la structure { user: { ... } }
    const dataToSave: FormData = { user: userDataToSave };

    // Convertir l'objet en chaîne JSON et sauvegarder dans localStorage
    const jsonString = JSON.stringify(dataToSave);
    localStorage.setItem(config.storageKey, jsonString);

    // Mettre à jour la variable globale avec les données sauvegardées
    formData = dataToSave;
  } catch (error) {
    log(`Error saving form data: ${error}`);
  }
}

/**
 * Migre les données de l'ancien format vers le nouveau format
 * Cette fonction permet de récupérer les données sauvegardées avec une ancienne version du module
 * @param oldStorageKey - La clé utilisée dans l'ancien format
 */
function migrateOldData(oldStorageKey: string): void {
  try {
    // Récupérer les anciennes données
    const oldDataString = localStorage.getItem(oldStorageKey);
    if (!oldDataString) {
      return; // Pas d'anciennes données à migrer
    }

    // Convertir en objet JavaScript
    const oldData = JSON.parse(oldDataString);
    let fieldsToMigrate: Record<string, string> = {};

    // Extraire les champs selon différentes structures possibles
    // Structure 1 : { user: { infos: { field: value } } }
    if (oldData.user?.infos && typeof oldData.user.infos === 'object') {
      fieldsToMigrate = oldData.user.infos;
    }
    // Structure 2 : { user: { field: value } }
    else if (oldData.user && typeof oldData.user === 'object') {
      fieldsToMigrate = oldData.user;
    }
    // Structure 3 : { field: value } (structure plate)
    else if (typeof oldData === 'object' && !Array.isArray(oldData)) {
      fieldsToMigrate = oldData;
    }

    // Si on a trouvé des données à migrer, les sauvegarder dans le nouveau format
    if (Object.keys(fieldsToMigrate).length > 0) {
      formData = { user: fieldsToMigrate };
      saveFormData(formData);
      // Supprimer l'ancienne clé
      localStorage.removeItem(oldStorageKey);
    }
  } catch (error) {
    log(`Error migrating old data: ${error}`);
  }
}

/* ============================================
  API PUBLIQUE (FONCTIONS EXPORTÉES)
  ============================================ */

/**
 * Récupère la valeur d'un champ depuis les données sauvegardées
 * @param fieldName - Le nom du champ (ex: 'firstName')
 * @returns La valeur du champ ou undefined si le champ n'existe pas
 *
 * @example
 * const firstName = getFieldValue('firstName');
 * // Retourne "John" si le champ firstName a été sauvegardé avec la valeur "John"
 */
export function getFieldValue(fieldName: string): string | undefined {
  return formData.user[fieldName];
}

/**
 * Récupère toutes les données du formulaire sauvegardées
 * @returns Un objet avec la structure { user: { field1: value1, field2: value2, ... } }
 *
 * @example
 * const allData = getAllFormData();
 * // Retourne { user: { firstName: "John", lastName: "Doe" } }
 */
export function getAllFormData(): FormData {
  // Retourner une copie pour éviter que l'extérieur modifie les données internes
  return { ...formData };
}

/**
 * Saves or updates one explicit user field in localStorage.
 * Useful for computed fields that are not direct form inputs.
 */
export function saveUserDataField(fieldName: string, fieldValue: string): void {
  formData.user[fieldName] = fieldValue;
  saveFormData(formData);
}

/**
 * Efface toutes les données du formulaire sauvegardées
 * Supprime les données en mémoire et dans localStorage
 */
export function clearFormData(): void {
  // Réinitialiser les données en mémoire
  formData = { user: {} };
  // Sauvegarder (ce qui va écraser les données dans localStorage avec un objet vide)
  saveFormData(formData);
}

/**
 * Récupère la configuration actuelle du module
 * @returns Une copie de la configuration (en lecture seule)
 */
export function getConfig(): Readonly<Required<FormDataStorageConfig>> {
  return { ...config };
}

/**
 * Sauvegarde tous les champs d'un formulaire lors de sa soumission
 * Cette fonction doit être appelée dans le gestionnaire d'événement 'submit' du formulaire
 * @param form - Le formulaire à sauvegarder. Si non fourni, sauvegarde tous les formulaires de la page
 *
 * @example
 * form.addEventListener('submit', () => {
 *   saveFormFieldsOnSubmit(form);
 * });
 */
export function saveFormFieldsOnSubmit(form?: HTMLFormElement): void {
  // Déterminer quels formulaires traiter
  // Si un formulaire est fourni, on ne traite que celui-ci
  // Sinon, on traite tous les formulaires de la page
  const formsToProcess: HTMLFormElement[] = form
    ? [form]
    : Array.from(document.querySelectorAll<HTMLFormElement>('form'));

  // Parcourir chaque formulaire
  for (const formElement of formsToProcess) {
    // Récupérer tous les champs du formulaire
    // On cherche tous les inputs, textareas et selects qui ont un attribut 'name'
    const formFields = formElement.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >('input[name], textarea[name], select[name]');

    // Parcourir chaque champ
    for (const field of formFields) {
      // Récupérer le nom du champ
      const fieldName = field.getAttribute('name');
      if (!fieldName) {
        continue; // Si le champ n'a pas de nom, on passe au suivant
      }

      // Vérifier si ce champ doit être sauvegardé
      if (!shouldSaveField(fieldName)) {
        continue; // Si le champ ne doit pas être sauvegardé, on passe au suivant
      }

      // Récupérer la valeur du champ et supprimer les espaces au début et à la fin
      const fieldValue = field.value.trim();

      // Sauvegarder la valeur dans les données en mémoire
      // On sauvegarde même si la valeur est vide pour capturer tous les champs du formulaire
      formData.user[fieldName] = fieldValue;
    }
  }

  // Une fois tous les champs collectés, sauvegarder dans localStorage
  saveFormData(formData);
}

/**
 * Restaure les valeurs sauvegardées dans les champs du formulaire
 * Cette fonction est appelée au chargement de la page pour remplir les champs avec les valeurs précédentes
 */
function restoreFormValues(): void {
  // Récupérer tous les champs de formulaire de la page
  const formFields = document.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >('input[name], textarea[name], select[name]');

  // Parcourir chaque champ
  for (const field of formFields) {
    // Récupérer le nom du champ
    const fieldName = field.getAttribute('name');
    if (!fieldName) {
      continue; // Si le champ n'a pas de nom, on passe au suivant
    }

    // Vérifier si ce champ doit être restauré
    if (!shouldSaveField(fieldName)) {
      continue; // Si le champ ne doit pas être restauré, on passe au suivant
    }

    // Récupérer la valeur sauvegardée
    const savedValue = getFieldValue(fieldName);

    // Si une valeur existe et que le champ est vide, la restaurer
    if (savedValue && field.value === '') {
      field.value = savedValue;
    }
  }
}

/**
 * Initialise le module de sauvegarde des données de formulaire
 * Cette fonction doit être appelée au chargement de la page
 * @param userConfig - Configuration optionnelle pour personnaliser le comportement
 *
 * @example
 * // Utilisation simple avec les valeurs par défaut
 * initFormDataStorage();
 *
 * // Utilisation avec configuration personnalisée
 * initFormDataStorage({
 *   storageKey: 'mon_formulaire',
 *   fieldsToSave: ['firstName', 'lastName', 'email']
 * });
 */
export function initFormDataStorage(userConfig?: FormDataStorageConfig): void {
  // Étape 1 : Mettre à jour la configuration
  // On combine la configuration par défaut avec la configuration fournie par l'utilisateur
  config = { ...DEFAULT_CONFIG, ...userConfig };

  // Étape 2 : Charger les données depuis localStorage
  formData = loadFormData();

  // Étape 3 : Migrer les données de l'ancien format si elles existent
  // On essaie de migrer depuis l'ancienne clé 'user_form_data'
  migrateOldData('user_form_data');

  // Étape 4 : Restaurer les valeurs dans les champs du formulaire
  restoreFormValues();
}

/**
 * Réinitialise le module avec une nouvelle configuration
 * Efface toutes les données et réinitialise avec la nouvelle configuration
 * @param newConfig - La nouvelle configuration à utiliser
 */
export function resetFormDataStorage(newConfig?: FormDataStorageConfig): void {
  // Effacer toutes les données
  clearFormData();
  // Réinitialiser avec la nouvelle configuration
  initFormDataStorage(newConfig);
}
