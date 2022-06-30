import type { AxiosError, AxiosRequestConfig, AxiosInstance } from 'axios';
import axios from 'axios';
import config from '/@/config';
import { loginCache } from '/@/cache';

class Backend {
  instanceData:AxiosRequestConfig = {
    baseURL: `http://${config.baseURL}:30080`,
    timeout: 10000,
  };
  _backendInstance: AxiosInstance;
  constructor() {
    this._backendInstance = axios.create(this.instanceData);
  }
  setAuthorizationHeader(token: string, tokenType: string) {
    loginCache.token = token;
    loginCache.tokenType = tokenType;
    this._backendInstance = axios.create({
      ...this.instanceData,
      headers: {'Authorization': `${loginCache.tokenType} ${loginCache.token}`},
    });
  }
  get instance() {
    return this._backendInstance;
  }

}

function printAxiosError(axError: AxiosError) {
  if(axError.response) {
    console.log('Error in Response', axError.response.data, axError.response.status, axError.response.headers);
  } else if(axError.request) {
      console.log('Error in Request', axError.code, axError.message);
  } else {
      console.log('Other Error', axError);
  }
}


export default new Backend();
export { printAxiosError };

