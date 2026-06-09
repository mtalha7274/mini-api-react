import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { saveEnvironments } from '../../storage/appStorage';
import { environmentReducer } from './environmentReducer';
import { getInitialEnvironmentState } from './initialState';

export const EnvironmentContext = createContext(null);

export function EnvironmentProvider({ children }) {
  const [state, dispatch] = useReducer(
    environmentReducer,
    undefined,
    getInitialEnvironmentState
  );

  useEffect(() => {
    saveEnvironments(state.environments);
  }, [state.environments]);

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
