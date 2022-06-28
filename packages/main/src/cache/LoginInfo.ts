class LoginInfo  {
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

export default new LoginInfo;