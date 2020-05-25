import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { AlertController, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
import { HomeService } from '../../services/home/home.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  @ViewChild('searchInput') sInput;
  tabEl: ElementRef;
  // tslint:disable-next-line: variable-name
  n_password: String = '';
  // tslint:disable-next-line: variable-name
  c_password: String = '';
  // tslint:disable-next-line: variable-name
  btn_pass: Boolean = false;
  type: String = 'password';
  icono: String = 'eye';
  exit: boolean = false;

  constructor(
    public platform: Platform,
    public NvCtrl: NavController,
    public alertController: AlertController,
    private renderer: Renderer2,
    private router: Router,
    // tslint:disable-next-line: variable-name
    public Home: HomeService,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public Storage: StorageService,
  ) {
    if (localStorage.getItem('FLG_NUEVO') === '1') {
      this.exit = true;
    }
  }

  ngOnInit() {
    console.log('ionViewDidLoad');
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
  }

  close_modal() {
    // this.modalController.dismiss();
    this.NvCtrl.navigateBack('/home');
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

  // tslint:disable-next-line: function-name
  async ConfirmarAlert(Header: any, RsubHeader: any, Rmessage: any) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: Header,
      // subHeader: RsubHeader,
      message: Rmessage,
      buttons: ['OK'],
    });
    await alert.present();
  }

  clickReset() {
    if (this.n_password === null || this.n_password === '') {
      this.ConfirmarAlert(
        'Mensaje',
        'Dato incompleto',
        'El campo nueva contraseña esta vacío',
      );
      return false;
    }
    if (this.c_password === null || this.c_password === '') {
      this.ConfirmarAlert(
        'Mensaje',
        'Dato incompleto',
        'El campo confirmar contraseña esta vacío',
      );
      return false;
    }
    if (this.n_password !== this.c_password) {
      this.ConfirmarAlert(
        'Mensaje',
        'Datos erroneos',
        'Los campos no coinciden',
      );
      return false;
    }
    if (this.n_password.length < 8) {
      // tslint:disable-next-line: max-line-length
      this.ConfirmarAlert(
        'Mensaje',
        'Formato erroneo',
        'Contraseña minimo 8 caracteres y maximo 12 caracteres',
      );
      return false;
    }
    if (this.n_password.length > 12) {
      // tslint:disable-next-line: max-line-length
      this.ConfirmarAlert(
        'Mensaje',
        'Formato erroneo',
        'Contraseña minimo 8 caracteres y maximo 12 caracteres',
      );
      return false;
    }
    // this.router.navigateByUrl('/home');
    this.updatePassword();
  }

  async updatePassword() {
    const loading = await this.loadingController.create({
      message: 'Espere por favor',
      backdropDismiss: false,
    });
    await loading.present();
    // tslint:disable-next-line: max-line-length
    this.Home.updatePassword({ new_password: this.n_password, old_password: localStorage.getItem('PASS'), id_usuario: localStorage.getItem('ID_USUARIO') }).pipe(
      timeout(25000),
    ).subscribe((result: any) => {
      console.log('Cool');
      console.log(result);
      if (result) {
        this.Storage.actualizar_flag();
        loading.dismiss();
        this.updatePasswordAlert();
      } else {
        loading.dismiss();
      }
      // tslint:disable-next-line: align
    }, (err: any) => {
      loading.dismiss();
      console.log('Not cool');
      console.log(err);
      if (err.name === 'TimeoutError') {
        this.sinAlert('Sin cobertura de internet');
      } else {
        this.respuestaFail(err);
      }
    });
  }

  async updatePasswordAlert() {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      backdropDismiss: false,
      message: '<strong>Se actualizó correctamente</strong>',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log('Confirm Okay');
          this.NvCtrl.navigateRoot('/home');
        }
      }],
    });
    await alert.present();
  }

  async sinAlert(error) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      // subHeader: 'Error',
      message: '<strong>' + error + '</strong>',
      buttons: ['Aceptar'],
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
}
