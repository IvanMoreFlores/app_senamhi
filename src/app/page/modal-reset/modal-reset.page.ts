import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal-reset',
  templateUrl: './modal-reset.page.html',
  styleUrls: ['./modal-reset.page.scss'],
})
export class ModalResetPage implements OnInit {
  constructor(
    private router: Router,
    public modalController: ModalController,
    public NvCtrl: NavController,
  ) {}

  ngOnInit() {}

  // tslint:disable-next-line: function-name
  PageReset() {
    this.modalController.dismiss();
    this.NvCtrl.navigateRoot('/reset-password');
    // this.router.navigateByUrl('/reset-password');
  }
}
