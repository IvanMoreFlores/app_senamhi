import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class LoginService {
  datos: any;
  ip = 'http://190.119.131.24/API_SENAMHI/App_movil/';
  // tslint:disable-next-line: variable-name
  api_login: string = this.ip + 'getLogin';
  // tslint:disable-next-line: variable-name
  api_recover_pass: string = this.ip + 'recoverPass';
  constructor(public http: HttpClient) { }

  login(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_login, dato, httpOptions)
      .pipe(map(results => results));
  }

  recoverPass(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_recover_pass, dato, httpOptions)
      .pipe(map(results => results));
  }
}
