import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { ActionSheetController, AlertController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { timeout } from 'rxjs/operators';
import { DatePicker } from '@ionic-native/date-picker/ngx';
// Services
import { HomeService } from '../../services/home/home.service';
import { ConnectionStatus, NetworkService } from '../../services/network/network.service';
import { SqliteService } from '../../services/sqlite/sqlite.service';
// Modal
import { ModalResumenPage } from './../modal-resumen/modal-resumen.page';
declare var SMS: any;

@Component({
  selector: 'app-aforo',
  templateUrl: './aforo.page.html',
  styleUrls: ['./aforo.page.scss'],
})
export class AforoPage implements OnInit {

  options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  backButtonSubscription;
  estacion: any;
  //
  myDateTime = new Date().toISOString();
  cabecera: any = {};
  fecha: any;
  formularioAforo: FormGroup;
  cantCaracteres = 120;
  particiones;
  array = [];
  numeros = [];

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
    public toastCtrl: ToastController,
    private datePicker: DatePicker
  ) {
    this.sqlite.getNumero(1).then((data) => {
      console.log(data);
      data.forEach(element => {
        this.numeros.push(element.NUMERO);
      });
      console.log(this.numeros);
    });;
    this.networkService.coordenadas();
    this.fecha = moment(new Date()).format('DD/MM/YYYY, H:mm:ss');
    this.formularioAforo = this.fb.group({
      inicio: [((new Date()).toLocaleDateString('ja-JP', this.options)).split('/').join('-'), [Validators.required]],
      nivel_inicio: ['', [Validators.required]],
      fin: [((new Date()).toLocaleDateString('ja-JP', this.options)).split('/').join('-'), [Validators.required]],
      nivel_fin: ['', [Validators.required]],
      caudal: ['', [Validators.required]],
      velocidad: ['', [Validators.required]],
      area: ['', [Validators.required]],
      ancho: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    await this.getEstacion();
  }

  /// ------------ MODAL -------------- ///

  async openModal() {
    console.log(this.formularioAforo.value);
    if (this.formularioAforo.get('inicio').value > this.formularioAforo.get('fin').value) {
      this.inforAlert('La fecha y hora inical no deben ser mayores a La fecha y hora final');
    } else {
      const modal = await this.modalController.create({
        component: ModalResumenPage,
        componentProps: { form: this.formularioAforo.value, datos: 3, btn: 1 }
      });
      modal.onDidDismiss().then((dataReturned) => {
        console.log(dataReturned);
        if (dataReturned.data !== undefined) {
          console.log('La data no es undefined');
          this.btnRegistrar();
        } else {
          console.log('La data si es undefined')
        }
      });
      return await modal.present();
    }
  }

  /// ----------------------------- ///

  btnRegistrar() {
    console.log(this.formularioAforo.value);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    this.networkService.onNetworkChange().subscribe(async (status: ConnectionStatus) => {
      if (status === ConnectionStatus.Online) {
        const loading = await this.loadingController.create({
          message: 'Registrando Aforo',
        });
        await loading.present();
        this.cabecera.V_COD_ESTA = localStorage.getItem('V_COD_ESTA');
        this.cabecera.FECHA_REGISTRO = ((new Date()).toLocaleDateString('ja-JP', options)).split('/').join('-');
        this.cabecera.FECHA_MOVIL = ((new Date()).toLocaleDateString('ja-JP', options)).split('/').join('-');
        this.cabecera.ID_USUARIO = localStorage.getItem('ID_USUARIO');
        this.cabecera.NUM_LATITUD = this.networkService.latitude;
        this.cabecera.NUM_LONGITUD = this.networkService.longitude;
        this.cabecera.FLG_CANAL = '0';
        this.cabecera.FLG_MEDIO = '1';
        this.cabecera.FLG_TRANSAC = '1';
        this.cabecera.TIPO_ENVIO = '3';
        this.cabecera.DETALLE = '1' + '/' + ((new Date(this.formularioAforo.value.inicio)).toLocaleDateString('ja-JP', options)).split('/').join('-') + '|' + '3' + '/' + this.formularioAforo.value.nivel_inicio + '|' + '2' + '/' + ((new Date(this.formularioAforo.value.fin)).toLocaleDateString('ja-JP', options)).split('/').join('-') + '|' + '4' + '/' + this.formularioAforo.value.nivel_inicio + '|' + '5' + '/' + this.formularioAforo.value.caudal + '|' + '6' + '/' + this.formularioAforo.value.velocidad + '|' + '7' + '/' + this.formularioAforo.value.area + '|' + '8' + '/' + this.formularioAforo.value.ancho;
        console.log(this.cabecera);
        let detalle = JSON.stringify(this.cabecera);
        let detalle_form = JSON.stringify(this.formularioAforo.value);
        this.home.postAforo(this.cabecera).pipe(timeout(30000)).subscribe((data: any) => {
          console.log(data);
          this.loadingController.dismiss()
          if (data.respuesta[':B3'] === '0') {
            let flag = "1";
            this.sqlite.addING_AFORO_MOV_WEB({ ID_CABECERA: null, V_COD_ESTA: this.cabecera.V_COD_ESTA, FECHA_MOVIL: this.cabecera.FECHA_MOVIL, DETALLE: detalle, FORM: detalle_form, FLAG: flag }).then((dato) => {
              this.successAlert(data.respuesta[':B2']);
              console.log('Se guardo a la BD local');
            });
          } else {
            this.inforAlert(data.respuesta[':B2']);
          }
        }, (err: any) => {
          loading.dismiss();
          this.tramaAlert(detalle, detalle_form);
          console.log('Error al enviar viar datos: ', err);
        });
      } else {
        console.log('Sin datos activados');
        this.sindatoAlert();
      }
    });
  }

  async respuestaFail(error: any) {
    console.log(error);
    const alert = await this.alertController.create({
      header: 'Error de servidor',
      backdropDismiss: false,
      message: '<strong>' + error.message + '</strong>',
      buttons: ['OK'],
    });
    await alert.present();
  }

  getEstacion() {
    this.sqlite
      .getEstacionId(this.activatedRoute.snapshot.paramMap.get('id'))
      .then(result => {
        this.estacion = result[0];
        console.log(result[0]);
        console.log(this.estacion);
      })
      .catch(err => {
        console.log('Error getEstacion: ', err);
      });
  }

  blurInicio($event) {
    console.log($event.target.value);
    if (parseInt($event.target.value) < 0) {
      this.formularioAforo.controls.nivel_inicio.setValue('')
      this.valiAlert('El Valores de nivel inicial estan fuera de rango: 0')
    } else if (parseInt($event.target.value) > 19) {
      this.formularioAforo.controls.nivel_inicio.setValue('')
      this.valiAlert('El Valores de nivel inicial estan fuera de rango: 19')
    } else {
      console.log($event.target.value);
    }
  }

  blurFin($event) {
    if (parseInt($event.target.value) < 0) {
      this.formularioAforo.controls.nivel_fin.setValue('')
      this.valiAlert('El Valores de nivel final estan fuera de rango: 0')
    } else if (parseInt($event.target.value) > 19) {
      this.formularioAforo.controls.nivel_fin.setValue('')
      this.valiAlert('El Valores de nivel final estan fuera de rango: 19')
    } else {
      console.log($event.target.value);
    }
  }

  blurCaudal($event) {
    if (parseInt($event.target.value) < 0) {
      this.formularioAforo.controls.caudal.setValue('')
      this.valiAlert('El Valores de caudal estan fuera de rango: 0')
    } else if (parseInt($event.target.value) > 55420) {
      this.formularioAforo.controls.caudal.setValue('')
      this.valiAlert('El Valores de caudal estan fuera de rango: 55420')
    } else {
      console.log($event.target.value);
    }
  }

  blurVelo($event) {
    if (parseInt($event.target.value) < 0) {
      this.formularioAforo.controls.velocidad.setValue('')
      this.valiAlert('El Valores de velocidad estan fuera de rango: 0')
    } else if (parseInt($event.target.value) > 5) {
      this.formularioAforo.controls.velocidad.setValue('')
      this.valiAlert('El Valores de velocidad estan fuera de rango: 5')
    } else {
      console.log($event.target.value);
    }
  }

  blurArea($event) {
    if (parseInt($event.target.value) < 0) {
      this.formularioAforo.controls.area.setValue('')
      this.valiAlert('El Valores de área estan fuera de rango: 0')
    } else if (parseInt($event.target.value) > 11084) {
      this.formularioAforo.controls.area.setValue('')
      this.valiAlert('El Valores de área estan fuera de rango: 11084')
    } else {
      console.log($event.target.value);
    }
  }

  /// -------------- GUARDAR A LA BD LOCAL --------------- ///

  async guardar_local(detalle, detalle_form) {
    const loading = await this.loadingController.create({
      message: 'Registrando localmente el Meteoro',
    });
    await loading.present();
    let flag = "3";
    this.sqlite.addING_AFORO_MOV_WEB({ ID_CABECERA: null, V_COD_ESTA: this.cabecera.V_COD_ESTA, FECHA_MOVIL: this.cabecera.FECHA_MOVIL, DETALLE: detalle, FORM: detalle_form, FLAG: flag }).then((dato) => {
      console.log('Se guardo a la BD local');
      loading.dismiss();
      this.navCtrl.pop();
    }, (err: any) => {
      loading.dismiss();
      console.log('guardar_local error: ' + err);
    });
  }

  async guardar_local_via_sms(detalle, detalle_form) {
    let flag = "2";
    this.sqlite.addING_AFORO_MOV_WEB({ ID_CABECERA: null, V_COD_ESTA: this.cabecera.V_COD_ESTA, FECHA_MOVIL: this.cabecera.FECHA_MOVIL, DETALLE: detalle, FORM: detalle_form, FLAG: flag }).then((dato) => {
      console.log('Se guardo a la BD local');
      this.navCtrl.pop();
    }, (err: any) => {
      console.log('guardar_local error: ' + err);
    });
  }

  //////------------ ------- -------------//////

  //////------------ Alertas -------------//////
  async tramaAlert(detalle, detalle_form) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>No se puede enviar el registro por datos móviles</strong>',
      buttons: [
        {
          text: 'ENVIAR SMS',
          handler: () => {
            console.log('Confirm SMS');
            this.separarCadena(detalle, detalle_form);
            alert.dismiss();
          }
        }, {
          text: 'ENVIAR LUEGO',
          handler: () => {
            console.log('Confirm reintentar');
            this.guardar_local(detalle, detalle_form);
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

  async sindatoAlert() {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: '<strong>Por favor, active los datos moviles</strong>',
      buttons: ['ACEPTAR'],
      backdropDismiss: false,
    });
    await alert.present();
  }

  async valiAlert(message) {
    await this.keyboard.hide();
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>' + message + '</strong>',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  //////------------ Fin Alertas -------------/////

  //////------------ Enviar SMS -------------/////

  obtCodEsta(cadena) {
    console.log('obtCodEsta : ', cadena);
    var json_object = JSON.parse(cadena);
    var codEsta = json_object.V_COD_ESTA;
    return codEsta;
  }

  obtFechaHora() {
    var fecHora = "";
    var fecha = new Date();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var anio = fecha.getFullYear();
    var hora = fecha.getHours();
    var minuto = fecha.getMinutes();
    var segundo = fecha.getSeconds();
    if (mes < 10)
      mes = 0 + mes;
    if (dia < 10)
      dia = 0 + dia;
    if (hora < 10)
      hora = 0 + hora;
    if (minuto < 10)
      minuto = 0 + minuto;
    if (segundo < 10)
      segundo = 0 + segundo;

    fecHora = anio + "" + mes + "" + dia + "" + hora + "" + minuto + "" + segundo;
    return fecHora;
  }

  separarCadena(cadena, detalle_form) {
    this.cantCaracteres = 120;
    this.particiones;
    this.array = [];
    console.log('separarCadena : ', cadena);
    let key = this.obtFechaHora() + "" + this.obtCodEsta(cadena);
    console.log('key : ', key);
    this.particiones = cadena.length / this.cantCaracteres;
    for (let i = 0; i < this.particiones; i++) {
      var cadSeparada = cadena.substring(0, this.cantCaracteres);
      this.array.push([key, cadSeparada]);
      cadena = cadena.substring(this.cantCaracteres, cadena.length);
    }
    this.send(this.array).then((result) => {
      this.guardar_local_via_sms(cadena, detalle_form)
      console.log('Se envio el mensaje: ', result);
    });
  }

  async send(obj) {
    const loading = await this.loadingController.create({
      message: 'Enviando mensaje de texto',
    });
    await loading.present();
    console.log(obj.length);
    obj.forEach(element => {
      element = element.toString();
      element = element.replace(/}/g, ')');
      element = element.replace(/{/g, '(');
      console.log(element.length);
      console.log(element);
      if (SMS) {
        SMS.sendSMS(this.numeros, element, (ListSms) => {
          console.log(ListSms);
          loading.dismiss();
          this.presentToast('Mensaje enviado exitosamente');
        }, (error) => {
          loading.dismiss();
          this.navCtrl.pop();
          console.log(error);
          this.presentToast('Fracaso el enviado del mensaje');
        });
      }
    });
  }

  async presentToast(Message: any) {
    const toast = await this.toastCtrl.create({
      message: Message,
      duration: 3000,
    });
    toast.present();
  }

  //////------------ Fin SMS -------------/////

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
        console.log(this.router.url);
        // tslint:disable-next-line: max-line-length
      } else if (this.router.url === '/aforo/' + this.activatedRoute.snapshot.paramMap.get('id')) {
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
        message: '<strong>¿Esta seguro de salir?<br>Se perdera el registro</strong>',
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
        message: '<strong>¿Esta seguro de salir?<br>Se perdera el registro</strong>',
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

  async showDateTimepicker_inicio() {
    let topLoader = await this.alertController.getTop(); {
      if (topLoader) { } else {
        this.datePicker.show({
          date: new Date(),
          mode: 'datetime',
          androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
          doneButtonLabel: "Save Date & Time",
          is24Hour: false
        }).then(
          dateTime => {
            this.formularioAforo.controls['inicio'].setValue(dateTime.toLocaleDateString('ja-JP', this.options).split('/').join('-'));
          },
          err => console.log('Error occurred while getting dateTime: ', err)
        );
      }
    }
  }

  async showDateTimepicker_fin() {
    let topLoader = await this.alertController.getTop(); {
      if (topLoader) { } else {
        this.datePicker.show({
          date: new Date(),
          mode: 'datetime',
          androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
          doneButtonLabel: "Save Date & Time",
          is24Hour: false
        }).then(
          dateTime => {
            this.formularioAforo.controls['fin'].setValue(dateTime.toLocaleDateString('ja-JP', this.options).split('/').join('-'));
          },
          err => console.log('Error occurred while getting dateTime: ', err)
        );
      }
    }

  }

}
