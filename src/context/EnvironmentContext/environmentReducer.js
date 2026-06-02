import { generateId } from '../../utils/generateId';
import { createEmptyKeyValue } from '../../data/mockData';

export const EnvironmentActionTypes = {
  CREATE_ENVIRONMENT: 'CREATE_ENVIRONMENT',
  RENAME_ENVIRONMENT: 'RENAME_ENVIRONMENT',
  DELETE_ENVIRONMENT: 'DELETE_ENVIRONMENT',
  UPDATE_ENVIRONMENT_VARIABLES: 'UPDATE_ENVIRONMENT_VARIABLES',
};

export function createEnvironment() {
  const id = generateId('env');
  return {
    type: EnvironmentActionTypes.CREATE_ENVIRONMENT,
    payload: {
      id,
      environment: {
        id,
        name: 'New Environment',
        variables: [createEmptyKeyValue()],
      },
    },
  };
}

export function renameEnvironment(environmentId, name) {
  return {
    type: EnvironmentActionTypes.RENAME_ENVIRONMENT,
    payload: { environmentId, name: name.trim() },
  };
}

export function deleteEnvironment(environmentId) {
  return {
    type: EnvironmentActionTypes.DELETE_ENVIRONMENT,
    payload: { environmentId },
  };
}

export function updateEnvironmentVariables(environmentId, variables) {
  return {
    type: EnvironmentActionTypes.UPDATE_ENVIRONMENT_VARIABLES,
    payload: { environmentId, variables },
  };
}

export function environmentReducer(state, action) {
  switch (action.type) {
    case EnvironmentActionTypes.CREATE_ENVIRONMENT:
      return {
        ...state,
        environments: [...state.environments, action.payload.environment],
      };

    case EnvironmentActionTypes.RENAME_ENVIRONMENT: {
      const { environmentId, name } = action.payload;
      if (!name) return state;
      return {
        ...state,
        environments: state.environments.map((env) =>
          env.id === environmentId ? { ...env, name } : env
        ),
      };
    }

    case EnvironmentActionTypes.DELETE_ENVIRONMENT:
      return {
        ...state,
        environments: state.environments.filter(
          (env) => env.id !== action.payload.environmentId
        ),
      };

    case EnvironmentActionTypes.UPDATE_ENVIRONMENT_VARIABLES: {
      const { environmentId, variables } = action.payload;
      return {
        ...state,
        environments: state.environments.map((env) =>
          env.id === environmentId ? { ...env, variables } : env
        ),
      };
    }

    default:
      return state;
  }
}
