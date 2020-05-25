import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { SMS } from '@ionic-native/sms/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomePage],
  exports: [
    HomePage,
  ],
  providers: [SMS, SQLite],
})
export class HomePageModule { }
