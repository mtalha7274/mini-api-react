import { loadCollections } from '../../storage/appStorage';

export function getInitialCollectionState() {
  return loadCollections();
}
