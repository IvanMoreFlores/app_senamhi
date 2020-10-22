import { Component, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, LoadingController, NavController, Platform } from '@ionic/angular';
import { ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
// Services
import { HomeService } from '../../services/home/home.service';
import { ConnectionStatus, NetworkService } from '../../services/network/network.service';
import { SqliteService } from '../../services/sqlite/sqlite.service';
// Plugin
import { Keyboard } from '@ionic-native/keyboard/ngx';
import * as moment from 'moment';
import { timeout } from 'rxjs/operators';
// Modal
import { ModalResumenPage } from './../modal-resumen/modal-resumen.page';
declare var SMS: any;

@Component({
  selector: 'app-medicion',
  templateUrl: './medicion.page.html',
  styleUrls: ['./medicion.page.scss'],
})

export class MedicionPage implements OnInit, OnDestroy {

  qtd: any[];
  titulo: String = '';
  fecha: any;
  parametros: any;
  backButtonSubscription;
  public myForm: FormGroup;
  public deficitParam = [];
  private playerCount: number = 1;
  public nubes = [];
  public vientos = [];
  customAlertOptions: any;
  customAlertOptions2: any;
  cabecera: any = {};
  currentModal = null;
  cantCaracteres = 120;
  particiones;
  array = [];
  header;
  numeros = [];

  array_parametros = [];

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sqlite: SqliteService,
    public platform: Platform,
    public navCtrl: NavController,
    public alertController: AlertController,
    public home: HomeService,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    private keyboard: Keyboard,
    private networkService: NetworkService,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public renderer: Renderer2
  ) {
    console.log('IVAN MORE FLORES');
    this.sqlite.getNumero(1).then((data) => {
      console.log(data);
      data.forEach(element => {
        this.numeros.push(element.NUMERO);
      });
      console.log(this.numeros);
    });;
    this.networkService.coordenadas();
    console.log('Esta en medicion constructor');
    // tslint:disable-next-line: max-line-length
    (this.activatedRoute.snapshot.paramMap.get('id_tipo') === 'M') ? this.titulo = 'Reporte Meteorológico' : this.titulo = 'Reporte Hidrológico';
    this.fecha = moment(new Date()).format('DD/MM/YYYY, H:mm:ss');
    this.myForm = this.formBuilder.group({
    });
    this.getParametroOffline();
  }

  toUnicode(elmnt) {
    // console.log(this.myForm);
    // console.log(elmnt);
    // console.log(elmnt.srcElement.id);

    // var next;
    // if (elmnt.srcElement.value.length) {
    //   next = elmnt.srcElement.tabIndex + 1;
    //   //look for the fields with the next tabIndex
    //   var f = elmnt.form;
    //   for (var i = 0; i < f.elements.length; i++) {
    //     if (next <= f.elements[i].tabIndex) {
    //       f.elements[i].focus();
    //       break;
    //     }
    //   }
    // }
  }

  async ngOnInit() {
    console.log('Esta en medicion ngOnInit');
    await this.getDeficitOnline();
    // await this.getParametroOffline();
  }

  async getParametroOffline() {
    console.log('Esta en medicion getParametroOffline');
    const loading = await this.loadingController.create({
      backdropDismiss: false,
      message: 'Espere porfavor',
    });
    await loading.present();
    // tslint:disable-next-line: max-line-length
    this.sqlite.getParametro(this.activatedRoute.snapshot.paramMap.get('id'), this.activatedRoute.snapshot.paramMap.get('id_hora')).then(async (result) => {
      console.log('Esta en getParametro result');
      console.log(result);
      this.array_parametros = result;
      console.log(result.length);
      if (result.length > 0) {
        console.log('result.length > 0');
        // tslint:disable-next-line: ter-arrow-parens
        result.forEach(element => {
          // tslint:disable-next-line: max-line-length
          this.myForm.addControl(element.C_COD_PARAG + '_' + element.C_COD_CORRP, new FormControl('', [Validators.required, Validators.pattern(/^[-0-9]+([,.][0-9]+)?$/)]));
        });
        this.parametros = result;
        await loading.dismiss();
        await this.mensaje();
      } else {
        await loading.dismiss();
        this.errorAlert('No se encontró parametros');
      }
    }).catch(async (err) => {
      await loading.dismiss();
      console.log('getParametroOffline error');
      this.respuestaFail(err);
    });
  }

  async mensaje() {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Empezar el registro de datos',
      buttons: ['ACEPTAR'],
      backdropDismiss: false,
    });
    await alert.present();
  }


  validar_tem() {
    let variable = 0;
    if (this.myForm.get('PT_102') !== null && this.myForm.get('TM_103') !== null) {
      console.log('ID_HORA_SINOPTICA === 3');
      if (parseInt(this.myForm.get('PT_102').value) === parseInt(this.myForm.get('TM_103').value)) {
        variable = 1;
        console.log('PT_102 == TM_103');
      } else {
        variable = 0;
        console.log('PT_102 !== TM_103');
      }
    } else if (this.myForm.get('PT_103') !== null && this.myForm.get('TM_102') !== null) {
      console.log('ID_HORA_SINOPTICA === 10');
      if (parseInt(this.myForm.get('PT_103').value) === parseInt(this.myForm.get('TM_102').value)) {
        variable = 1;
        console.log('PT_103 == TM_102');
      } else {
        variable = 0;
        console.log('PT_103 !== TM_102');
      }
    }
    return variable;
    // console.log(variable);
  }

  validar_bulbo() {
    let variable = 0;
    if (this.myForm.get('TM_104') !== null && this.myForm.get('TM_107') !== null) {
      if (parseInt(this.myForm.get('TM_104').value) < parseInt(this.myForm.get('TM_107').value)) {
        variable = 1;
      } else {
        variable = 0;
      }
    } else if (this.myForm.get('TM_105') !== null && this.myForm.get('TM_108') !== null) {
      if (parseInt(this.myForm.get('TM_105').value) < parseInt(this.myForm.get('TM_108').value)) {
        variable = 1;
      } else {
        variable = 0;
      }
    } else if (this.myForm.get('TM_106') !== null && this.myForm.get('TM_109') !== null) {
      if (parseInt(this.myForm.get('TM_106').value) < parseInt(this.myForm.get('TM_109').value)) {
        variable = 1;
      } else {
        variable = 0;
      }
    }
    return variable;
  }

  validar_maxima() {
    let variable = 0;
    if (this.myForm.get('TM_102') !== null && this.myForm.get('TM_106') !== null) {
      if (parseInt(this.myForm.get('TM_102').value) < parseInt(this.myForm.get('TM_106').value)) {
        variable = 1;
      } else {
        variable = 0;
      }
    }
    return variable;
  }

  validar_minima() {
    let variable = 0;
    if (this.myForm.get('TM_103') !== null && this.myForm.get('TM_104') !== null) {
      if (parseInt(this.myForm.get('TM_104').value) < parseInt(this.myForm.get('TM_103').value)) {
        variable = 1;
      } else {
        variable = 0;
      }
    }
    return variable;
  }

  validar_dato() {
    let variable = 0;
    return this.sqlite.getING_MOVIL_WEB_ID_HORA(this.activatedRoute.snapshot.paramMap.get('id'), this.activatedRoute.snapshot.paramMap.get('id_hora')).then((result) => {
      result.forEach(element => {
        console.log(element);
        if (element.FORM === JSON.stringify(this.myForm.value)) {
          variable = 1;
          console.log('Sin son iguales');
        } else {
          variable = 0;
          console.log('No son iguales');
        }
      });
      return Promise.resolve(variable)
    });
  }



  /// -------- VALIDACIONES ------ ///

  validacion(N_ARRAY, C_COD_PARAG, C_COD_CORRP, V_NOM_PARA) {
    // this.array_parametros
    console.log(this.array_parametros[N_ARRAY]);
    console.log(N_ARRAY);
    console.log(C_COD_PARAG);
    console.log(C_COD_CORRP);
    console.log(V_NOM_PARA);
    console.log(this.array_parametros[N_ARRAY].C_COD_PARAG);
    let codigo = this.array_parametros[N_ARRAY].C_COD_PARAG + '_' + this.array_parametros[N_ARRAY].C_COD_CORRP;
    let data;
    const valor = this.myForm.get(C_COD_PARAG + '_' + C_COD_CORRP).value;
    console.log(parseInt(valor));
    if (parseInt(valor) !== -999) {
      this.sqlite.getUmbrales(C_COD_PARAG + '_' + C_COD_CORRP).then((result) => {
        if (result.length > 0) {
          data = result[0];
          console.log(parseInt(data.LIMIT_INFERIOR));
          console.log(parseInt(data.LIMIT_SUPERIOR));
          if (valor < parseInt(data.LIMIT_INFERIOR)) {
            console.log(valor + ' es menor que ' + parseInt(data.LIMIT_INFERIOR));
            this.mensaje_validacion('El valor agregado es inferior a ' + parseInt(data.LIMIT_INFERIOR), C_COD_PARAG + '_' + C_COD_CORRP, V_NOM_PARA);
          } else if (valor > parseInt(data.LIMIT_SUPERIOR)) {
            console.log(valor + ' es mayor que ' + parseInt(data.LIMIT_SUPERIOR));
            this.mensaje_validacion('El valor agregado es superior a ' + parseInt(data.LIMIT_SUPERIOR), C_COD_PARAG + '_' + C_COD_CORRP, V_NOM_PARA);
          }
          
        }
      }).catch((err) => {
        console.log(err);
      });
    }
    this.moveFocus(codigo);
  }

  moveFocus(nextElement) {
    console.log('wwww');
    console.log(nextElement);
    console.log(document.getElementById(nextElement));
    if (document.getElementById(nextElement)) {
      console.log('sssss');
      console.log(document.getElementById(nextElement));
      document.getElementById(nextElement).focus();
    }

    // console.log((document.activeElement as HTMLElement));
    // console.log(nextElement);
    // const element = this.renderer.selectRootElement('#' + nextElement);
    // console.log(element);
    //e.srcElement.value
    // this.myForm.controls[nextElement].focus();
  }

  async mensaje_validacion(mensaje, codigo, V_NOM_PARA) {
    await this.keyboard.hide();
    await this.myForm.controls[codigo].setValue('');
    const alert = await this.alertController.create({
      // header: 'Mensaje',
      header: V_NOM_PARA,
      message: mensaje,
      buttons: [{
        text: 'ACEPTAR',
        handler: (blah) => {
          this.myForm.controls[codigo].setValue('');
          // console.log(C_COD_PARAG + '_' + C_COD_CORRP);
          // let varilla = C_COD_PARAG + '_' + C_COD_CORRP;
          // document.querySelector(codigo).focus()
          console.log(codigo);
          console.log(document.getElementsByName(codigo));
          // document.getElementById(codigo).focus();
          console.log('Confirm Cancel: blah' + blah);
        },
      }],
      backdropDismiss: false,
    });
    await alert.present();
  }

  /// ----------------------------- ///

  getDeficitOnline() {
    console.log('getDeficitOnline');
  }

  /// ------------ MODAL -------------- ///

  async openModal() {
    if (this.validar_tem() === 1) {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        // subHeader: 'Subtitle',
        message: 'La temperatura es igual a la precipitación',
        buttons: [
          {
            text: 'CONTINUAR',
            handler: () => {
              console.log('Confirm Cancel: blah');
              this.openModal_two();
            }
          }, {
            text: 'REGRESAR',
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.openModal_two();
    }
  }

  async openModal_two() {
    if (this.validar_bulbo() === 1) {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        // subHeader: 'Subtitle',
        message: 'La temperatura del bulbo seco debe ser mayor o igual que la temperatura del bulbo humedo',
        buttons: ['ACEPTAR']
      });
      await alert.present();
    } else {
      this.openModal_tree();
    }
  }

  async openModal_tree() {
    if (await this.validar_dato() === 1) {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        // subHeader: 'Subtitle',
        message: 'Los datos registrados son iguales a los datos registrados dias anteriores',
        buttons: [
          {
            text: 'CONTINUAR',
            handler: () => {
              console.log('Confirm Cancel: blah');
              this.openModal_four();
            }
          }, {
            text: 'REGRESAR',
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.openModal_four();
    }
  }

  async openModal_four() {
    if (await this.validar_maxima() === 1) {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        // subHeader: 'Subtitle',
        message: 'La temperatura maxima debe ser mayor o igual a la temperatura del bulbo seco',
        buttons: ['ACEPTAR']
      });
      await alert.present();
    } else {
      this.openModal_five();
    }
  }

  async openModal_five() {
    if (await this.validar_minima() === 1) {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        // subHeader: 'Subtitle',
        message: 'La temperatura mínima debe ser menor o igual a la temperatura del termómetro seco',
        buttons: ['ACEPTAR']
      });
      await alert.present();
    } else {
      this.openModal_six();
    }
  }

  async openModal_six() {
    let topLoader = await this.alertController.getTop();
    if (topLoader) {
      console.log('con topLoader');
    } else {
      console.log('Sin topLoader');
      console.log(this.myForm);
      const modal = await this.modalController.create({
        component: ModalResumenPage,
        componentProps: { form: this.myForm.controls, datos: 1, btn: 1 }
      });
      modal.onDidDismiss().then((dataReturned) => {
        console.log(dataReturned);
        if (dataReturned.data !== undefined) {
          this.btn_enviar();
          console.log('La data no es undefined')
        } else {
          console.log('La data si es undefined')
        }
      });
      return await modal.present();
    }
  }


  /// ----------------------------- ///

  /// ------------- BOTON CONFIRMAR --------------- ///

  // async btn_confirmar() {
  //   const alert = await this.alertController.create({
  //     header: 'Confirm!',
  //     message: 'Message <strong>text</strong>!!!',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: (blah) => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }, {
  //         text: 'Okay',
  //         handler: () => {
  //           console.log('Confirm Okay');
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  // // --------------------------------------------- ///

  /// ------------- BOTON GUARDAR --------------- ///
  async btn_enviar() {
    if (this.myForm.status === 'INVALID') {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        message: 'Rellene todos los campos del registro',
        buttons: ['ACEPTAR']
      });
      await alert.present();
    } else {
      let array = [];
      console.log('Estado del formulario', this.myForm.status);
      console.log('Entro en enviar');
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      this.networkService.onNetworkChange().subscribe(async (status: ConnectionStatus) => {
        if (status === ConnectionStatus.Online) {
          const loading = await this.loadingController.create({
            message: 'Registrando datos',
          });
          await loading.present();
          this.cabecera.NUM_LATITUD = this.networkService.latitude;
          this.cabecera.NUM_LONGITUD = this.networkService.longitude;
          this.cabecera.V_COD_ESTA = localStorage.getItem('V_COD_ESTA');
          this.cabecera.ID_HORA_SINOPTICA = localStorage.getItem('ID_HORA_SINOPTICA');
          this.cabecera.FECHA_MOVIL = ((new Date()).toLocaleDateString('ja-JP', options)).split('/').join('-');
          this.cabecera.ID_USUARIO = localStorage.getItem('ID_USUARIO');
          this.cabecera.FLG_CANAL = '0';
          this.cabecera.FLG_MEDIO = '1';
          this.cabecera.TIPO_ENVIO = '1';
          let cadenaInsert = '';
          for (const clave in this.myForm.controls) {
            this.array.push({ [clave]: this.myForm.controls[clave]['value'] });
            console.log('this.myForm.value: ', this.myForm.controls);
            if (this.myForm.controls.hasOwnProperty(clave)) {
              console.log('clave: ', clave);
              const arrayTemp = clave.split('_');
              console.log('arrayTemp: ', arrayTemp);
              console.log('this.myForm.controls[clave]["value"]: ', this.myForm.controls[clave]['value']);
              cadenaInsert += arrayTemp[0] + '/' + arrayTemp[1] + '/' + (this.myForm.controls[clave]['value'].toString()).replace('.', ',') + '/' + (this.deficitParam[clave] ? this.deficitParam[clave] : 'X') + '|';
            }
          }
          this.cabecera.DETALLE = cadenaInsert;
          let detalle = JSON.stringify(this.cabecera);
          let detalle_form = JSON.stringify(this.array);
          detalle_form = detalle_form.replace(/},{/g, ',');
          detalle_form = detalle_form.replace('[', '');
          detalle_form = detalle_form.replace(']', '');
          console.log(detalle_form);
          console.log(JSON.stringify(this.myForm.value));
          this.home.postAgregar(this.cabecera).pipe(timeout(10000)).subscribe((data: any) => {
            this.loadingController.dismiss()
            if (data.respuesta[':B3'] === '0') {
              let flag = "1";
              this.sqlite.addING_MOVIL_WEB({ ID_CABECERA: null, V_COD_ESTA: this.cabecera.V_COD_ESTA, ID_HORA_SINOPTICA: this.cabecera.ID_HORA_SINOPTICA, FECHA_MOVIL: this.cabecera.FECHA_MOVIL, DETALLE: detalle, FORM: detalle_form, FLAG: flag }).then((dato) => {
                this.successAlert(data.respuesta[':B2']);
              });
            } else {
              this.inforAlert(data.respuesta[':B2']);
            }
          }, (err: any) => {
            this.loadingController.dismiss();
            this.tramaAlert(detalle, detalle_form);
            console.log('Error al enviar viar datos: ', err);
          });
        } else {
          this.loadingController.dismiss()
          console.log('Sin datos activados');
          this.sindatoAlert();
        }
      });
    }



  }

  /// ----------------------------- ///

  /// ------------- VALIDACIONES --------------- ///

  borrar_deficit(C_COD_PARAG, C_COD_CORRP) {
    const codigo = C_COD_PARAG + '_' + C_COD_CORRP;
    if (this.myForm.get(codigo).value === -999 || this.myForm.get(codigo).value === '-999') {
      this.myForm.controls[codigo].setValue('');
      // this.eliminar(codigo);
      console.log(this.deficitParam[codigo]);
      this.deficitParam[codigo] = null;
      this.deficitParam.length;
    } else {
      console.log(this.myForm.get(codigo).value);
    }
  }

  async comboNube(C_COD_PARAG, C_COD_CORRP) {
    alert();
    this.customAlertOptions2 = {
      header: 'Formas de nubes',
      backdropDismiss: false,
    };
    const nube = [];
    const codigo = C_COD_PARAG + '_' + C_COD_CORRP;
    // tslint:disable-next-line: max-line-length
    this.sqlite.getNube(C_COD_PARAG, C_COD_CORRP).then((result) => {
      console.log(result);
      // this.horas = result;
      if (result.length > 0) {
        result.forEach(element => {
          nube.push({
            name: element.DESC_TIPO_NUBE,
            type: 'radio',
            label: element.DESC_TIPO_NUBE,
            value: { valor: element.VALOR, nombre: element.DESC_TIPO_NUBE },
          });
        });
        this.llenarComboNube(nube, codigo, C_COD_PARAG, C_COD_CORRP);
      } else {
        this.sinAlert('No se encontró ninguna deficiencia para mostrar');
      }
    }).catch((err) => {
      console.log('presentAlertRadio error');
      this.respuestaFail(err);
    });
  }

  async llenarComboNube(nube, codigo, C_COD_PARAG, C_COD_CORRP) {
    const parametro = C_COD_PARAG + '_' + C_COD_CORRP;
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Tipo de nube',
      inputs: nube,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alrt_deficit',
          handler: () => {
            console.log('Confirm Cancel');
          },
        }, {
          text: 'Aceptar',
          handler: (data) => {
            this.validacion_nube(data.valor, parametro);
            this.myForm.controls[codigo].setValue(parseInt(data.valor));
            document.getElementById(codigo).getElementsByTagName('input')[0].value = data.nombre
            // console.log(document.getElementById(codigo).getElementsByTagName('input')[0].value = data.valor);
            if (data.valor === '-999') {
              this.presentAlertRadio(C_COD_PARAG, C_COD_CORRP);
            } else {

            }
            console.log(data);
          },
        },
      ],
    });
    await alert.present();
  }

  validacion_nube(data, parametro) {
    console.log('Data: ', data);
    console.log('Data: ', parametro);
    if (parametro === 'NB_104') {
      if (data === '0') {
        // Cantidad
        (this.myForm.controls['NB_105'] ? this.myForm.controls['NB_105'].disable() : null);
        (this.myForm.controls['NB_105'] ? this.myForm.controls['NB_105'].setValue(parseInt('0')) : null);
        // (this.myForm.controls['NB_105'] ? this.myForm.controls['NB_105'].;
        // Altura
        (this.myForm.controls['NB_106'] ? this.myForm.controls['NB_106'].disable() : null);
        (this.myForm.controls['NB_106'] ? this.myForm.controls['NB_106'].setValue(parseInt('0')) : null);
      } else if (data === '-999') {
        // Cantidad
        (this.myForm.controls['NB_105'] ? this.myForm.controls['NB_105'].disable() : null);
        (this.myForm.controls['NB_105'] ? this.myForm.controls['NB_105'].setValue(parseInt('-999')) : null);
        // Altura
        (this.myForm.controls['NB_106'] ? this.myForm.controls['NB_106'].disable() : null);
        (this.myForm.controls['NB_106'] ? this.myForm.controls['NB_106'].setValue(parseInt('-999')) : null);
      } else {
        // Cantidad
        (this.myForm.controls['NB_105'] ? this.myForm.controls['NB_105'].enable() : null);
        (this.myForm.controls['NB_105'] ? this.myForm.controls['NB_105'].setValue('') : null);
        // Altura
        (this.myForm.controls['NB_106'] ? this.myForm.controls['NB_106'].enable() : null);
        (this.myForm.controls['NB_106'] ? this.myForm.controls['NB_106'].setValue('') : null);
      }
    } else if (parametro === 'NB_107') {
      if (data === '0') {
        // Cantidad        
        (this.myForm.controls['NB_108'] ? this.myForm.controls['NB_108'].disable() : null);
        (this.myForm.controls['NB_108'] ? this.myForm.controls['NB_108'].setValue(parseInt('0')) : null);
      } else if (data === '-999') {
        // Cantidad        
        (this.myForm.controls['NB_108'] ? this.myForm.controls['NB_108'].disable() : null);
        (this.myForm.controls['NB_108'] ? this.myForm.controls['NB_108'].setValue(parseInt('-999')) : null);
      } else {
        (this.myForm.controls['NB_108'] ? this.myForm.controls['NB_108'].enable() : null);
        (this.myForm.controls['NB_108'] ? this.myForm.controls['NB_108'].setValue('') : null);
      }
    } else if (parametro === 'NB_109') {
      if (data === '0') {
        // Cantidad
        (this.myForm.controls['NB_110'] ? this.myForm.controls['NB_110'].disable() : null);
        (this.myForm.controls['NB_110'] ? this.myForm.controls['NB_110'].setValue(parseInt('0')) : null);
      } else if (data === '-999') {
        // Cantidad
        (this.myForm.controls['NB_110'] ? this.myForm.controls['NB_110'].disable() : null);
        (this.myForm.controls['NB_110'] ? this.myForm.controls['NB_110'].setValue(parseInt('-999')) : null);
      } else {
        // Cantidad
        (this.myForm.controls['NB_110'] ? this.myForm.controls['NB_110'].enable() : null);
        (this.myForm.controls['NB_110'] ? this.myForm.controls['NB_110'].setValue('') : null);
      }
    } else if (parametro === 'NB_111') {
      if (data === '0') {
        // Cantidad
        (this.myForm.controls['NB_112'] ? this.myForm.controls['NB_112'].disable() : null);
        (this.myForm.controls['NB_112'] ? this.myForm.controls['NB_112'].setValue(parseInt('0')) : null);
        // Altura
        (this.myForm.controls['NB_113'] ? this.myForm.controls['NB_113'].disable() : null);
        (this.myForm.controls['NB_113'] ? this.myForm.controls['NB_113'].setValue(parseInt('0')) : null);
      } else if (data === '-999') {
        // Cantidad
        (this.myForm.controls['NB_112'] ? this.myForm.controls['NB_112'].disable() : null);
        (this.myForm.controls['NB_112'] ? this.myForm.controls['NB_112'].setValue(parseInt('-999')) : null);
        // Altura
        (this.myForm.controls['NB_113'] ? this.myForm.controls['NB_113'].disable() : null);
        (this.myForm.controls['NB_113'] ? this.myForm.controls['NB_113'].setValue(parseInt('-999')) : null);
      } else {
        // Cantidad
        (this.myForm.controls['NB_112'] ? this.myForm.controls['NB_112'].enable() : null);
        (this.myForm.controls['NB_112'] ? this.myForm.controls['NB_112'].setValue('') : null);
        // Altura
        (this.myForm.controls['NB_113'] ? this.myForm.controls['NB_113'].disable() : null);
        (this.myForm.controls['NB_113'] ? this.myForm.controls['NB_113'].setValue('') : null);
      }
    } else if (parametro === 'NB_114') {
      if (data === '0') {
        // Cantidad
        (this.myForm.controls['NB_115'] ? this.myForm.controls['NB_115'].disable() : null);
        (this.myForm.controls['NB_115'] ? this.myForm.controls['NB_115'].setValue(parseInt('0')) : null);
      } else if (data === '-999') {
        // Cantidad
        (this.myForm.controls['NB_115'] ? this.myForm.controls['NB_115'].disable() : null);
        (this.myForm.controls['NB_115'] ? this.myForm.controls['NB_115'].setValue(parseInt('-999')) : null);
      } else {
        (this.myForm.controls['NB_115'] ? this.myForm.controls['NB_115'].enable() : null);
        (this.myForm.controls['NB_115'] ? this.myForm.controls['NB_115'].setValue('') : null);
      }
    } else if (parametro === 'NB_116') {
      if (data === '0') {
        // Cantidad
        (this.myForm.controls['NB_117'] ? this.myForm.controls['NB_117'].disable() : null);
        (this.myForm.controls['NB_117'] ? this.myForm.controls['NB_117'].setValue(parseInt('0')) : null);
      } else if (data === '-999') {
        // Cantidad
        (this.myForm.controls['NB_117'] ? this.myForm.controls['NB_117'].disable() : null);
        (this.myForm.controls['NB_117'] ? this.myForm.controls['NB_117'].setValue(parseInt('-999')) : null);
      } else {
        // Cantidad
        (this.myForm.controls['NB_117'] ? this.myForm.controls['NB_117'].enable() : null);
        (this.myForm.controls['NB_117'] ? this.myForm.controls['NB_117'].setValue('') : null);
      }
    } else if (parametro === 'NB_118') {
      if (data === '0') {
        // Cantidad
        (this.myForm.controls['NB_119'] ? this.myForm.controls['NB_119'].disable() : null);
        (this.myForm.controls['NB_119'] ? this.myForm.controls['NB_119'].setValue(parseInt('0')) : null);
        // Altura
        (this.myForm.controls['NB_120'] ? this.myForm.controls['NB_120'].disable() : null);
        (this.myForm.controls['NB_120'] ? this.myForm.controls['NB_120'].setValue(parseInt('0')) : null);
      } else if (data === '-999') {
        // Cantidad
        (this.myForm.controls['NB_119'] ? this.myForm.controls['NB_119'].disable() : null);
        (this.myForm.controls['NB_119'] ? this.myForm.controls['NB_119'].setValue(parseInt('-999')) : null);
        // Altura
        (this.myForm.controls['NB_120'] ? this.myForm.controls['NB_120'].disable() : null);
        (this.myForm.controls['NB_120'] ? this.myForm.controls['NB_120'].setValue(parseInt('-999')) : null);
      } else {
        // Cantidad
        (this.myForm.controls['NB_119'] ? this.myForm.controls['NB_119'].enable() : null);
        (this.myForm.controls['NB_119'] ? this.myForm.controls['NB_119'].setValue('') : null);
        // Altura
        (this.myForm.controls['NB_120'] ? this.myForm.controls['NB_120'].enable() : null);
        (this.myForm.controls['NB_120'] ? this.myForm.controls['NB_120'].setValue('') : null);
      }
    } else if (parametro === 'NB_121') {
      if (data === '0') {
        // Cantidad
        (this.myForm.controls['NB_122'] ? this.myForm.controls['NB_122'].disable() : null);
        (this.myForm.controls['NB_122'] ? this.myForm.controls['NB_122'].setValue(parseInt('0')) : null);
      } else if (data === '-999') {
        // Cantidad
        (this.myForm.controls['NB_122'] ? this.myForm.controls['NB_122'].disable() : null);
        (this.myForm.controls['NB_122'] ? this.myForm.controls['NB_122'].setValue(parseInt('-999')) : null);
      } else {
        // Cantidad
        (this.myForm.controls['NB_122'] ? this.myForm.controls['NB_122'].enable() : null);
        (this.myForm.controls['NB_122'] ? this.myForm.controls['NB_122'].setValue('') : null);
      }
    } else if (parametro === 'NB_123') {
      if (data === '0') {
        // Cantidad
        (this.myForm.controls['NB_124'] ? this.myForm.controls['NB_124'].disable() : null);
        (this.myForm.controls['NB_124'] ? this.myForm.controls['NB_124'].setValue(parseInt('0')) : null);
      } else if (data === '-999') {
        // Cantidad
        (this.myForm.controls['NB_124'] ? this.myForm.controls['NB_124'].disable() : null);
        (this.myForm.controls['NB_124'] ? this.myForm.controls['NB_124'].setValue(parseInt('-999')) : null);
      } else {
        // Cantidad
        (this.myForm.controls['NB_124'] ? this.myForm.controls['NB_124'].enable() : null);
        (this.myForm.controls['NB_124'] ? this.myForm.controls['NB_124'].setValue('') : null);
      }
    }
  }

  public changeEnvironment(event, C_COD_PARAG, C_COD_CORRP) {
    if (parseInt(event.detail.value) === 0) {
      (this.myForm.controls['VT_102'] ? this.myForm.controls['VT_102'].disable() : null);
      // tslint:disable-next-line: max-line-length
      (this.myForm.controls['VT_102'] ? this.myForm.controls['VT_102'].setValue(parseInt('0')) : null);

      (this.myForm.controls['VT_104'] ? this.myForm.controls['VT_104'].disable() : null);
      // tslint:disable-next-line: max-line-length
      (this.myForm.controls['VT_104'] ? this.myForm.controls['VT_104'].setValue(parseInt('0')) : null);

      (this.myForm.controls['VT_106'] ? this.myForm.controls['VT_106'].disable() : null);
      // tslint:disable-next-line: max-line-length
      (this.myForm.controls['VT_106'] ? this.myForm.controls['VT_106'].setValue(parseInt('0')) : null);

    } else if (parseInt(event.detail.value) === -999) {
      (this.myForm.controls['VT_102'] ? this.myForm.controls['VT_102'].disable() : null);
      // tslint:disable-next-line: max-line-length
      (this.myForm.controls['VT_102'] ? this.myForm.controls['VT_102'].setValue(parseInt('-999')) : null);

      (this.myForm.controls['VT_104'] ? this.myForm.controls['VT_104'].disable() : null);
      // tslint:disable-next-line: max-line-length
      (this.myForm.controls['VT_104'] ? this.myForm.controls['VT_104'].setValue(parseInt('-999')) : null);

      (this.myForm.controls['VT_106'] ? this.myForm.controls['VT_106'].disable() : null);
      // tslint:disable-next-line: max-line-length
      (this.myForm.controls['VT_106'] ? this.myForm.controls['VT_106'].setValue(parseInt('-999')) : null);
    } else {
      console.log('Entro aqui: ', parseInt(event.detail.value));
      (this.myForm.controls['VT_102'] ? this.myForm.controls['VT_102'].enable() : null);
      // tslint:disable-next-line: max-line-length
      (this.myForm.controls['VT_102'] ? this.myForm.controls['VT_102'].setValue('') : null);

      (this.myForm.controls['VT_104'] ? this.myForm.controls['VT_104'].enable() : null);
      // tslint:disable-next-line: max-line-length
      (this.myForm.controls['VT_104'] ? this.myForm.controls['VT_104'].setValue('') : null);

      (this.myForm.controls['VT_106'] ? this.myForm.controls['VT_106'].enable() : null);
      // tslint:disable-next-line: max-line-length
      (this.myForm.controls['VT_106'] ? this.myForm.controls['VT_106'].setValue('') : null);
    }
    // const codigo = C_COD_PARAG + '_' + C_COD_CORRP;
    // this.myForm.controls[codigo].setValue(event.detail.value);
    // console.log(JSON.stringify(event.detail.value));
  }

  async comboViento() {
    this.customAlertOptions = {
      header: 'Dirección del viento',
      backdropDismiss: false,
    };
    // tslint:disable-next-line: max-line-length
    this.sqlite.getViento().then((result) => {
      console.log(result);
      if (result.length > 0) {
        this.vientos = result;
      } else {
        this.sinAlert('No se encontró ninguna dato de viento mostrar');
      }
    }).catch((err) => {
      console.log('presentAlertRadio error');
      this.respuestaFail(err);
    });
  }

  //////-----------------------------------//////

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
      subHeader: success,
      message: 'Se registró satisfactoriamente a las ' + this.cabecera.FECHA_MOVIL,
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
      backdropDismiss: true,
    });
    await alert.present();
  }

  async presentAlertRadio(C_COD_PARAG, C_COD_CORRP) {
    const deficit = [];
    const codigo = C_COD_PARAG + '_' + C_COD_CORRP;
    // tslint:disable-next-line: max-line-length
    this.sqlite.getDeficit(C_COD_PARAG, C_COD_CORRP).then((result) => {
      console.log(result);
      // this.horas = result;
      if (result.length > 0) {
        result.forEach(element => {
          deficit.push({
            name: element.V_NOM_DEFICINSTR,
            type: 'radio',
            label: element.V_NOM_DEFICINSTR,
            value: element.ID_DEFICIENCIA,
          });
        });
        this.llenarCombo(deficit, codigo);
      } else {
        this.sinAlert('No se encontró ninguna deficiencia para mostrar');
      }
    }).catch((err) => {
      console.log('presentAlertRadio error');
      this.respuestaFail(err);
    });
  }

  async llenarCombo(deficit, codigo) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Motivo de falta de datos',
      inputs: deficit,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alrt_deficit',
          handler: () => {
            console.log('Confirm Cancel');
          },
        }, {
          text: 'Aceptar',
          handler: (data) => {
            this.myForm.controls[codigo].setValue(parseInt('-999'));
            // tslint:disable-next-line: prefer-template
            // this.deficitParam.spl( [codigo]: data );
            this.deficitParam[codigo] = data;
            // this.deficitParam.push({ codigo_p: codigo, valor: data });
            console.log('Confirm llenarCombo');
            console.log(data);
          },
        },
      ],
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

  async salirAlertConfirm() {
    let topLoader = await this.alertController.getTop();
    if (topLoader) {
      topLoader.dismiss();
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje!',
        subHeader: '¿Esta seguro de salir?',
        message: '<strong>Se perderan las respuestas del registro actual</strong>',
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
        header: 'Mensaje!',
        subHeader: '¿Esta seguro de salir?',
        message: '<strong>Se perderan las respuestas del registro actual</strong>',
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

  //////------------ Fin Alertas -------------/////



  ionViewDidEnter() {
    // this.getParametroOffline();
    console.log(this.router.url);
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
        // tslint:disable-next-line: max-line-length
        // tslint:disable-next-line: prefer-template
      } else if (this.router.url === '/medicion/' + this.activatedRoute.snapshot.paramMap.get('id') + '/' + this.activatedRoute.snapshot.paramMap.get('id_hora') + '/' + this.activatedRoute.snapshot.paramMap.get('id_tipo')) {
        this.alertController.dismiss().then((result) => {
          console.log(result);
        }).catch((err) => {
        });
        this.salirAlertConfirm();
      }
    });
  }

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
        // SMS.sendSMS(['968169082', '990391969', '979667907', '943056389', '991452414', '951708907', '944127579', '940226757'], element, (ListSms) => {
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

  /// -------------- GUARDAR A LA BD LOCAL --------------- ///

  async guardar_local(detalle, detalle_form) {
    const loading = await this.loadingController.create({
      message: 'Registrando localmente el Meteoro',
    });
    await loading.present();
    let flag = "3";
    this.sqlite.addING_MOVIL_WEB({ ID_CABECERA: null, V_COD_ESTA: this.cabecera.V_COD_ESTA, ID_HORA_SINOPTICA: this.cabecera.ID_HORA_SINOPTICA, FECHA_MOVIL: this.cabecera.FECHA_MOVIL, DETALLE: detalle, FORM: detalle_form, FLAG: flag }).then((dato) => {
      console.log('Se guardo a la BD local');
      loading.dismiss();
      this.navCtrl.pop();
    }, (err: any) => {
      console.log('guardar_local error: ' + err);
    });
  }

  async guardar_local_via_sms(detalle, detalle_form) {
    let flag = "2";
    this.sqlite.addING_MOVIL_WEB({ ID_CABECERA: null, V_COD_ESTA: this.cabecera.V_COD_ESTA, ID_HORA_SINOPTICA: this.cabecera.ID_HORA_SINOPTICA, FECHA_MOVIL: this.cabecera.FECHA_MOVIL, DETALLE: detalle, FORM: detalle_form, FLAG: flag }).then((dato) => {
      console.log('Se guardo a la BD local');
      this.navCtrl.pop();
    }, (err: any) => {
      console.log('guardar_local error: ' + err);
    });
  }

  //////------------ ------- -------------//////

  ngOnDestroy() {
    console.log('ngOnDestroy en medición');
    this.backButtonSubscription.unsubscribe();
  }

  ////////////////////////// SCROLL
  ScrollToBottom() {
    // this.content.scrollToBottom(1500);
  }

  ScrollToTop() {
    // this.content.scrollToTop(1500);
  }

}
