import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { IonRouterOutlet, NavController, Platform, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
// Services
import { HomeService } from '../../services/home/home.service';
import { ConnectionStatus, NetworkService } from '../../services/network/network.service';
import { SqliteService } from '../../services/sqlite/sqlite.service';
// Modal
import { ModalResumenPage } from './../modal-resumen/modal-resumen.page';

@Component({
  selector: 'app-reenviar-detalle',
  templateUrl: './reenviar-detalle.page.html',
  styleUrls: ['./reenviar-detalle.page.scss'],
})
export class ReenviarDetallePage implements OnInit {

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  backButtonSubscription;
  estacion: any;
  tipo: any;
  lecturas: any;
  //
  cabecera: any = {};
  fecha: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sqlite: SqliteService,
    public platform: Platform,
    public navCtrl: NavController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public home: HomeService,
    private networkService: NetworkService,
    public fb: FormBuilder,
    public loadingController: LoadingController,
    private keyboard: Keyboard,
    public modalController: ModalController,
  ) { }

  async ngOnInit() {
    await this.getEstacion();
    await this.getLectura();
  }

  getLectura() {
    console.log(this.activatedRoute.snapshot.paramMap.get('tipo'));
    if (this.activatedRoute.snapshot.paramMap.get('tipo') === '2') {
      this.sqlite
        .getING_EVENTO_MOV_WEB(this.activatedRoute.snapshot.paramMap.get('id'), '3')
        .then(result => {
          console.log(result.length);
          if (result.length === 0) {
            this.sindatoAlert();
          } else {
            this.lecturas = result;
          }
        })
        .catch(err => {
          console.log('Error getLectura: ', err);
        });
    } else if (this.activatedRoute.snapshot.paramMap.get('tipo') === '3') {
      this.sqlite
        .getING_AFORO_MOV_WEB(this.activatedRoute.snapshot.paramMap.get('id'), '3')
        .then(result => {
          console.log(result.length);
          if (result.length === 0) {
            this.sindatoAlert();
          } else {
            this.lecturas = result;
          }
        })
        .catch(err => {
          console.log('Error getLectura: ', err);
        });
    } else {
      this.sqlite
        .getING_MOVIL_WEB(this.activatedRoute.snapshot.paramMap.get('id'), '3')
        .then(result => {
          console.log(result.length);
          if (result.length === 0) {
            this.sindatoAlert();
          } else {
            this.lecturas = result;
          }
        })
        .catch(err => {
          console.log('Error getLectura: ', err);
        });
    }
  }

  getEstacion() {
    this.sqlite
      .getEstacionId(this.activatedRoute.snapshot.paramMap.get('id'))
      .then(result => {
        this.estacion = result[0];
      })
      .catch(err => {
        console.log('Error getEstacion: ', err);
      });
  }

  async sindatoAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: 'No se encontro ningun registro',
      buttons: [{
        text: 'ACEPTAR',
        handler: () => {
          console.log('Confirm Okay');
          this.backButtonSubscription.unsubscribe();
          this.navCtrl.pop();
        }
      }]
    });
    await alert.present();
  }

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
        console.log(this.router.url);
        // tslint:disable-next-line: max-line-length
      } else if (this.router.url === '/reenviar-detalle/' + this.activatedRoute.snapshot.paramMap.get('id') + '/' + this.activatedRoute.snapshot.paramMap.get('tipo')) {
        this.alertController.dismiss().then((result) => {
          console.log(result);
        }).catch((err) => {

        });
        this.salirAlertConfirm();
      }
    });
  }

  async salirAlertConfirm() {
    let topLoader = await this.alertController.getTop();
    if (topLoader) {
      topLoader.dismiss();
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        message: '<strong>¿Esta seguro de salir?<br></strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            },
          }, {
            text: 'Aceptar',
            handler: () => {
              console.log('Confirm Okay');
              this.backButtonSubscription.unsubscribe();
              this.navCtrl.pop();
            },
          },
        ],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        message: '<strong>¿Esta seguro de salir?<br></strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            },
          }, {
            text: 'Aceptar',
            handler: () => {
              console.log('Confirm Okay');
              this.backButtonSubscription.unsubscribe();
              this.navCtrl.pop();
            },
          },
        ],
      });
      await alert.present();
    }
  }

  btn_detalle(ID_CABECERA) {
    console.log(this.activatedRoute.snapshot.paramMap.get('tipo'));
    if (this.activatedRoute.snapshot.paramMap.get('tipo') === '2') {
      this.sqlite
        .getING_EVENTO_MOV_WEB_ID(ID_CABECERA)
        .then(result => {
          console.log(result);
          var obj = JSON.parse(result[0].FORM);
          console.log(obj);
          console.log(result[0]);
          this.openModal(result[0], obj, 2, ID_CABECERA, 2);
        })
        .catch(err => {
          console.log('Error getLectura: ', err);
        });
    } else if (this.activatedRoute.snapshot.paramMap.get('tipo') === '3') {
      this.sqlite
        .getING_AFORO_MOV_WEB_ID(ID_CABECERA)
        .then(result => {
          var obj = JSON.parse(result[0].FORM);
          this.openModal(result[0], obj, 2, ID_CABECERA, 3);
        })
        .catch(err => {
          console.log('Error getLectura: ', err);
        });
    } else {
      this.sqlite
        .getING_MOVIL_WEB_ID(ID_CABECERA)
        .then(result => {
          var obj = JSON.parse(result[0].FORM);
          this.openModal(result[0], obj, 2, ID_CABECERA, 1);
        })
        .catch(err => {
          console.log('Error getLectura: ', err);
        });
    }
  }

  /// ------------------ MODAL -------------------- ///

  async openModal(result, myForm, dato, ID_CABECERA, tipo) {
    var det = JSON.parse(result.DETALLE);
    console.log('det : ', det);
    console.log('myForm: ', myForm);
    const modal = await this.modalController.create({
      component: ModalResumenPage,
      componentProps: { form: myForm, datos: dato, btn: 1 }
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned);
      if (dataReturned.data !== undefined) {
        console.log(det);
        if (tipo === 1) {
          this.registrar(det, ID_CABECERA);
        } else if (tipo === 2) {
          this.registrar_mete(det, ID_CABECERA);
        } else {
          this.registrar_afo(det, ID_CABECERA);
        }
        console.log('La data no es undefined')
      } else {
        console.log('La data si es undefined')
      }
    });
    return await modal.present();
  }

  /// -------------------------------------------- ///
  /// ------------- REGISTRAR DATA --------------- ///

  async registrar(result, ID_CABECERA) {
    const loading = await this.loadingController.create({
      message: 'Registrando datos pendientes',
    });
    await loading.present();
    this.home.postAgregar(result).subscribe((data) => {
      this.loadingController.dismiss()
      if (data.respuesta[':B3'] === '0') {
        this.sqlite.updateTableING_MOVIL_MOV_WEB(ID_CABECERA);
        this.successAlert(data.respuesta[':B2']);
      } else {
        this.inforAlert(data.respuesta[':B2']);
      }
    }, (err: any) => {
      this.loadingController.dismiss();
      this.respuestaFail(err);
    });
  }

  async registrar_mete(result, ID_CABECERA) {
    const loading = await this.loadingController.create({
      message: 'Registrando datos pendientes',
    });
    await loading.present();
    this.home.postMeteoro(result).subscribe((data) => {
      this.loadingController.dismiss()
      if (data.respuesta[':B3'] === '0') {
        this.sqlite.updateTableING_EVENTO_MOV_WEB(ID_CABECERA);
        this.successAlert(data.respuesta[':B2']);
      } else {
        this.inforAlert(data.respuesta[':B2']);
      }
    }, (err: any) => {
      this.loadingController.dismiss();
      this.respuestaFail(err);
    });
  }

  async registrar_afo(result, ID_CABECERA) {
    const loading = await this.loadingController.create({
      message: 'Registrando datos pendientes',
    });
    await loading.present();
    this.home.postAforo(result).subscribe((data) => {
      this.loadingController.dismiss()
      if (data.respuesta[':B3'] === '0') {
        this.sqlite.updateTableING_AFORO_MOV_WEB(ID_CABECERA);
        this.successAlert(data.respuesta[':B2']);
      } else {
        this.inforAlert(data.respuesta[':B2']);
      }
    }, (err: any) => {
      this.loadingController.dismiss();
      this.respuestaFail(err);
    });
  }

  /// -------------------------------------------- ///

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

  async respuestaFail(error: any) {
    console.log(error);
    const alert = await this.alertController.create({
      header: 'Error de servidor',
      backdropDismiss: false,
      // tslint:disable-next-line: prefer-template
      message: '<strong>' + error.message + '</strong>',
      buttons: ['OK'],
    });
    await alert.present();
  }
}


