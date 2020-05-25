import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { StorageService } from './../../services/storage/storage.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  user: String = '';
  messages: any[] = [];
  subscription: Subscription;
  constructor(
    private router: Router,
    private NvCrl: NavController,
    public _login: StorageService,
  ) {
    // this.subscription = this._login.getMessage().subscribe(message => {
    //   this.user = message.text;
    // });
  }

  ngOnInit() {
    if (localStorage.getItem('USUARIO')) {
      if (localStorage.getItem('ID_PERFIL') === '6') {
        this.NvCrl.navigateRoot(['/home']);
      } else {
        this.NvCrl.navigateRoot(['/receptor-home']);
      }
    } else {
      this.NvCrl.navigateRoot('/login');
    }
  }

  ionViewDidEnter() {
    // your code;
    this.ngOnInit();
  }
}
