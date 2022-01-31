export class User {
  constructor(
    public email: string,
    public id: string,
    public _token: string,
    public _tokenExpireDate: Date
  ) {}

  get token() {
    if (!this._tokenExpireDate || new Date() > this._tokenExpireDate) {
      return null;
    }
    return this._token;
  }
}
