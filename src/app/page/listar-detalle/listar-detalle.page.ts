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
  selector: 'app-listar-detalle',
  templateUrl: './listar-detalle.page.html',
  styleUrls: ['./listar-detalle.page.scss'],
})
export class ListarDetallePage implements OnInit {

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  backButtonSubscription;
  estacion: any;
  tipo: any;
  lecturas: any;
  //
  cabecera: any = {};
  fecha: any;
  formularioAforo: FormGroup;
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
        .getING_EVENTO_MOV_WEB_LISTAR(this.activatedRoute.snapshot.paramMap.get('id'))
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
        .getING_AFORO_MOV_WEB_LISTAR(this.activatedRoute.snapshot.paramMap.get('id'))
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
        .getING_MOVIL_WEB_LISTAR(this.activatedRoute.snapshot.paramMap.get('id'))
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

  btn_detalle(ID_CABECERA) {
    console.log(this.activatedRoute.snapshot.paramMap.get('tipo'));
    if (this.activatedRoute.snapshot.paramMap.get('tipo') === '2') {
      this.sqlite
        .getING_EVENTO_MOV_WEB_ID(ID_CABECERA)
        .then(result => {
          console.log(result);
          var obj = JSON.parse(result[0].FORM);
          this.openModal(obj, 2);
        })
        .catch(err => {
          console.log('Error getLectura: ', err);
        });
    } else if (this.activatedRoute.snapshot.paramMap.get('tipo') === '3') {
      this.sqlite
        .getING_AFORO_MOV_WEB_ID(ID_CABECERA)
        .then(result => {
          var obj = JSON.parse(result[0].FORM);
          this.openModal(obj, 3);
        })
        .catch(err => {
          console.log('Error getLectura: ', err);
        });
    } else {
      this.sqlite
        .getING_MOVIL_WEB_ID(ID_CABECERA)
        .then(result => {
          var obj = JSON.parse(result[0].FORM);
          this.openModal(obj, 1);
        })
        .catch(err => {
          console.log('Error getLectura: ', err);
        });
    }
  }

  /// ------------ MODAL -------------- ///

  async openModal(myForm, dato) {
    const modal = await this.modalController.create({
      component: ModalResumenPage,
      componentProps: { form: myForm, datos: dato, btn: 2 }
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned);
      if (dataReturned.data !== undefined) {
        console.log('La data no es undefined')
      } else {
        console.log('La data si es undefined')
      }
    });
    return await modal.present();
  }

  /// ----------------------------- ///

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
      } else if (this.router.url === '/listar-detalle/' + this.activatedRoute.snapshot.paramMap.get('id') + '/' + this.activatedRoute.snapshot.paramMap.get('tipo')) {
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
}
