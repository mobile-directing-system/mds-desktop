import packageJson from '../../package.json';

export const environment = {
  production: false,
  useMocks: false,
  version: packageJson.version + '-dev'
};
