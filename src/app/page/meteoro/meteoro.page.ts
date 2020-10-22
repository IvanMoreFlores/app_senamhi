import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { ActionSheetController, AlertController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Plugin
import * as moment from 'moment';
import { timeout } from 'rxjs/operators';
import { DatePicker } from '@ionic-native/date-picker/ngx';
// Services
import { HomeService } from '../../services/home/home.service';
import { ConnectionStatus, NetworkService } from '../../services/network/network.service';
import { SqliteService } from '../../services/sqlite/sqlite.service';
import { SmsService } from './../../services/sms/sms.service';
// Modal
import { ModalResumenPage } from './../modal-resumen/modal-resumen.page';
declare var SMS: any;

@Component({
  selector: 'app-meteoro',
  templateUrl: './meteoro.page.html',
  styleUrls: ['./meteoro.page.scss'],
})
export class MeteoroPage implements OnInit {
  options_fecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
  options_hora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  estacion: any;
  myDateTime = new Date().toISOString();
  backButtonSubscription;
  ocurrencias: any;
  eventos: any;
  cabecera: any = {};
  fecha: any;
  formularioMeteoro: FormGroup;
  coPargInicio: String;
  coCorpInicio: String;
  coPargFin: String;
  coCorpFin: String;
  cantCaracteres = 120;
  particiones;
  array = [];
  date = new Date();
  numeros = [];

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

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
    public modalController: ModalController,
    public sms: SmsService,
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
    this.cabecera.FLG_HORA_INICIO = 1;
    this.cabecera.FLG_HORA_FIN = 1;
    // date.getHours()+":"+date.getMinutes();
    this.networkService.coordenadas();
    this.fecha = moment(new Date()).format('DD/MM/YYYY, H:mm:ss');
    this.formularioMeteoro = this.fb.group({
      evento: ['', [Validators.required]],
      ocurrencia: ['', [Validators.required]],
      inicio_fecha: [((new Date()).toLocaleDateString('ja-JP', this.options_fecha)).split('/').join('-'), [Validators.required]],
      inicio_hora: [this.date.getHours() + ":" + this.date.getMinutes(), [Validators.required]],
      fin_fecha: [((new Date()).toLocaleDateString('ja-JP', this.options_fecha)).split('/').join('-'), [Validators.required]],
      fin_hora: [this.date.getHours() + ":" + this.date.getMinutes(), [Validators.required]],
    });
  }


  async ngOnInit() {
    await this.getEstacion();
    await this.getOcurrencia();
    await this.getEventos();
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

  getOcurrencia() {
    this.sqlite
      .getOcurrencia()
      .then(result => {
        this.ocurrencias = result;
      })
      .catch(err => {
        console.log('Error getOcurrencia: ', err);
      });
  }

  getEventos() {
    this.sqlite
      .getParaEvento()
      .then(result => {
        this.eventos = result;
      })
      .catch(err => {
        console.log('Error getEventos: ', err);
      });
  }

  changeEvento(event) {
    console.log(event.detail.value);
    if (this.formularioMeteoro.get('ocurrencia').value === '') {
      console.log('Ocurrencia esta vacio : ' + this.formularioMeteoro.get('ocurrencia').value);
    } else {
      this.sqlite.getEvento_x_para(event.detail.value, this.formularioMeteoro.get('ocurrencia').value).then((data => {
        this.coPargInicio = data[0].C_COD_PARAG;
        this.coCorpInicio = data[0].C_COD_CORRP;
        this.coPargFin = data[1].C_COD_PARAG;
        this.coCorpFin = data[1].C_COD_CORRP;
      }));;
    }
  }

  changeOcurrencia(event) {
    console.log(event.detail.value);
    if (this.formularioMeteoro.get('evento').value === '') {
      console.log('Evento esta vacio : ' + this.formularioMeteoro.get('evento').value);
    } else {
      this.sqlite.getEvento_x_para(this.formularioMeteoro.get('evento').value, event.detail.value).then((data => {
        this.coPargInicio = data[0].C_COD_PARAG;
        this.coCorpInicio = data[0].C_COD_CORRP;
        this.coPargFin = data[1].C_COD_PARAG;
        this.coCorpFin = data[1].C_COD_CORRP;
      }));;
    }
  }

  /// ------------ MODAL -------------- ///

  async openModal() {
    console.log(this.formularioMeteoro.value);
    if (this.formularioMeteoro.get('inicio_fecha').value > this.formularioMeteoro.get('fin_fecha').value) {
      this.inforAlert('La fecha y hora inical no deben ser mayores a La fecha y hora final');
    } else {
      const modal = await this.modalController.create({
        component: ModalResumenPage,
        componentProps: { form: this.formularioMeteoro.value, datos: 2, btn: 1 }
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

  /// -------------- ENVIAR POR DATOS  --------------- ///

  async btnRegistrar() {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    this.networkService.onNetworkChange().subscribe(async (status: ConnectionStatus) => {
      if (status === ConnectionStatus.Online) {
        const loading = await this.loadingController.create({
          message: 'Registrando Meteoro',
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
        this.cabecera.TIPO_ENVIO = '2';
        this.cabecera.DETALLE = this.coPargInicio + '/' + this.coCorpInicio + '/' + ((new Date(this.formularioMeteoro.value.inicio_fecha)).toLocaleDateString('ja-JP', options)).split('/').join('-') + '/' + this.formularioMeteoro.value.inicio_hora + '/' + this.cabecera.FLG_HORA_INICIO + '|' + this.coPargFin + '/' + this.coCorpFin + '/' + ((new Date(this.formularioMeteoro.value.fin_fecha)).toLocaleDateString('ja-JP', options)).split('/').join('-') + '/' + this.formularioMeteoro.value.fin_hora + '/' + this.cabecera.FLG_HORA_FIN;
        console.log(this.cabecera);
        let detalle_form = JSON.stringify(this.formularioMeteoro.value);
        let detalle = JSON.stringify(this.cabecera);
        // Envio al Api
        this.home.postMeteoro(this.cabecera).pipe(timeout(30000)).subscribe((data: any) => {
          this.loadingController.dismiss()
          if (data.respuesta[':B3'] === '0') {
            let flag = "1";
            //$cadenaInsert .= $arrayEveIni[0] . '/' . $arrayEveIni[1] . '/' . $fechaRegIni . '/' . $horaIni . '/' . $flgHoraIni . '|' . $arrayEveFin[0] . '/' . $arrayEveFin[1] . '/' . $fechaRegFin . '/' . $horaFin . '/' . $flgHoraFin;
            this.sqlite.addING_EVENTO_MOV_WEB({ ID_CABECERA: null, V_COD_ESTA: this.cabecera.V_COD_ESTA, FECHA_MOVIL: this.cabecera.FECHA_MOVIL, DETALLE: detalle, FORM: detalle_form, FLAG: flag }).then((dato) => {
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
        // Fin de Envio
      } else {
        this.loadingController.dismiss()
        console.log('Sin datos activados');
        this.sindatoAlert();
      }
    });
  }

  /// -------------- GUARDAR A LA BD LOCAL --------------- ///

  async guardar_local(detalle, detalle_form) {
    const loading = await this.loadingController.create({
      message: 'Registrando localmente el Meteoro',
    });
    await loading.present();
    let flag = "3";
    this.sqlite.addING_EVENTO_MOV_WEB({ ID_CABECERA: null, V_COD_ESTA: this.cabecera.V_COD_ESTA, FECHA_MOVIL: this.cabecera.FECHA_MOVIL, DETALLE: detalle, FORM: detalle_form, FLAG: flag }).then((dato) => {
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
    this.sqlite.addING_EVENTO_MOV_WEB({ ID_CABECERA: null, V_COD_ESTA: this.cabecera.V_COD_ESTA, FECHA_MOVIL: this.cabecera.FECHA_MOVIL, DETALLE: detalle, FORM: detalle_form, FLAG: flag }).then((dato) => {
      console.log('Se guardo a la BD local');
      this.navCtrl.pop();
    }, (err: any) => {
      console.log('guardar_local error: ' + err);
    });
  }

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

  //////------------ Boton Fisico -------------/////

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
        console.log(this.router.url);
        // tslint:disable-next-line: max-line-length
      } else if (this.router.url === '/meteoro/' + this.activatedRoute.snapshot.paramMap.get('id')) {
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

  ngOnDestroy() {
    //   this.geolocation.clearWatch();
    this.networkService.salirCoordenada();
  }

  /////// --------------------------- ////////



  async showDateTimepicker_inicio_fecha() {
    let topLoader = await this.alertController.getTop(); {
      if (topLoader) { } else {
        this.datePicker.show({
          date: new Date(),
          mode: 'date',
          androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
          doneButtonLabel: "Save Date & Time",
          is24Hour: true
        }).then(
          dateTime => {
            this.formularioMeteoro.controls['inicio_fecha'].setValue(dateTime.toLocaleDateString('ja-JP', this.options_fecha).split('/').join('-'));
          },
          err => console.log('Error occurred while getting dateTime: ', err)
        );
      }
    }
  }

  async btn_incd_inicio() {
    let topLoader = await this.alertController.getTop();
    if (topLoader) {

    } else {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        message: '<strong>¿El evento cuenta con hora definida?</strong>',
        buttons: [
          {
            text: 'NO',
            handler: (blah) => {
              this.alert_definido(1);
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'SI',
            handler: () => {
              console.log('Confirm Okay');
              this.showDateTimepicker_inicio_hora();
            }
          }
        ]
      });
      await alert.present();
    }
  }


  async alert_definido(dato) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      inputs: [
        {
          name: 'NN ',
          type: 'radio',
          label: 'NN',
          value: 'NN',
          checked: true
        },
        {
          name: 'MA',
          type: 'radio',
          label: 'MA',
          value: 'MA'
        },
        {
          name: 'TA',
          type: 'radio',
          label: 'TA',
          value: 'TA'
        },
        {
          name: 'NO',
          type: 'radio',
          label: 'NO',
          value: 'NO'
        }
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'ACEPTAR',
          handler: (data) => {
            console.log('Confirm Ok: ' + data);
            dato === 1 ? this.formularioMeteoro.controls['inicio_hora'].setValue(data) : this.formularioMeteoro.controls['fin_hora'].setValue(data);
            dato === 1 ? this.cabecera.FLG_HORA_INICIO = 0 : this.cabecera.FLG_HORA_FIN = 0;
          }
        }
      ]
    });

    await alert.present();
  }

  async showDateTimepicker_inicio_hora() {
    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
      doneButtonLabel: "Save Date & Time",
      is24Hour: true
    }).then(
      dateTime => {
        this.cabecera.FLG_HORA_INICIO = 1;
        this.formularioMeteoro.controls['inicio_hora'].setValue(dateTime.getHours() + ":" + dateTime.getMinutes());
      },
      err => console.log('Error occurred while getting dateTime: ', err)
    );
  }

  async showDateTimepicker_fin_fecha() {
    let topLoader = await this.alertController.getTop(); {
      if (topLoader) { } else {
        this.datePicker.show({
          date: new Date(),
          mode: 'date',
          androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
          doneButtonLabel: "Save Date & Time",
          is24Hour: true
        }).then(
          dateTime => {
            this.formularioMeteoro.controls['fin_fecha'].setValue(dateTime.toLocaleDateString('ja-JP', this.options_fecha).split('/').join('-'));
          },
          err => console.log('Error occurred while getting dateTime: ', err)
        );
      }
    }
  }

  async btn_incd_fin() {
    let topLoader = await this.alertController.getTop();
    if (topLoader) {

    } else {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        message: '<strong>¿El evento cuenta con hora definida?</strong>',
        buttons: [
          {
            text: 'NO',
            handler: (blah) => {
              this.alert_definido(2);
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'SI',
            handler: () => {
              console.log('Confirm Okay');
              this.showDateTimepicker_fin_hora();
            }
          }
        ]
      });
      await alert.present();
    }

  }

  async showDateTimepicker_fin_hora() {
    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
      doneButtonLabel: "Save Date & Time",
      is24Hour: true
    }).then(
      dateTime => {
        this.cabecera.FLG_HORA_FIN = 1;
        this.formularioMeteoro.controls['fin_hora'].setValue(dateTime.getHours() + ":" + dateTime.getMinutes());
      },
      err => console.log('Error occurred while getting dateTime: ', err)
    );
  }
}
