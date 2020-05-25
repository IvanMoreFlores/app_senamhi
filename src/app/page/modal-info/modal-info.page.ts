import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  close_modal() {
    this.modalController.dismiss();
  }

}
