import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonRouterOutlet, NavController, Platform, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// Services
import { HomeService } from '../../services/home/home.service';
import { ConnectionStatus, NetworkService } from '../../services/network/network.service';
import { SqliteService } from '../../services/sqlite/sqlite.service';

@Component({
  selector: 'app-libreta',
  templateUrl: './libreta.page.html',
  styleUrls: ['./libreta.page.scss'],
})
export class LibretaPage implements OnInit {

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  backButtonSubscription;
  estacion: any;
  tipo: any;
  //
  myDateTime = new Date().toISOString();
  cabecera: any = {};
  fecha: any;
  capturedSnapURL: string = null;
  images: any;
  options: any;
  libreta: any;
  Api = 'http://200.10.71.216/API_SENAMHI/App_movil/subir_Libreta';
  filePath: any;
  cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    saveToPhotoAlbum: true
  }
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
    private camera: Camera,
    private imagePicker: ImagePicker,
    private webview: WebView,
    private transfer: FileTransfer,
  ) {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo');
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

  async imageActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Capturar imagen',
      buttons: [{
        text: 'Abrir galeria',
        icon: 'images',
        handler: () => {
          this.camara(this.camera.PictureSourceType.PHOTOLIBRARY);
          console.log('Abrir galeria clicked');
        },
      }, {
        text: 'Tomar una foto',
        icon: 'camera',
        handler: () => {
          this.camara(this.camera.PictureSourceType.CAMERA);
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

  async camara(sourceType: any) {
    const loading = await this.loadingController.create({
      message: 'Espere...',
    });
    await loading.present();
    console.log('tipo de archivo', sourceType);
    const options: CameraOptions = {
      quality: 70,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      loading.dismiss();
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      if (sourceType === 0) {
        console.log('imageData : ', imageData);
        this.libreta = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
        this.filePath = imageData;
        console.log('entro en 0 : ', this.libreta);
      } else {
        this.libreta = imageData.substr(imageData.lastIndexOf('/') + 1);
        this.filePath = imageData;
        console.log('entro en 1 : ', this.libreta);
      }
      this.capturedSnapURL = this.webview.convertFileSrc(imageData);
    }, (err) => {

      loading.dismiss();
      console.log('Error: ' + err);
    });
  }

  async btnRegistrar() {
    if (this.myDateTime === '' || this.myDateTime === null) {
      this.infoAlert('Complete el campo fecha');
    } else if (this.capturedSnapURL === '' || this.capturedSnapURL === null) {
      this.infoAlert('Agrege una imagen');
    } else {
      const option = { year: 'numeric', month: '2-digit', day: '2-digit' };
      this.cabecera.V_COD_ESTA = localStorage.getItem('V_COD_ESTA');
      this.cabecera.FECHA_REAL = ((new Date(this.myDateTime)).toLocaleDateString('ja-JP', option)).split('/').join('-');
      this.cabecera.fileName = this.libreta;
      const loading = await this.loadingController.create({
        message: 'Registrando...',
      });
      console.log(this.cabecera);
      await loading.present();
      const fileTransfer: FileTransferObject = this.transfer.create();
      const options: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.libreta,
        chunkedMode: false,
        mimeType: 'multipart/form-data',
        params: this.cabecera
      };
      fileTransfer.upload(this.filePath, encodeURI(this.Api), options)
        .then((data) => {
          // success
          loading.dismiss();
          console.log(data);
          console.log(data.response);
          // this.infoAlert(data.response);
          data.response.trim() === 'true' ? this.successAlert('Se guardo correctamente') : this.infoAlert(data.response);
        }, (err) => {
          // error
          console.log(err);
          loading.dismiss();
          // const msg = JSON.parse(err.body);
          this.infoAlert('Error en el servidor');
        });
    }
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

  async infoAlert(mensaje) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>' + mensaje + '</strong>',
      buttons: ['ACEPTAR']
    });

    await alert.present();
  }

  ionViewDidEnter() {
    console.log(this.router.url);
    console.log('/libreta/' + this.activatedRoute.snapshot.paramMap.get('id') + '/' + this.activatedRoute.snapshot.paramMap.get('tipo'));
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
        console.log(this.router.url);
      } else if (this.router.url === '/libreta/' + this.activatedRoute.snapshot.paramMap.get('id') + '/' + this.activatedRoute.snapshot.paramMap.get('tipo')) {
        this.alertController.dismiss().then((result) => {
          console.log(result);
        }).catch((err) => {
          console.log(err);
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
