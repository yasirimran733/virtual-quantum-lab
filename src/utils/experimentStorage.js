/**
 * Experiment Storage Utility
 * Handles saving and loading experiments from LocalStorage
 * 
 * TODO: Add IndexedDB support for larger experiments
 * TODO: Add experiment sharing via JSON export/import
 */

const STORAGE_KEY = 'quantum-vision-experiments'
const CURRENT_EXPERIMENT_KEY = 'quantum-vision-current-experiment'

/**
 * Save experiment to LocalStorage
 * @param {string} experimentId - Unique experiment ID
 * @param {Object} experimentData - Experiment data to save
 */
export const saveExperiment = (experimentId, experimentData) => {
  try {
    const experiments = getSavedExperiments()
    experiments[experimentId] = {
      ...experimentData,
      savedAt: new Date().toISOString(),
      id: experimentId,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments))
    return true
  } catch (error) {
    console.error('Error saving experiment:', error)
    return false
  }
}

/**
 * Load experiment from LocalStorage
 * @param {string} experimentId - Experiment ID to load
 * @returns {Object|null} Experiment data or null if not found
 */
export const loadExperiment = (experimentId) => {
  try {
    const experiments = getSavedExperiments()
    return experiments[experimentId] || null
  } catch (error) {
    console.error('Error loading experiment:', error)
    return null
  }
}

/**
 * Get all saved experiments
 * @returns {Object} Object with all saved experiments
 */
export const getSavedExperiments = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error reading experiments:', error)
    return {}
  }
}

/**
 * Delete experiment from LocalStorage
 * @param {string} experimentId - Experiment ID to delete
 */
export const deleteExperiment = (experimentId) => {
  try {
    const experiments = getSavedExperiments()
    delete experiments[experimentId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments))
    return true
  } catch (error) {
    console.error('Error deleting experiment:', error)
    return false
  }
}

/**
 * Save current experiment (auto-save)
 * @param {Object} experimentData - Current experiment data
 */
export const saveCurrentExperiment = (experimentData) => {
  try {
    localStorage.setItem(CURRENT_EXPERIMENT_KEY, JSON.stringify(experimentData))
    return true
  } catch (error) {
    console.error('Error saving current experiment:', error)
    return false
  }
}

/**
 * Load current experiment (auto-save)
 * @returns {Object|null} Current experiment data or null
 */
export const loadCurrentExperiment = () => {
  try {
    const stored = localStorage.getItem(CURRENT_EXPERIMENT_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error loading current experiment:', error)
    return null
  }
}

/**
 * Export experiment as JSON
 * @param {Object} experimentData - Experiment data to export
 * @returns {string} JSON string
 */
export const exportExperiment = (experimentData) => {
  return JSON.stringify(experimentData, null, 2)
}

/**
 * Import experiment from JSON
 * @param {string} jsonString - JSON string to import
 * @returns {Object|null} Parsed experiment data or null if invalid
 */
export const importExperiment = (jsonString) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Error importing experiment:', error)
    return null
  }
}

/**
 * Generate unique experiment ID
 * @returns {string} Unique ID
 */
export const generateExperimentId = () => {
  return `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

