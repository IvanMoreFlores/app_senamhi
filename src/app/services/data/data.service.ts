import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class DataService {

  constructor() { }
}

export interface Cabecera {
  V_COD_ESTA: string;
  ID_HORA_SINOPTICA: string;
  FECHA_MOVIL: string;
  ID_USUARIO: string;
  NUM_LATITUD: Number;
  NUM_LONGITUD: Number;
  FLG_CANAL: string;
  FLG_MEDIO: string;
}
