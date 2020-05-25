import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ModalController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
// Services
import { SqliteService } from '../../services/sqlite/sqlite.service';

@Component({
  selector: 'app-modal-resumen',
  templateUrl: './modal-resumen.page.html',
  styleUrls: ['./modal-resumen.page.scss'],
})
export class ModalResumenPage implements OnInit {

  form: any;
  resumen: any = [];
  btn: boolean = false;
  div_datos: boolean = false;
  div_meto: boolean = false;
  form_meto: any;
  div_aforo: boolean = false;
  form_aforo: any;
  count = 0;
  counter = 0;
  contador = 0;
  arrayValor = [];

  constructor(public navCtrl: NavController,
    public navPrms: NavParams,
    private sqlite: SqliteService,
    public modalCtrl: ModalController,
    public alertController: AlertController,
  ) {

  }

  ngOnInit() {
    // console.log('ngOnInit: ', this.form);
    if (this.navPrms.get('datos') === 1) {
      this.div_datos = true;
      if (this.navPrms.get('btn') === 1) {
        // console.log('true 1');
        this.btn = true;
      } else {
        // console.log('false 1');
        this.btn = false;
      }
      this.form = this.navPrms.get('form');
      // console.log('this.form', this.form);

      for (const prop in this.form) {
        // console.log('prop: ', prop);
        this.sqlite.getParametroId(prop).then((result) => {
          // console.log('result: ', result);
          // console.log('this.form[prop]: ', this.form[prop]);
          // console.log('this.form[prop]: ', this.form[prop]['value']);
          if (result[0]['V_NOM_PARA'] !== undefined) {
            this.resumen.push({ codigo: result[0]['COD_PARAM'], name: prop, valor: (this.form[prop]['value'] !== undefined ? this.form[prop]['value'] : this.form[prop]), parametro: result[0]['V_NOM_PARA'] });
            this.devolver_alfanumerico(result[0]['V_NOM_PARA'], (this.form[prop]['value'] !== undefined ? this.form[prop]['value'] : this.form[prop]), this.count);
            this.count++;
          }
        })
        // console.log('this.resumen: ', this.resumen);
      }
    } else if (this.navPrms.get('datos') === 2) {
      this.div_datos = false;
      this.div_aforo = false;
      this.div_meto = true;
      this.form_meto = this.navPrms.get('form');

      if (this.navPrms.get('btn') === 1) {
        // console.log('true 2');
        this.btn = true;
      } else {
        // console.log('false 2');
        this.btn = false;
      }
    } else if (this.navPrms.get('datos') === 3) {
      this.div_datos = false;
      this.div_meto = false;
      this.div_aforo = true;
      this.form_aforo = this.navPrms.get('form');
      if (this.navPrms.get('btn') === 1) {
        // console.log('true 3');
        this.btn = true;
      } else {
        // console.log('false 3');
        this.btn = false;
      }
    }
  }

  /**
   * Esta funcion sirve para organizar los datos 
   * direccopn del viento
   * @param codigo 
   * @param valor 
   * @param i 
   */
  devolver_alfanumerico(codigo, valor, i) {
    let parametro = valor;
    if (this.counter === i) {
      this.counter = this.counter + 1;
      console.log(this.counter);
      // return valor;
      if (codigo.includes('DIRECCION VIENTO DIARIA A LAS')) {
        this.sqlite.getVientoValor(valor).then((result) => {
          parametro = result[0]['DESCRIPCION'];
          this.arrayValor.push({ parametro: parametro, number: i });
          this.arrayValor.sort(function(a, b) {
            var keyA = (a.number),
              keyB = (b.number);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
        });
      } else if (codigo.includes('FORMA DE NUBES')) {
        this.sqlite.getNubeValor(valor).then((result) => {
          parametro = result[0]['DESC_TIPO_NUBE'];
          this.arrayValor.push({ parametro: parametro, number: i });
          this.arrayValor.sort(function(a, b) {
            var keyA = (a.number),
              keyB = (b.number);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
        });
      } else {
        parametro = valor;
        this.arrayValor.push({ parametro: parametro, number: i });
        this.arrayValor.sort(function(a, b) {
          var keyA = (a.number),
            keyB = (b.number);
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
      }
    }
    console.log(this.arrayValor);
  }

  // async devolver_alfanumerico(codigo, valor, i) {
  //   let parametro = valor;
  //   if (this.counter === i) {
  //     this.counter = this.counter + 1;
  //     if (codigo.includes('DIRECCION VIENTO DIARIA A LAS')) {
  //       const result = await this.sqlite.getVientoValor(valor);
  //       parametro = result[0]['DESCRIPCION'];
  //       this.arrayValor.push({ parametro: parametro, number: i });
  //     } else if (codigo.includes('FORMA DE NUBES')) {
  //       const result = await this.sqlite.getNubeValor(valor)
  //       parametro = result[0]['DESC_TIPO_NUBE'];
  //       this.arrayValor.push({ parametro: parametro, number: i });
  //     } else {
  //       const result = await valor;
  //       this.arrayValor.push({ parametro: result, number: i });
  //     }
  //   }
  //   console.log(this.arrayValor);
  // }



  devolver_valor(i) {
    if (this.contador === i) {
      this.contador++;
      return this.arrayValor[i]['parametro'];
    }
  }

  devolver_fecha(fecha: any) {
    return (moment(fecha).format('DD-MM-YYYY'));
  }

  async salirAlertConfirm() {
    this.modalCtrl.dismiss();
  }

  async enviarData() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Mensaje',
      message: '<strong>¿Desea enviar los datos registrados?</strong>',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'SI',
          handler: () => {
            console.log('Confirm Okay');
            this.modalCtrl.dismiss({
              'dismissed': true
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // enviarData() {
  //   this.modalCtrl.dismiss({
  //     'dismissed': true
  //   });
  // }

}
