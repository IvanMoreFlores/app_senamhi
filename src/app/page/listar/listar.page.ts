import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonRouterOutlet, NavController, Platform, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
// Services
import { HomeService } from '../../services/home/home.service';
import { ConnectionStatus, NetworkService } from '../../services/network/network.service';
import { SqliteService } from '../../services/sqlite/sqlite.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  backButtonSubscription;
  estacion: any;
  tipo: any;
  //
  cabecera: any = {};
  fecha: any;
  formularioAforo: FormGroup;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sqlite: SqliteService,
    public platform: Platform,
    public navCtrl: NavController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public home: HomeService,
    private networkService: NetworkService,
    public fb: FormBuilder,
    public loadingController: LoadingController,
    private keyboard: Keyboard,
  ) {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo');
    console.log(this.estacion);
  }

  async ngOnInit() {
    await this.getEstacion();
  }

  getEstacion() {
    this.sqlite
      .getEstacionId(this.activatedRoute.snapshot.paramMap.get('id'))
      .then(result => {
        this.estacion = result[0];
      })
      .catch(err => {
        console.log('Error getEstacion: ', err);
      });
  }

  btnDetalle(id) {
    this.backButtonSubscription.unsubscribe();
    this.router.navigate(['/listar-detalle', this.activatedRoute.snapshot.paramMap.get('id'), id]);
  }

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
        console.log(this.router.url);
        // tslint:disable-next-line: max-line-length
      } else if (this.router.url === '/listar/' + this.activatedRoute.snapshot.paramMap.get('id') + '/' + this.activatedRoute.snapshot.paramMap.get('tipo')) {
        this.alertController.dismiss().then((result) => {
          console.log(result);
        }).catch((err) => {

        });
        this.salirAlertConfirm();
      }
    });
  }

  async salirAlertConfirm() {
    let topLoader = await this.alertController.getTop();
    if (topLoader) {
      topLoader.dismiss();
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        message: '<strong>¿Esta seguro de salir?<br></strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            },
          }, {
            text: 'Aceptar',
            handler: () => {
              console.log('Confirm Okay');
              this.backButtonSubscription.unsubscribe();
              this.navCtrl.pop();
            },
          },
        ],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        message: '<strong>¿Esta seguro de salir?<br></strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            },
          }, {
            text: 'Aceptar',
            handler: () => {
              console.log('Confirm Okay');
              this.backButtonSubscription.unsubscribe();
              this.navCtrl.pop();
            },
          },
        ],
      });
      await alert.present();
    }
  }
}
