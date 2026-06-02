import { createContext, useContext, useMemo, useReducer } from 'react';
import { environmentReducer } from './environmentReducer';
import { initialEnvironmentState } from './initialState';

export const EnvironmentContext = createContext(null);

export function EnvironmentProvider({ children }) {
  const [state, dispatch] = useReducer(
    environmentReducer,
    initialEnvironmentState
  );

  const value = useMemo(
    () => ({
      environments: state.environments,
      dispatch,
    }),
    [state.environments]
  );

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within EnvironmentProvider');
  }
  return context;
}
