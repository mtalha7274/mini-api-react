import { mockEnvironments } from '../../data/mockData';

export const initialEnvironmentState = {
  environments: mockEnvironments.map((env) => ({
    ...env,
    variables: env.variables.map((v) => ({ ...v })),
  })),
};
