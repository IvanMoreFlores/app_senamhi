import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
// Modal
import { ModalProfilePage } from '../modal-profile/modal-profile.page';
import { ModalInfoPage } from '../modal-info/modal-info.page';
// Services
import { HomeService } from '../../services/home/home.service';
declare var SMS: any;

@Component({
  selector: 'app-receptor-home',
  templateUrl: './receptor-home.page.html',
  styleUrls: ['./receptor-home.page.scss'],
})
export class ReceptorHomePage implements OnInit, OnDestroy {
  mySMS: any[] = [];
  sexo: String;
  json_guardada = [];
  Key_cabecera = [];
  observador: String = localStorage.getItem('NOMBRES') + ', '
    + localStorage.getItem('APE_PATERNO') + ' '
    + localStorage.getItem('APE_MATERNO');
  constructor(
    public modalController: ModalController,
    private router: Router,
    public navCtrl: NavController,
    public platform: Platform,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    public home: HomeService,
    public loadingController: LoadingController,
  ) {
    if (localStorage.getItem('GENERO') === 'M') {
      this.sexo = 'assets/img/man.svg';
    } else {
      this.sexo = 'assets/img/girl.svg';
    }
  }

  ngOnInit() {
    this.listMessage();
  }

  listMessage() {
    this.mySMS = [];
    let key;
    this.platform.ready().then((readySource) => {
      let primer: any;
      const filter = {
        box: 'inbox', // 'inbox' (default), 'sent', 'draft'
        indexFrom: 0, // start from index 0
        // maxCount: 30, // count of SMS to return each time
      };
      if (SMS) {
        SMS.listSMS(filter, (ListSms) => {
          console.log(ListSms);
          console.log(ListSms.reverse());
          ListSms.forEach(element => {
            console.log(JSON.stringify(element));
            if (element.body.substr(0, 2) === '20') {
              primer = element.body;
              primer = primer.replace(/([(])/g, '{');
              primer = primer.replace(/([)])/g, '}');
              primer = primer.replace(/§/g, '_');
              primer = primer.replace(/ö/g, '|');
              primer = primer.trim();
              this.unirCadena(primer)
            } else {
              console.log('No paso')
            }
          });
        },
          (Error: any) => {
            console.log('error list sms: ' + Error);
          });
      }
    });
  }

  unirCadena(cadena) {
    var array_split = cadena.split(",");
    let key = array_split[0];
    let valor = "";
    var cadUnir = "";
    var x = "";
    var y = "";

    for (let j = 1; j < array_split.length; j++) {
      if (valor === "") {
        valor = array_split[j];
      } else {
        valor += "," + array_split[j];
      }

    }

    x = localStorage.getItem(key);

    if (x === null) {
      console.log(1);
      this.Key_cabecera.push(key);
      console.log(this.Key_cabecera);
      localStorage.setItem(key, valor);
      x = localStorage.getItem(key);
      cadUnir = x;
    } else {
      console.log(2);
      x = localStorage.getItem(key);
      localStorage.setItem(key, valor);
      y = localStorage.getItem(key);
      cadUnir = x + y;
      console.log(3);
      localStorage.setItem(key, cadUnir);
    }
    return cadUnir;
  }

  async ModalUser() {
    const modal = await this.modalController.create({
      component: ModalProfilePage,
      componentProps: { value: 123 },
    });
    return await modal.present();
  }

  async ModalInfo() {
    const modal = await this.modalController.create({
      component: ModalInfoPage,
    });
    return await modal.present();
  }

  onClick() {
    this.json_guardada = [];
    console.log('onClick', this.Key_cabecera);
    if (this.Key_cabecera.length === 0) {
      this.listMessage();
    } else {
      this.Key_cabecera.forEach(element => {
        this.json_guardada.push(JSON.parse(localStorage.getItem(element)));
        console.log(JSON.parse(localStorage.getItem(element)));
      });
    }
  }

  async enviar_datos(tipo, dato) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>Desea guardar el registro?</strong>',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'SI',
          handler: () => {
            console.log('Confirm Okay');
            this.guardar_datos(tipo, dato);
          }
        }
      ]
    });
    await alert.present();
  }


  async guardar_datos(tipo, dato) {
    const loading = await this.loadingController.create({
      message: 'Registrando datos',
    });
    await loading.present();
    dato.FLG_CANAL = '1';
    if (tipo === '1') {
      this.home.postAgregar(dato).subscribe((data: any) => {
        this.loadingController.dismiss()
        if (data.respuesta[':B3'] === '0') {
          this.successAlert(data.respuesta[':B2']);
        } else {
          this.inforAlert(data.respuesta[':B2']);
        }
      }, (err: any) => {
        this.loadingController.dismiss();
        this.errorAlert('Error al enviar trama');
      });
    } else if (tipo === '2') {
      this.home.postMeteoro(dato).subscribe((data: any) => {
        this.loadingController.dismiss()
        if (data.respuesta[':B3'] === '0') {
          this.successAlert(data.respuesta[':B2']);
        } else {
          this.inforAlert(data.respuesta[':B2']);
        }
      }, (err: any) => {
        this.loadingController.dismiss();
        this.errorAlert('Error al enviar trama');
      });
    } else {
      this.home.postAforo(dato).subscribe((data: any) => {
        this.loadingController.dismiss()
        if (data.respuesta[':B3'] === '0') {
          this.successAlert(data.respuesta[':B2']);
        } else {
          this.inforAlert(data.respuesta[':B2']);
        }
      }, (err: any) => {
        this.loadingController.dismiss();
        this.errorAlert('Error al enviar trama');
      });
    }
  }

  async successAlert(success) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>' + success + '</strong>',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.navCtrl.pop();
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async inforAlert(success) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>' + success + '</strong>',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async errorAlert(error) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      // tslint:disable-next-line: prefer-template
      message: '<strong>' + error + '</strong>',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log('Confirm Okay errorAlert');
          this.navCtrl.pop();
        },
      }],
    });
    await alert.present();
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave', this.Key_cabecera);
    // this.Key_cabecera.forEach(element => {
    //   localStorage.removeItem(element);
    // });
    // this.Key_cabecera = [];
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave', this.Key_cabecera);
    // this.Key_cabecera.forEach(element => {
    //   localStorage.removeItem(element);
    // });
    // this.Key_cabecera = [];
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload', this.Key_cabecera);
    // this.Key_cabecera.forEach(element => {
    //   localStorage.removeItem(element);
    // });
    // this.Key_cabecera = [];
  }

  ionViewCanLeave() {
    console.log('ionViewCanLeave', this.Key_cabecera);
    // this.Key_cabecera.forEach(element => {
    //   localStorage.removeItem(element);
    // });
    // this.Key_cabecera = [];
  }

  ngOnDestroy() {
    console.log('ngOnDestroy', this.Key_cabecera);
    // this.Key_cabecera.forEach(element => {
    //   localStorage.removeItem(element);
    // });
    // this.Key_cabecera = [];
  }

}
