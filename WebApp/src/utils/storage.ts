/**
 * Retrieves an item from localStorage, parsing it as JSON.
 * If the item does not exist or parsing fails, returns the provided fallback value.
 *
 * @param key - The localStorage key to retrieve.
 * @param fallback - The default value to return if the key is missing or invalid.
 * @returns The parsed value from localStorage, or the fallback.
 */
export function getLocalStorageItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Serializes a value as JSON and stores it in localStorage.
 *
 * @param key - The localStorage key to set.
 * @param val - The value to serialize and store.
 */
export function setLocalStorageItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}
