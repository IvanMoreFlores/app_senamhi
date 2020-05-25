import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { timeout } from 'rxjs/operators';
// tslint:disable-next-line: no-duplicate-imports
import { LoadingController } from '@ionic/angular';
// Services
import { HomeService } from '../../services/home/home.service';
import { SqliteService } from '../../services/sqlite/sqlite.service';

@Component({
  selector: 'app-meteorologia',
  templateUrl: './meteorologia.page.html',
  styleUrls: ['./meteorologia.page.scss'],
})
export class MeteorologiaPage implements OnInit, OnDestroy {
  div_opciones: Boolean = true;
  div_horarios: Boolean = false;
  estacion: any;
  horas: any;
  fecha: any;
  titulo: String;
  flag_sinc: boolean = false;
  class_sinc: string = localStorage.getItem('CLASS_SINC');
  backButtonSubscription;
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sqlite: SqliteService,
    public platform: Platform,
    public navCtrl: NavController,
    public alertController: AlertController,
    public home: HomeService,
    public loadingController: LoadingController,
  ) {
    this.fecha = moment(new Date()).format('DD/MM/YYYY, H:mm:ss');
  }

  async ngOnInit() {
    await this.obtenerEstacion();
    await this.obtenerHoras();
    await this.obtenerParametros();
    await this.obtenerDeficit();
    await this.obtenerNube();
    await this.obtenerViento();
    await this.obtenerNumero();
    await this.obtenerUmbrales();
    await this.obtenerOcurrencia();
    await this.obtenerParaEvento();
    await this.obtenerEvento_x_para();
    await this.obtenerIncidencia();
    if (this.flag_sinc) {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        message: 'SINCRONIZACION EXITOSA',
        buttons: [{
          text: 'ACEPTAR',
          handler: () => {
            localStorage.setItem('CLASS_SINC', 'card');
            this.class_sinc = localStorage.getItem('CLASS_SINC');
            console.log('SINCRONIZACION EXITOSA');
          }
        }
        ]
      });
      await alert.present();
    }
  }

  /// ----- OBTENER ESTACIÓN ----- ///

  obtenerEstacion() {
    this.titulo = 'Obteniendo datos de la Estación';
    this.sqlite
      .getEstacionId(this.activatedRoute.snapshot.paramMap.get('id'))
      .then(result => {
        this.estacion = result[0];
      })
      .catch(err => {
        console.log('obtenerEstacion : ' + err);
      });
  }

  /// ----- OBTENER UMBRALES ----- ///

  obtenerUmbrales() {
    this.titulo = 'Obteniendo validaciones';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countUmbrales().then((countUmbrales) => {
      console.log(countUmbrales);
      if (countUmbrales === 0) {
        console.log('getUmbralesOnline');
        this.getUmbralesOnline();
      } else {
        console.log('getUmbralesOffline');
        // this.getVientoOffline();
      }
    }).catch((error) => {
      this.respuestaFail(error);
    });
  }

  getUmbralesOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getUmbrales().pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getUmbralesOnline result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getUmbralesOnline result');
        // this.parametros = result;
        this.postUmbralesOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getUmbralesOnline error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postUmbralesOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addUmbrales({ C_COD_PARAG: element.C_COD_PARAG, C_COD_CORRP: element.C_COD_CORRP, LIMIT_INFERIOR: element.LIMIT_INFERIOR, LIMIT_SUPERIOR: element.LIMIT_SUPERIOR, UNIDAD: element.UNIDAD, DESCRIPCION: element.DESCRIPCION, CODIGO: element.CODIGO }).then((result) => {
        console.log('postUmbralesOnline result');
      }).catch((err) => {
        console.log('postUmbralesOnline error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- OBTENER VIENTO ----- ///
  obtenerNumero() {
    this.titulo = 'Obteniendo datos de numericos';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countNumero().then((countNumero) => {
      console.log(countNumero);
      if (countNumero === 0) {
        console.log('getNumeroOnline');
        this.getNumeroOnline();
      } else {
        console.log('getNumeroOffline');
        // this.getVientoOffline();
      }
    }).catch((error) => {
      this.respuestaFail(error);
    });
  }

  getNumeroOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getNumero().pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getNumeroOnline result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getNumeroOnline result');
        // this.parametros = result;
        this.postNumeroOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getNumeroOnline error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postNumeroOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addNumero({ NUMERO: element.NUMERO, RESPONSABLE: element.RESPONSABLE, FLAG_TIPO: element.FLAG_TIPO }).then((result) => {
        console.log('postNumeroOnline result');
      }).catch((err) => {
        console.log('postNumeroOnline error');
        this.respuestaFail(err);
      });
    });
  }
  /// ------------------------- ///

  /// ----- OBTENER VIENTO ----- ///

  obtenerViento() {
    this.titulo = 'Obteniendo datos de viento';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countViento().then((countViento) => {
      console.log(countViento);
      if (countViento === 0) {
        console.log('getVientoOnline');
        this.getVientoOnline();
      } else {
        console.log('getVientoOffline');
        // this.getVientoOffline();
      }
    }).catch((error) => {
      this.respuestaFail(error);
    });
  }

  getVientoOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getViento().pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getVientoOnline result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getVientoOnline result');
        // this.parametros = result;
        this.postVientoOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getVientoOnline error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postVientoOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addViento({ DIRECCION_ABRV: element.DIRECCION_ABRV, DESCRIPCION: element.DESCRIPCION, GRADO: element.GRADO }).then((result) => {
        console.log('postVientoOnline result');
      }).catch((err) => {
        console.log('postVientoOnline error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- OBTENER NUBES ----- ///

  obtenerNube() {
    this.titulo = 'Obteniendo datos nube';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countNube().then((countNube) => {
      console.log(countNube);
      if (countNube === 0) {
        console.log('getNubeOnline');
        this.getNubeOnline();
      } else {
        console.log('getNubeOffline');
        // this.getDeficitOffline();
      }
    }).catch((error) => {
      this.respuestaFail(error);
    });
  }

  getNubeOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getNube().pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getNubeOnline result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getNubeOnline result');
        // this.parametros = result;
        this.postNubeOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getNubeOnline error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postNubeOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addNube({ ID_ALTITUD: element.ID_ALTITUD, SIMBOLO: element.SIMBOLO, VALOR: element.VALOR, C_COD_PARAG: element.C_COD_PARAG, C_COD_CORRP: element.C_COD_CORRP, DESC_ALTITUD: element.DESC_ALTITUD, DESC_TIPO_NUBE: element.DESC_TIPO_NUBE }).then((result) => {
        console.log('postNubeOnline result');
      }).catch((err) => {
        console.log('postNubeOnline error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- OBTENER DEFICIT ----- ///

  obtenerDeficit() {
    this.titulo = 'Obteniendo datos de deficiencia';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countDeficit().then((countDeficit) => {
      console.log(countDeficit);
      if (countDeficit === 0) {
        console.log('getDeficitOnline');
        this.getDeficitOnline();
      } else {
        console.log('getDeficitOffline');
        // this.getDeficitOffline();
      }
    }).catch((error) => {
      // this.respuestaFail(error);
    });
  }

  getDeficitOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getDeficit().pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getDeficitOnline result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getDeficitOnline result');
        // this.parametros = result;
        this.postDeficitOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getDeficitOnline error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postDeficitOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addDeficit({ ID_DEFICIENCIA: element.ID_DEFICIENCIA, V_NOM_DEFICINSTR: element.V_NOM_DEFICINSTR, C_COD_PARAG: element.C_COD_PARAG, TIPO_ESTA: element.TIPO_ESTA, ID_ESTADO: element.ID_ESTADO, C_COD_CORRP: element.C_COD_CORRP }).then((result) => {
        console.log('postDeficitOnline result');
      }).catch((err) => {
        console.log('postDeficitOnline error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- OBTENER PARAMETROS ----- ///

  obtenerParametros() {
    this.titulo = 'Obteniendo parametros';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countParametro(this.activatedRoute.snapshot.paramMap.get('id')).then((countParametro) => {
      console.log(countParametro);
      if (countParametro === 0) {
        console.log('getParametroOnline');
        this.getParametroOnline();
      } else {
        console.log('getParametroOffline');
        // this.getParametroOffline();
      }
    }).catch((error) => {
      // this.respuestaFail(error);
    });
  }

  getParametroOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getParametro({ V_COD_ESTA: this.activatedRoute.snapshot.paramMap.get('id') }).pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getParametro result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getParametro result');
        // this.parametros = result;
        this.postParametroOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getParametro error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postParametroOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addParametro({ V_COD_ESTA: element.V_COD_ESTA, ID_HORA_SINOPTICA: element.ID_HORA_SINOPTICA, C_COD_PARAG: element.C_COD_PARAG, C_COD_CORRP: element.C_COD_CORRP, V_NOM_PARA: element.V_NOM_PARA, C_COD_PARAT: element.C_COD_PARAT, C_TIP_DATO: element.C_TIP_DATO, I_DEC_PARA: element.I_DEC_PARA, V_NOC_PARA: element.V_NOC_PARA, FLG_INPUT: element.FLG_INPUT, COD_PARAM: element.COD_PARAM }).then((result) => {
        console.log('postParametroOnline result');
      }).catch((err) => {
        console.log('postParametroOnline error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- OBTENER HORAS ----- ///

  obtenerHoras() {
    this.titulo = 'Obteniendo horas sinopticas';
    this.sqlite.countHora(this.activatedRoute.snapshot.paramMap.get('tipo')).then((countHora) => {
      console.log(countHora);
      if (countHora === 0) {
        console.log('getHoraOnline');
        this.getHoraOnline();
      } else {
        console.log('getHoraOffline');
        this.getHoraOffline();
      }
    }).catch((error) => {
      this.respuestaFail(error);
    });
  }

  click_horario() {
    this.div_opciones = !this.div_opciones;
    this.div_horarios = !this.div_horarios;
  }

  getHoraOnline() {
    console.log(this.activatedRoute.snapshot.paramMap.get('tipo'));
    this.home.getHora({ V_COD_TIPO: this.activatedRoute.snapshot.paramMap.get('tipo') }).pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      console.log(result);
      if (result.error) {
        this.errorAlert(result.error);
      } else {
        this.horas = result;
        this.postHoraOnline(result);
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

  getHoraOffline() {
    console.log(this.activatedRoute.snapshot.paramMap.get('tipo'));
    // tslint:disable-next-line: max-line-length
    this.sqlite.getHora(this.activatedRoute.snapshot.paramMap.get('tipo')).then((result) => {
      this.horas = result;
    }).catch((err) => {
      console.log('getHoraOffline error');
      this.respuestaFail(err);
    });
  }

  postHoraOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addHora({ ID_HORA_SINOPTICA: element.ID_HORA_SINOPTICA, COD_DET_SH: element.COD_DET_SH, DESC_HORA_SINOP: element.DESC_HORA_SINOP, COD_TIPO_ESTA: element.COD_TIPO_ESTA }).then((result) => {
        // tslint:disable-next-line: max-line-length
        console.log('postHoraOnline result');
        this.sqlite.getHora(this.activatedRoute.snapshot.paramMap.get('tipo')).then(() => {
        }).catch((error) => {
          console.log('this.sqlite.getHora error');
          this.respuestaFail(error);
        });
      }).catch((err) => {
        console.log('result.forEach error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- OBTENER OCURRENCIA ----- ///

  obtenerOcurrencia() {
    this.titulo = 'Obteniendo datos de Ocurrencia';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countOcurrencia().then((countOcurrencia) => {
      console.log(countOcurrencia);
      if (countOcurrencia === 0) {
        console.log('getOcurrenciaOnline');
        this.getOcurrenciaOnline();
      } else {
        console.log('getOcurrenciaOffline');
        // this.getVientoOffline();
      }
    }).catch((error) => {
      this.respuestaFail(error);
    });
  }

  getOcurrenciaOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getOcurrencia().pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getOcurrenciaOnline result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getOcurrenciaOnline result');
        // this.parametros = result;
        this.postOcurrenciaOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getOcurrenciaOnline error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postOcurrenciaOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addOcurrencia({ C_COR_OCURRE: element.C_COR_OCURRE, V_DES_OCURRE: element.V_DES_OCURRE }).then((result) => {
        console.log('postOcurrenciaOnline result');
      }).catch((err) => {
        console.log('postOcurrenciaOnline error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- OBTENER PARAEVENTO ----- ///

  obtenerParaEvento() {
    this.titulo = 'Obteniendo datos de Eventos';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countParaEvento().then((countParaEvento) => {
      console.log(countParaEvento);
      if (countParaEvento === 0) {
        console.log('getParaEventoOnline');
        this.getParaEventoOnline();
      } else {
        console.log('getParaEventoOffline');
        // this.getVientoOffline();
      }
    }).catch((error) => {
      this.respuestaFail(error);
    });
  }

  getParaEventoOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getEvento().pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getParaEventoOnline result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getParaEventoOnline result');
        // this.parametros = result;
        this.postParaEventoOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getParaEventoOnline error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postParaEventoOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addParaEvento({ C_COR_PAREVE: element.C_COR_PAREVE, V_DES_PAREVEN: element.V_DES_PAREVEN }).then((result) => {
        console.log('postParaEventoOnline result');
      }).catch((err) => {
        console.log('postParaEventoOnline error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- OBTENER INCIDENCIA ----- ///

  obtenerIncidencia() {
    this.titulo = 'Obteniendo datos de incidencia';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countIncidencia().then((countIncidencia) => {
      console.log(countIncidencia);
      if (countIncidencia === 0) {
        console.log('getIncidenciaOnline');
        this.getIncidenciaOnline();
      } else {
        console.log('getIncidenciaOffline');
        // this.getVientoOffline();
      }
    }).catch((error) => {
      this.respuestaFail(error);
    });
  }

  getIncidenciaOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getIncidencia().pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getIncidenciaOnline result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getIncidenciaOnline result');
        // this.parametros = result;
        this.postIncidenciaOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getIncidenciaOnline error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postIncidenciaOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addIncidencia({ ID_INCIDENCIA: element.ID_INCIDENCIA, DESC_INCIDENCIA: element.DESC_INCIDENCIA, COD_TIPO_INCI: element.COD_TIPO_INCI, ABREV_INCI: element.ABREV_INCI }).then((result) => {
        console.log('postIncidenciaOnline result');
      }).catch((err) => {
        console.log('postIncidenciaOnline error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- OBTENER EVENTO_X_OCURRENCIA ----- ///

  obtenerEvento_x_para() {
    this.titulo = 'Obteniendo datos de Evento_x_para';
    // tslint:disable-next-line: max-line-length
    this.sqlite.countEvento_x_para().then((countEvento_x_para) => {
      console.log(countEvento_x_para);
      if (countEvento_x_para === 0) {
        console.log('getEvento_x_paraOnline');
        this.getEvento_x_paraOnline();
      } else {
        console.log('getEvento_x_paraOffline');
        // this.getVientoOffline();
      }
    }).catch((error) => {
      this.respuestaFail(error);
    });
  }

  getEvento_x_paraOnline() {
    // tslint:disable-next-line: max-line-length
    this.home.getEvento_x_para().pipe(
      timeout(60000),
    ).subscribe((result: any) => {
      if (result.error) {
        console.log('getEvento_x_paraOnline result.error');
        this.errorAlert(result.error);
      } else {
        console.log('getEvento_x_paraOnline result');
        // this.parametros = result;
        this.postEvento_x_paraOnline(result);
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      console.log('getEvento_x_paraOnline error');
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  postEvento_x_paraOnline(result) {
    result.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.sqlite.addEvento_x_para({ C_COR_PAREVE: element.C_COR_PAREVE, C_COR_OCURRE: element.C_COR_OCURRE, C_IDE_ORDEN: element.C_IDE_ORDEN, C_COD_PARAG: element.C_COD_PARAG, C_COD_CORRP: element.C_COD_CORRP, V_NOM_PARA: element.V_NOM_PARA }).then((result) => {
        console.log('postEvento_x_paraOnline result');
      }).catch((err) => {
        console.log('postEvento_x_paraOnline error');
        this.respuestaFail(err);
      });
    });
  }

  /// ----- PAGINAS ----- ///

  click_regresar() {
    this.div_opciones = !this.div_opciones;
    this.div_horarios = !this.div_horarios;
  }

  async PageMedicion(ID_HORA_SINOPTICA) {
    localStorage.setItem('ID_HORA_SINOPTICA', '' + ID_HORA_SINOPTICA)
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>Esta seguro de iniciar el registro de datos?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: PageMedicion');
          },
        }, {
          text: 'Aceptar',
          handler: () => {
            // tslint:disable-next-line: max-line-length
            this.router.navigate(['/medicion', this.activatedRoute.snapshot.paramMap.get('id'), ID_HORA_SINOPTICA, 'M']);
            this.backButtonSubscription.unsubscribe();
            console.log('Confirm Okay PageMedicion');
          },
        },
      ],
    });
    await alert.present();
  }

  PageMeteoro() {
    this.backButtonSubscription.unsubscribe();
    this.router.navigate(['/meteoro', this.activatedRoute.snapshot.paramMap.get('id')]);
  }

  PageIncidencia() {
    this.backButtonSubscription.unsubscribe();
    this.router.navigate(['/incidencia', this.activatedRoute.snapshot.paramMap.get('id')]);
  }

  PageListar() {
    this.backButtonSubscription.unsubscribe();
    this.router.navigate(['/listar', this.activatedRoute.snapshot.paramMap.get('id'), this.activatedRoute.snapshot.paramMap.get('tipo')]);
  }

  PageReenviar() {
    this.backButtonSubscription.unsubscribe();
    this.router.navigate(['/reenviar', this.activatedRoute.snapshot.paramMap.get('id'), this.activatedRoute.snapshot.paramMap.get('tipo')]);
  }

  PageLibreta() {
    this.backButtonSubscription.unsubscribe();
    this.router.navigate(['/libreta', this.activatedRoute.snapshot.paramMap.get('id'), this.activatedRoute.snapshot.paramMap.get('tipo')]);
  }

  async PageSinc() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>Desea sincronizar los datos del aplicativo</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: PageSinc');
          },
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay PageSinc');
            this.asyncLoading();
          },
        },
      ],
    });
    await alert.present();
  }

  async asyncLoading() {
    const loading = await this.loadingController.create({
      backdropDismiss: false,
      message: 'Obteniendo datos, por favor espere',
    });
    await loading.present();
    let array = ['SIMENH_HORA_SINOPTICA', 'SIMENH_PARAM_X_ESTACION', 'SIMENH_DEFICINSTRU', 'SIMENH_TIPO_NUBE_X_PARAM', 'SIMENH_DIRECC_VIENTO', 'SIMENH_UMBRALES_PARAM'];
    array.forEach((element) => {
      console.log(element);
      this.sqlite.deleteTable(element);
    });
    // loading.dismiss();
    console.log('Termino bn');
    loading.dismiss();
    this.flag_sinc = true;
    this.ngOnInit();
    // this.sqlite.deleteTable().then(async (result) => {
    //   await this.ngOnInit();
    //   await loading.dismiss();
    //   console.log('asyncLoading result');
    //   console.log(result);
    // }).catch((err) => {
    //   loading.dismiss();
    //   console.log('asyncLoading err');
    //   console.log(err);
    // });
  }

  /// ----- EVENTOS DE LA PAGINA MISMA ----- ///

  ionViewDidEnter() {
    console.log(this.router.url);
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (!this.div_horarios && this.div_opciones) {
        if (this.routerOutlet && this.routerOutlet.canGoBack()) {
          this.routerOutlet.pop();
          // tslint:disable-next-line: max-line-length
        } else if (this.router.url === '/meteorologia/' + this.activatedRoute.snapshot.paramMap.get('id') + '/' + this.activatedRoute.snapshot.paramMap.get('tipo')) {
          this.alertController.dismiss().then((result) => {
            console.log(result);
          }).catch((err) => {
          });
          this.salirAlertConfirm();
        }
      } else {
        this.div_horarios = !this.div_horarios;
        this.div_opciones = !this.div_opciones;
      }
    });
  }

  /// ----- ALERTAS ----- ///

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
      // subHeader: 'Error',
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
      // subHeader: 'Error',
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
        message: '<strong>Desea salir del modulo?</strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: salirAlertConfirm');
            },
          }, {
            text: 'Aceptar',
            handler: () => {
              console.log('Confirm Okay salirAlertConfirm');
              this.backButtonSubscription.unsubscribe();
              this.navCtrl.navigateBack('/home');
            },
          },
        ],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje!',
        message: '<strong>Desea salir del modulo?</strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: salirAlertConfirm');
            },
          }, {
            text: 'Aceptar',
            handler: () => {
              console.log('Confirm Okay salirAlertConfirm');
              this.backButtonSubscription.unsubscribe();
              this.navCtrl.navigateBack('/home');
            },
          },
        ],
      });
      await alert.present();
    }
  }

  ngOnDestroy() {
    console.log('ngOnDestroy en meteorologia');
    this.backButtonSubscription.unsubscribe();
  }

}
