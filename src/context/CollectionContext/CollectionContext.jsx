import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { saveCollections } from '../../storage/appStorage';
import { collectionReducer } from './collectionReducer';
import { getInitialCollectionState } from './initialState';

export const CollectionContext = createContext(null);

export function CollectionProvider({ children }) {
  const [state, dispatch] = useReducer(
    collectionReducer,
    undefined,
    getInitialCollectionState
  );

  useEffect(() => {
    saveCollections(state.collections);
  }, [state.collections]);

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
