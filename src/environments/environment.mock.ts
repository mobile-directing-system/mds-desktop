import packageJson from '../../package.json';

export const environment = {
  production: false,
  useMocks: true,
  version: packageJson.version + '-mock'
};
