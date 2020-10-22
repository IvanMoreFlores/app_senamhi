import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  datos: any;
  ip = 'http://190.119.131.24/API_SENAMHI/App_movil/';
  api_updatePassword: string = this.ip + 'updatePassword';
  api_getEstacion: string = this.ip + 'getEstacion';
  api_getHora: string = this.ip + 'getHora';
  api_getParametro: string = this.ip + 'getParametro';
  api_getDeficit: string = this.ip + 'getDeficit';
  api_getNube: string = this.ip + 'getNube';
  api_getViento: string = this.ip + 'getViento';
  api_getUmbrales: string = this.ip + 'getUmbrales';
  api_getOcurrencia: string = this.ip + 'getOcurrencia';
  api_getEvento: string = this.ip + 'getEvento';
  api_getEvento_x_para: string = this.ip + 'getEvento_x_para';
  api_getIncidencia: string = this.ip + 'getIncidencia';
  api_getNumberRecover: string = this.ip + 'getNumberRecover';
  /// APIS DE REGISTRO ///
  api_postAgregar: string = this.ip + 'postAgregar';
  api_postMeteoro: string = this.ip + 'postMeteoro';
  api_postAforo: string = this.ip + 'postAforo';
  api_via_base: string = this.ip + 'via_base';
  api_postSubirIncidencia: string = this.ip + 'subirIncidencia';
  api_getNumero: string = this.ip + 'getNumero';
  constructor(public http: HttpClient, public httpw: Http) { }

  getNumero(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getNumero, httpOptions)
      .pipe(map(results => results));
  }

  updatePassword(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_updatePassword, dato, httpOptions)
      .pipe(map(results => results));
  }

  getEstacion(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_getEstacion, dato, httpOptions)
      .pipe(map(results => results));
  }

  getHora(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_getHora, dato, httpOptions)
      .pipe(map(results => results));
  }

  getParametro(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_getParametro, dato, httpOptions)
      .pipe(map(results => results));
  }

  getDeficit(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getDeficit, httpOptions)
      .pipe(map(results => results));
  }

  getNube(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getNube, httpOptions)
      .pipe(map(results => results));
  }

  getViento(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getViento, httpOptions)
      .pipe(map(results => results));
  }

  getUmbrales(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getUmbrales, httpOptions)
      .pipe(map(results => results));
  }

  getOcurrencia(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getOcurrencia, httpOptions)
      .pipe(map(results => results));
  }

  getEvento(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getEvento, httpOptions)
      .pipe(map(results => results));
  }

  getEvento_x_para(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getEvento_x_para, httpOptions)
      .pipe(map(results => results));
  }

  getIncidencia(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getIncidencia, httpOptions)
      .pipe(map(results => results));
  }

  getNumberRecover(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .get(this.api_getNumberRecover, httpOptions)
      .pipe(map(results => results));
  }

  postAgregar(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_postAgregar, dato, httpOptions)
      .pipe(map(results => results));
  }

  postMeteoro(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_postMeteoro, dato, httpOptions)
      .pipe(map(results => results));
  }

  postAforo(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_postAforo, dato, httpOptions)
      .pipe(map(results => results));
  }

  via_base(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };
    return this.http
      .post(this.api_via_base, dato, httpOptions)
      .pipe(map(results => results));
  }

  subirIncidencia(dato: FormData): Observable<any> {
    console.log('Entro al servicio');
    const httpOptions = {};
    return this.http
      .post(this.api_postSubirIncidencia, dato, httpOptions)
      .pipe(map(results => results));
  }
}
