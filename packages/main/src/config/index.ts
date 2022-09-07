class Config {
  //the address of the backend
  _baseURL = 'localhost';
  get baseURL() {
    return this._baseURL;
  }
}

export default new Config();