import packageJson from '../../package.json';

export const environment = {
  production: true,
  useMocks: false,
  version: packageJson.version
};
