import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MeteorologiaPage } from './meteorologia.page';

const routes: Routes = [
  {
    path: '',
    component: MeteorologiaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MeteorologiaPage]
})
export class MeteorologiaPageModule {}
