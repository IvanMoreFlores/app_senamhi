import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject } from 'rxjs';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  constructor(public diagnostic: Diagnostic,
    public alertController: AlertController,
    public network: Network,
    public platform: Platform,
    private toastController: ToastController) {
  }

  gpsOn() {
    this.diagnostic.getLocationMode()
      .then((state) => {
        if (state === this.diagnostic.locationMode.LOCATION_OFF) {
          this.gpsOntAlert();
        } else {
          console.log('GPS habilitado');
        }
      }).catch(e => console.error(e));
  }

  datosOn() {
    // this.network.onConnect().subscribe((data) => {
    //   console.log(this.network.type);
    //   console.log(data);
    // });
    console.log(this.network);
    console.log(this.network.type);
    if (this.network.type === 'none') {
      console.log('No hay datos prendidos');
      this.datosOntAlert();
    } else {
      console.log('SI hay datos prendidos');
    }
  }

  async datosOntAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'GPS Inhabilitado',
      message: 'Vaya a <strong>Configuración</strong> para habilitar la <strong>Ubicación</strong> ',
      buttons: [{
        text: 'IR A LA CONFIGURACIÓN',
        handler: () => {
          this.diagnostic.switchToLocationSettings();
        }
      }
      ]
    });
    await alert.present();
  }

  async gpsOntAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Datos Inhabilitado',
      message: 'Vaya a <strong>Configuración</strong> para habilitar los <strong>Datos moviles</strong> ',
      buttons: [{
        text: 'IR A LA CONFIGURACIÓN',
        handler: () => {
          this.diagnostic.switchToMobileDataSettings();
        }
      }
      ]
    });
    await alert.present();
  }


}
