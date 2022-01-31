import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

export interface AuthRespData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
//********************/
@Injectable({ providedIn: 'root' })
//********************/
export class AuthService {
  user = new BehaviorSubject<User>(null);
  timerExpire: any;
  constructor(private http: HttpClient) {}
  signUp(myemail: string, mypassword: string) {
    return this.http
      .post<AuthRespData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDGqWhU2ygoNXO-YL3mm7DJPt-J0mKhImE',
        { email: myemail, password: mypassword, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((respData) =>
          this.authHandle(
            respData.email,
            respData.localId,
            respData.idToken,
            respData.expiresIn
          )
        )
      );
  }
  //********************/
  login(myemail: string, mypassword: string) {
    return this.http
      .post<AuthRespData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDGqWhU2ygoNXO-YL3mm7DJPt-J0mKhImE',
        { email: myemail, password: mypassword, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((respData) =>
          this.authHandle(
            respData.email,
            respData.localId,
            respData.idToken,
            respData.expiresIn
          )
        )
      );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('authdata');
    if (this.timerExpire) {
      clearTimeout(this.timerExpire);
    }
    this.timerExpire = null;
  }
  //********************/
  autoLogout(expireDuration: number) {
    console.log('autoLogout');
    this.timerExpire = setTimeout(() => {
      this.logout();
    }, expireDuration);
  }

  //********************/
  autoLogin() {
    console.log('autoLogin');
    console.log(localStorage.getItem('authdata'));
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpireDate: Date;
    } = JSON.parse(localStorage.getItem('authdata'));

    const loadeUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpireDate)
    );
    console.log(loadeUser);
    this.user.next(loadeUser);
    const expDuration =
      new Date(userData._tokenExpireDate).getTime() - new Date().getTime();
    this.autoLogout(expDuration * 1000);
  }
  //********************/
  private authHandle(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: string
  ) {
    const expDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, localId, idToken, expDate);
    this.user.next(user);
    this.autoLogout(+expiresIn * 1000);
    localStorage.setItem('authdata', JSON.stringify(user));
  }
  //********************/
  private handleError(errorResp: HttpErrorResponse) {
    let errormesage = 'unknown error';
    if (!errorResp) {
      return throwError(errormesage);
    }
    switch (errorResp.error.error.message) {
      case 'INVALID_PASSWORD':
        errormesage = 'Password not match';
        break;
      case 'EMAIL_EXISTS':
        errormesage = 'Email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errormesage = 'Email Not exists';
        break;
    }
    return throwError(errormesage);
  }
  //********************/
}
