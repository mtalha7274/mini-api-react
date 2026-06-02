import { createContext, useContext, useMemo, useReducer } from 'react';
import { collectionReducer } from './collectionReducer';
import { initialCollectionState } from './initialState';

export const CollectionContext = createContext(null);

export function CollectionProvider({ children }) {
  const [state, dispatch] = useReducer(
    collectionReducer,
    initialCollectionState
  );

  const value = useMemo(
    () => ({
      collections: state.collections,
      dispatch,
    }),
    [state.collections]
  );

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within CollectionProvider');
  }
  return context;
}
