import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalBirthdayPage } from './modal-birthday.page';

const routes: Routes = [
  {
    path: '',
    component: ModalBirthdayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalBirthdayPage],
  exports: [
    ModalBirthdayPage
  ],
})
export class ModalBirthdayPageModule {}
