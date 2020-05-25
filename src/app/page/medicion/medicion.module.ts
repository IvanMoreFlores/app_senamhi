import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line: no-duplicate-imports
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MedicionPage } from './medicion.page';
import { SharedModule } from './../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MedicionPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [MedicionPage],
})
export class MedicionPageModule { }
