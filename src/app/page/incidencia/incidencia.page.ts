import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ActionSheetController, AlertController, IonRouterOutlet, NavController, Platform, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// Services
import { SqliteService } from '../../services/sqlite/sqlite.service';
import { CargarImgService } from './../../services/cargar-img/cargar-img.service';
import { HomeService } from '../../services/home/home.service';
import { ConnectionStatus, NetworkService } from '../../services/network/network.service';

@Component({
  selector: 'app-incidencia',
  templateUrl: './incidencia.page.html',
  styleUrls: ['./incidencia.page.scss'],
})
export class IncidenciaPage implements OnInit {
  estacion: any;
  myDate: string;
  myTime: string;
  myDateNTime: string;
  backButtonSubscription;
  //Parametros
  myDateTime = new Date().toISOString();
  tipoIncid: any;
  Incid: any;
  comentarioIncid: string;
  //
  incidencias: any;
  images: any = [];
  fotos: any[] = [];
  cantidad_fotos: any;
  formulario: FormData;
  options: any;
  cameraOptions: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    saveToPhotoAlbum: true
  }
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sqlite: SqliteService,
    private datePicker: DatePicker,
    public platform: Platform,
    public navCtrl: NavController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private imagePicker: ImagePicker,
    private webview: WebView,
    private camera: Camera,
    private cargarimg: CargarImgService,
    public home: HomeService,
    public loadingController: LoadingController,
    private networkService: NetworkService,
  ) {
    this.networkService.coordenadas();
  }

  ngOnInit() {
    this.sqlite
      .getEstacionId(this.activatedRoute.snapshot.paramMap.get('id'))
      .then(result => {
        this.estacion = result[0];
        console.log(result[0]);
        console.log(this.estacion);
      })
      .catch(err => { });
  }


  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
        console.log(this.router.url);
        // tslint:disable-next-line: max-line-length
      } else if (this.router.url === '/incidencia/' + this.activatedRoute.snapshot.paramMap.get('id')) {
        this.alertController.dismiss().then((result) => {
          console.log(result);
        }).catch((err) => {
          console.log(err);
        });
        this.salirAlertConfirm();
      }
    });
  }

  ionChange($event) {
    this.incidencias = [];
    console.log($event.target.value);
    console.log(this.incidencias);
    this.sqlite.getIncidencia($event.target.value).then((result) => {
      console.log(result);
      this.incidencias = result;
    });
  }

  async salirAlertConfirm() {
    let topLoader = await this.alertController.getTop();
    if (topLoader) {
      topLoader.dismiss();
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Mensaje',
        message: '<strong>¿Esta seguro de salir?<br>Se perdera el registro</strong>',
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
        message: '<strong>¿Esta seguro de salir?<br>Se perdera el registro</strong>',
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

  async imageActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Capturar imagen',
      buttons: [{
        text: 'Abrir galeria',
        icon: 'images',
        handler: () => {
          this.selectPhotos();
          console.log('Abrir galeria clicked');
        },
      }, {
        text: 'Tomar una foto',
        icon: 'camera',
        handler: () => {
          this.takeSnap();
          console.log('Tomar una foto clicked');
        },
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancelar clicked');
        },
      }],
    });
    await actionSheet.present();
  }

  selectPhotos() {
    this.options = {
      // El número máximo de imágenes que le vamos a permitir escoger al usuario.
      maximumImagesCount: 5,
      // máximo ancho y alto
      // width: 800,
      // height: 800,
      // Calidad de la imagen
      quality: 70,
      // El tipo de respuesta
      // 0 para que retorne la ruta del archivo
      //  1 para que retorne un archivo en Base64
      outputType: 0,
    };

    this.imagePicker.getPictures(this.options).
      then((results) => {
        this.images = [];
        this.fotos = results;
        this.cantidad_fotos = results.length;
        console.log(results);
        for (let i = 0; i < results.length; i++) {
          // this.images.push('data:image/jpeg;base64,' + results[i]);
          this.images.push(this.webview.convertFileSrc(results[i]));
        }
      },
        // tslint:disable-next-line: align
        (err) => {
          alert(err);
        });
  }

  takeSnap() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      console.log(imageData);
      this.fotos = imageData;
      // this.camera.DestinationType.FILE_URI gives file URI saved in local
      // this.camera.DestinationType.DATA_URL gives base64 URI
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.capturedSnapURL = base64Image;
      // this.images.push('data:image/jpeg;base64,' + imageData);      
      this.images.push(this.webview.convertFileSrc(imageData));
      (this.images.length > 5) ? this.images.shift() : this.images;
      console.log(this.images.length);
      this.cantidad_fotos = this.images.length;
    }, (err) => {
      console.log(err);
      // Handle error
    });
  }

  async btnRegistrar() {
    if (!this.myDateTime) {
      this.valiAlert('Ingrese la Fecha de la incidencia');
      return false;
    } if (!this.tipoIncid) {
      this.valiAlert('Seleccione el tipo de incidencia');
      return false;
    } if (!this.comentarioIncid) {
      this.valiAlert('Ingrese algun comentario sobre la incidencia');
      return false;
    } if (this.images.length === 0) {
      this.valiAlert('Seleccione alguna imagen');
      return false;
    } else {
      const loading = await this.loadingController.create({
        message: 'Espere...',
      });
      await loading.present();
      this.networkService.onNetworkChange().subscribe(async (status: ConnectionStatus) => {
        this.cargarimg.getFormulario(this.fotos)
          .then(async (result) => {
            this.formulario = result;
            const option = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const option2 = { year: 'numeric', month: '2-digit', day: '2-digit' };
            this.formulario.append('CANTIDAD', this.cantidad_fotos);
            this.formulario.append('NOBRE_CARPETA', ((new Date(this.myDateTime)).toLocaleDateString('ja-JP', option2)).split('/').join('-'));
            this.formulario.append('V_COD_ESTA', localStorage.getItem('V_COD_ESTA'));
            this.formulario.append('ID_INCIDENCIA', this.Incid);
            this.formulario.append('COMENTARIO', this.comentarioIncid);
            this.formulario.append('NUM_LATITUD', (this.networkService.latitude).toString());
            this.formulario.append('NUM_LONGITUD', (this.networkService.longitude).toString());
            this.formulario.append('ID_USUARIO', localStorage.getItem('ID_USUARIO'));
            this.formulario.append('FECHA_REAL', ((new Date(this.myDateTime)).toLocaleDateString('ja-JP', option)).split('/').join('-'));
            this.formulario.append('ID_ESTADO', '1');
            this.formulario.append('FLG_MEDIO', '1');
            this.home.subirIncidencia(this.formulario).subscribe((dato) => {
              loading.dismiss();
              console.log(dato);
              if (dato === true) {
                this.successAlert('Se guardo correctamente');
              } else {
                this.valiAlert(dato);
              }
            },
              (err: any) => {
                loading.dismiss();
                this.valiAlert(err.message);
                console.log(err);
              }
            );
          })
          .catch(err => {
            loading.dismiss();
            console.log('Error', err);
            this.valiAlert(err.message);
          });
      },
        (err: any) => {
          loading.dismiss();
          console.log(err);
          this.valiAlert(err.message);
        }
      );
    }
  }

  async valiAlert(mensaje) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>' + mensaje + '</strong>',
      buttons: ['ACEPTAR']
    });
    await alert.present();
  }

  async successAlert(mensaje) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>' + mensaje + '</strong>',
      buttons: [{
        text: 'ACEPTAR',
        handler: () => {
          console.log('Confirm Okay');
          this.navCtrl.pop();
        }
      }]
    });
    await alert.present();
  }

}
