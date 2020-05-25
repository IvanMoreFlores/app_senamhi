import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { AlertController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
// Services
import { HomeService } from '../../services/home/home.service';
import { SqliteService } from '../../services/sqlite/sqlite.service';
import { ModalBirthdayPage } from '../modal-birthday/modal-birthday.page';
// Modal
import { ModalProfilePage } from '../modal-profile/modal-profile.page';
import { ModalResetPage } from '../modal-reset/modal-reset.page';
import { ModalInfoPage } from '../modal-info/modal-info.page';

declare var SMS: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit, OnDestroy {
  mySMS: any[] = [];
  sexo: String;
  genero:String;
  observador: String = localStorage.getItem('NOMBRES') + ', '
    + localStorage.getItem('APE_PATERNO') + ' '
    + localStorage.getItem('APE_MATERNO');
  estaciones: any[] = [];
  backButtonSubscription;
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  constructor(
    public modalController: ModalController,
    private router: Router,
    public navCtrl: NavController,
    public platform: Platform,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    public Home: HomeService,
    public sqlite: SqliteService,
  ) {
    if (localStorage.getItem('GENERO') === 'M') {
      this.genero = 'Observador';
      this.sexo = 'assets/img/man.svg';
    } else {
      this.genero = 'Observadora';
      this.sexo = 'assets/img/girl.svg';
    }
    // this.platform.ready().then(() => {
    //   if (SMS) {
    //     SMS.startWatch((ListSms) => {
    //       console.log('watching', 'watching started');
    //     }, (error) => {
    //       console.log('failed to start watching');
    //     });
    //   }
    // });
  }

  async ngOnInit() {
    this.platform.ready().then(async (readySource) => {
      console.log('Platform ready from', readySource);
      await this.ModalReset();
      await this.ModalBirthday();
      await this.getEstacion();
    });
    // this.listMessage();
    // this.ReadListSMS();
    // this.ExpectingSMS();
    // document.addEventListener('onSMSArrive', (ListSms) => {
    //   this.listMessage();
    // });
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
      this.getEstacion();
    }, 2000);
  }

  getEstacion() {
    this.sqlite.createBD().then((result) => {
      this.sqlite.countEstacion().then((countEstacion) => {
        console.log(countEstacion);
        if (countEstacion === 0) {
          console.log('getEstacionOnline');
          this.getEstacionOnline();
        } else {
          console.log('getEstacionOffline');
          this.getEstacionOffline();
        }
      }).catch((error) => {
        this.respuestaFail(error);
      });
    }).catch((err) => {
      console.log(err);
      this.respuestaFail(err);
    });
  }

  getEstacionOnline() {
    this.Home.getEstacion({ id_usuario: localStorage.getItem('ID_USUARIO') }).pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        this.errorAlert(result.error);
      } else {
        this.estaciones = result;
        this.postEtacionOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log(err);
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  getEstacionOffline() {
    this.sqlite.getEstacion().then((result) => {
      this.estaciones = result;
    }).catch((err) => {
      this.respuestaFail(err);
    });
  }

  postEtacionOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addEstacion({ V_COD_ESTA: element.V_COD_ESTA, V_NOM_ESTA: element.V_NOM_ESTA, V_COD_TIPO: element.V_COD_TIPO, DESC_TIPO_ESTA: element.DESC_TIPO_ESTA }).then((result) => {
        this.sqlite.getEstacion().then((resulte) => {
        }).catch((error) => {
          this.respuestaFail(error);
        });
      }).catch((err) => {
        this.respuestaFail(err);
      });
    });
  }

  async ModalBirthday() {
    const hoy = new Date();
    const nacimiento = new Date(localStorage.getItem('FECHA_NACIMIENTO'));
    // tslint:disable-next-line: max-line-length
    if (nacimiento.getDate() === hoy.getDate() && (nacimiento.getMonth() + 1) === (hoy.getMonth() + 1)) {
      console.log('Hoy es su cumpleaños');
      const modal = await this.modalController.create({
        component: ModalBirthdayPage,
        backdropDismiss: false,
      });
      return await modal.present();
    }
    console.log('Hoy no es su cumpleaños');
  }

  async ModalReset() {
    if (localStorage.getItem('FLG_NUEVO') === '0') {
      console.log('Es nuevo');
      const modal = await this.modalController.create({
        component: ModalResetPage,
        backdropDismiss: false,
      });
      return await modal.present();
    }
    console.log('No es nuevo');

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

  async detailAlert(V_COD_TIPO: string, V_COD_ESTA: String) {
    this.dismissAllalerts();
    localStorage.setItem('V_COD_ESTA', '' + V_COD_ESTA)
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>Esta seguro de iniciar el modulo seleccionado?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: detailAlert');
          },
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay detailAlert');
            if (V_COD_TIPO === 'M') {
              this.router.navigate(['/meteorologia', V_COD_ESTA, V_COD_TIPO]);
            } else {
              this.router.navigate(['/hidrologia', V_COD_ESTA, V_COD_TIPO]);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async errorAlert(error) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      // tslint:disable-next-line: prefer-template
      message: '<strong>' + error + '</strong>',
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  async sinAlert(error) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      // tslint:disable-next-line: prefer-template
      message: '<strong>' + error + '</strong>',
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  async respuestaFail(error: any) {
    const alert = await this.alertController.create({
      header: 'Error de servidor',
      backdropDismiss: false,
      // tslint:disable-next-line: prefer-template
      message: '<strong>' + error.message + '</strong>',
      buttons: ['OK'],
    });
    await alert.present();
  }

  ionViewDidEnter() {
    // this.getParametroOffline();
    console.log(this.router.url);
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
        // tslint:disable-next-line: max-line-length
        // tslint:disable-next-line: prefer-template
      } else {
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
        header: 'Mensaje!',
        // subHeader: '¿Esta seguro de salir?',
        message: '<strong>¿Esta seguro de salir?</strong>',
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
              navigator['app'].exitApp();
            },
          },
        ],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje!',
        // subHeader: '¿Esta seguro de salir?',
        message: '<strong>¿Esta seguro de salir?</strong>',
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
              navigator['app'].exitApp();
            },
          },
        ],
      });
      await alert.present();
    }
  }

  ngOnDestroy() {
    console.log('ngOnDestroy en Home');
    this.backButtonSubscription.unsubscribe();
  }

  /// -------------- FUNCION PARA VER ESTADO DEL ALERT ------------ ///

  async dismissAllalerts() {
    let topLoader = await this.alertController.getTop();
    console.log(topLoader);
    while (topLoader) {
      if (!(await topLoader.dismiss())) {
        throw new Error('Could not dismiss the topmost alert. Aborting...');
      }
      topLoader = await this.alertController.getTop();
    }
  }

  /// ------------------------------------------------------------ ///

  // Funciones de SMS //

  send() {
    let obj: any;
    obj = {
      name: 'John',
      age: 30,
      city: 'New York',
      contactPerson: {
        name: 'Ivan',
        cellphone: {
          name: 'Ivan',
          cellphone: 990391969,
        },
      },
    };
    console.log('JSON', JSON.stringify(obj));
    obj = JSON.stringify(obj);
    obj = obj.replace(/}/g, ')');
    obj = obj.replace(/{/g, '(');
    console.log(obj.length);
    console.log(obj);
    if (SMS) {
      SMS.sendSMS(['968169082', '990391969'], obj, (ListSms) => {
        console.log(ListSms);
        this.presentToast('Mensaje enviado exitosamente');
      }, (error) => {
        console.log(error);
        this.presentToast('Fracaso el enviado del mensaje');
      });
    }
  }

  async presentToast(Message: any) {
    const toast = await this.toastCtrl.create({
      message: Message,
      duration: 3000,
    });
    toast.present();
  }

  deleteMessage(id: any) {
    console.log(id);
    const filter = {
      box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
      // the following 4 filters are OR relationship
      _id: id, // given a sms id, recommend ONLY use this filter
      // read: 1, // delete all read SMS
      // address: '+8613601234567', // delete all SMS from this phone number
      // body: 'Test is a test SMS' // delete SMS by content
    };
    if (SMS) {
      SMS.deleteSMS(filter, (ListSms) => {
        this.presentToast('Mensaje eliminado exitosamente');
        this.listMessage();
      },
        (Error: any) => {
          this.presentToast('Error al eliminar mensaje');
          this.listMessage();
        });
    }
  }


  listMessage() {
    this.mySMS = [];
    this.platform.ready().then((readySource) => {
      let primer: any;
      const filter = {
        box: 'inbox', // 'inbox' (default), 'sent', 'draft'
        indexFrom: 0, // start from index 0
        maxCount: 30, // count of SMS to return each time
      };
      if (SMS) {
        SMS.listSMS(filter, (ListSms) => {

          ListSms.forEach(element => {
            if (element.body.charAt(0) === '(') {
              primer = element.body;
              primer = primer.replace(/([(])/g, '{');
              primer = primer.replace(/([)])/g, '}');
              primer = primer.trim();
              primer = primer.replace(/(\w+:)|(\w+ :)/g, function (matchedStr) {
                return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
              });
              primer = JSON.parse(primer);
              primer.address = element.address;
              primer._id = element._id;
              this.mySMS.push(primer);
            } else {
            }
          });
          console.log(ListSms);
          console.log(this.mySMS);
        },
          (Error: any) => {
            console.log('error list sms: ' + Error);
          });
      }
    });
  }
}

