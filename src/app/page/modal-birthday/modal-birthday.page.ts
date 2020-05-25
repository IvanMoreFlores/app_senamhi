import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-birthday',
  templateUrl: './modal-birthday.page.html',
  styleUrls: ['./modal-birthday.page.scss'],
})
export class ModalBirthdayPage implements OnInit {

  observador: String = localStorage.getItem('NOMBRES') + ', '
    + localStorage.getItem('APE_PATERNO') + ' '
    + localStorage.getItem('APE_MATERNO');
    
  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  close_modal() {
    this.modalController.dismiss();
  }


}
