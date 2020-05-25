import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line: no-duplicate-imports
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MeteoroPage } from './meteoro.page';

const routes: Routes = [
  {
    path: '',
    component: MeteoroPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MeteoroPage]
})
export class MeteoroPageModule {}
