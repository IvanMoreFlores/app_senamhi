import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
// Plugin
import { Network } from '@ionic-native/network/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
// Servicios
import { LoginService } from '../../services/login/login.service';
import { StorageService } from '../../services/storage/storage.service';
// Modal
import { ModalRecoverPage } from '../modal-recover/modal-recover.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public unsubscribeBackEvent: any;
  formularioUsuario: FormGroup;
  type: String = 'password';
  icono: String = 'eye';
  usuario: String = '';
  password: String = '';
  isConnected;
  constructor(
    public diagnostic: Diagnostic,
    private renderer: Renderer2,
    public fb: FormBuilder,
    private router: Router,
    private platform: Platform,
    public modalController: ModalController,
    public network: Network,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public s_login: LoginService,
    public s_storage: StorageService,
    public NvCtrl: NavController,
  ) {
    this.formularioUsuario = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    await this.datosOn();
    await this.GPSOn();
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Validando',
      backdropDismiss: false,
    });
    await loading.present();
    // tslint:disable-next-line: max-line-length
    this.formularioUsuario.value.usuario = document.getElementById('demo').getElementsByTagName('input')[0].value;
    this.s_login.login(this.formularioUsuario.value).pipe(timeout(30000)).subscribe((result: any) => {
      console.log('Cool');
      console.log(result);
      if (result.error) {
        loading.dismiss();
        this.errorAlert(result.error);
      } else {
        if (result.ID_PERFIL === '6') {
          loading.dismiss();
          this.s_storage.guardar_session(result);
          this.NvCtrl.navigateRoot('/home').then(() => {
            this.welcomeAlert();
          });
        } else {
          loading.dismiss();
          this.s_storage.guardar_session(result);
          this.NvCtrl.navigateRoot('/receptor-home').then(() => {
            this.welcomeAlert();
          });
        }
      }
      // tslint:disable-next-line: align
    },
      (err: any) => {
        loading.dismiss();
        console.log('Not cool');
        console.log(err);
        if (err.name === 'TimeoutError') {
          this.sinAlert('Sin cobertura de internet');
        } else {
          this.respuestaFail(err);
        }
      },
    );
  }

  async welcomeAlert() {
    let mensaje;
    if (localStorage.getItem('GENERO') === 'M') {
      mensaje = 'Bienvenido';
    } else {
      mensaje = 'Bienvenida';
    }
    const alert = await this.alertController.create({
      header: 'Mensaje',
      backdropDismiss: false,
      subHeader: mensaje,
      // tslint:disable-next-line: prefer-template
      message:
        // tslint:disable-next-line: prefer-template
        '<strong>' +
        localStorage.getItem('NOMBRES') +
        ', ' +
        localStorage.getItem('APE_PATERNO') +
        ' ' +
        localStorage.getItem('APE_MATERNO') +
        '</strong>',
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

  type_password() {
    if (this.type === 'text') {
      this.icono = 'eye';
      this.type = 'password';
    } else {
      this.icono = 'eye-off';
      this.type = 'text';
    }
  }

  async ModalRecover() {
    const modal = await this.modalController.create({
      component: ModalRecoverPage,
      componentProps: { value: 123 },
      cssClass: 'modal-birthday-css',
    });
    return await modal.present();
  }

  async GPSOn() {
    this.diagnostic
      .getLocationMode()
      .then(state => {
        if (state === this.diagnostic.locationMode.LOCATION_OFF) {
          this.gpsOntAlert();
        } else {
          console.log('GPS habilitado');
        }
      })
      .catch(e => console.error(e));
  }

  async gpsOntAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'GPS Inhabilitado',
      message:
        'Su <strong>GPS</strong> está desactivado, por favor <strong>actívelo</strong>!',
      buttons: [
        {
          text: 'IR A LA CONFIGURACIÓN',
          handler: () => {
            this.diagnostic.switchToLocationSettings();
          },
        },
      ],
    });
    await alert.present();
  }

  async datosOn() {
    console.log(this.network);
    console.log(this.network.type);
    if (this.network.type === 'none') {
      console.log('No hay datos prendidos');
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Datos móviles Inhabilitados',
        message:
          // tslint:disable-next-line: max-line-length
          'Sus <strong>Datos móviles</strong> estan desactivados, por favor <strong>actívelo</strong>!',
        buttons: [
          {
            text: 'IR A LA CONFIGURACIÓN',
            handler: () => {
              this.diagnostic.switchToSettings();
            },
          },
        ],
      });
      await alert.present();
    } else {
      console.log('SI hay datos prendidos');
    }
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
