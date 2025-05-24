/**
 * Añade un elemento al array y devuelve un nuevo array
 */
export function addItem<T>(array: T[], item: T): T[] {
  return [...array, item];
}

/**
 * Elimina el elemento en la posición `index` y devuelve un nuevo array
 */
export function removeItemAt<T>(array: T[], index: number): T[] {
  return array.filter((_, i) => i !== index);
}

/**
 * Sustituye el elemento en `index` por `newItem` y devuelve un nuevo array
 */
export function updateItemAt<T>(array: T[], index: number, newItem: T): T[] {
  return array.map((item, i) => (i === index ? newItem : item));
}
