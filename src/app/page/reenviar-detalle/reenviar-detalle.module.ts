import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReenviarDetallePage } from './reenviar-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ReenviarDetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReenviarDetallePage]
})
export class ReenviarDetallePageModule {}
