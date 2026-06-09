import { loadEnvironments } from '../../storage/appStorage';

export function getInitialEnvironmentState() {
  return loadEnvironments();
}
