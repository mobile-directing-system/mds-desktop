/**
 * Class used to cache the login cookie
 */
class LoginCache  {
  _tokenType= '';
  _token = '';

  get token(): string {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }

  get tokenType(): string {
    return this._tokenType;
  }

  set tokenType(tokenType: string) {
    this._tokenType = tokenType;
  }

}

/**
 * Instance for caching the login cookie
 */
export default new LoginCache();