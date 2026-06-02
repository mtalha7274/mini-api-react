import { mockCollections } from '../../data/mockData';

export const initialCollectionState = {
  collections: mockCollections.map((col) => ({
    ...col,
    environmentId: col.environmentId ?? null,
    requests: col.requests.map((req) => ({ ...req })),
  })),
};
