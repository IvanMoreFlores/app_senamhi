import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor(private storage: Storage,
    private platform: Platform) { }

  guardar_session(dato: any) {
    this.platform.ready().then(() => {
      localStorage.setItem('CLASS_SINC', 'card butttones');
      for (const clave in dato) {
        // Controlando que json realmente tenga esa propiedad
        if (dato.hasOwnProperty(clave)) {
          // Mostrando en pantalla la clave junto a su valor
          localStorage.setItem(clave, dato[clave]);
          // console.log('La clave es ' + clave + ' y el valor es ' + dato[clave]);
        }
      }
    });
  }

  actualizar_flag() {
    localStorage.setItem('FLG_NUEVO', '1');
  }
}
