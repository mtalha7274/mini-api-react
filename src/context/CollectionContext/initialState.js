import { mockCollections } from '../../data/mockData';

export const initialCollectionState = {
  collections: mockCollections.map((col) => ({
    ...col,
    requests: col.requests.map((req) => ({ ...req })),
  })),
};
