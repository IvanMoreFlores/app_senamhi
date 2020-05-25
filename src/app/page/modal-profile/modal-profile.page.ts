import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
// Servicios
import { SqliteService } from '../../services/sqlite/sqlite.service';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.page.html',
  styleUrls: ['./modal-profile.page.scss'],
})
export class ModalProfilePage implements OnInit {
  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    public NvCtrl: NavController,
    public SQlite: SqliteService,
  ) { }

  ngOnInit() { }

  close_modal() {
    this.modalController.dismiss();
  }

  async AlertCerrarSession() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Cerrar sesión',
      message: 'Desea <strong>Cerrar sesión</strong>?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'SI',
          handler: () => {
            console.log('Confirm Okay');
            localStorage.clear();
            this.NvCtrl.navigateRoot('/splash');
            this.modalController.dismiss();
            this.SQlite.deleteDB();
          },
        },
      ],
    });
    await alert.present();
  }

  updatePass() {
    this.modalController.dismiss();
    this.NvCtrl.navigateForward('/reset-password');
  }
}
