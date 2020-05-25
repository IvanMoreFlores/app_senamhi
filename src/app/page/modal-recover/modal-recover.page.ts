import { ViewChild, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { LoginService } from '../../services/login/login.service';
import { timeout } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-modal-recover',
  templateUrl: './modal-recover.page.html',
  styleUrls: ['./modal-recover.page.scss'],
})
export class ModalRecoverPage implements OnInit {

  @ViewChild('searchInput') sInput;
  tabEl: ElementRef;
  email: string;
  formularioUsuario: FormGroup;
  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    private renderer: Renderer2,
    private router: Router,
    public login: LoginService,
    public loadingController: LoadingController,
    public NvCtrl: NavController,
    public fb: FormBuilder,
    private callNumber: CallNumber,
  ) {
    this.formularioUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    console.log('ionViewDidLoad');
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
  }

  close_modal() {
    this.modalController.dismiss();
  }

  btn_llamar() {
    this.callNumber.callNumber('+51982958271', true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async recoverPass() {
    const loading = await this.loadingController.create({
      message: 'Espere por favor',
      backdropDismiss: false,
    });
    await loading.present();
    this.login.recoverPass({ email: this.formularioUsuario.value.email }).pipe(
      timeout(25000),
    ).subscribe((result: any) => {
      console.log('Cool');
      console.log(result);
      if (result.error === 0) {
        loading.dismiss();
        this.recoverPassAlert();
      } else {
        this.sinAlert(result.msj);
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

  async recoverPassAlert() {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      backdropDismiss: false,
      message: '<strong>Se envió correctamente el email</strong>',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log('Confirm Okay');
          this.modalController.dismiss();
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
