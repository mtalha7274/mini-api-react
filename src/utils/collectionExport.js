/**
 * @param {string} name
 * @returns {string}
 */
export function slugifyCollectionName(name) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'collection';
}

/**
 * @param {object} collection
 * @returns {string}
 */
export function serializeCollection(collection) {
  return JSON.stringify(collection, null, 2);
}

/**
 * @param {object} collection
 */
export function downloadCollectionJson(collection) {
  const json = serializeCollection(collection);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${slugifyCollectionName(collection.name)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
