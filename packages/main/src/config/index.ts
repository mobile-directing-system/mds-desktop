class Config {
  _baseURL = 'localhost';
  get baseURL() {
    return this._baseURL;
  }
}

export default new Config();