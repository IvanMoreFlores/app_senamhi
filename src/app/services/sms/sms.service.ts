import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
declare var SMS: any;
@Injectable({
  providedIn: 'root'
})
export class SmsService {

  cantCaracteres = 120;
  particiones;
  array = [];

  constructor(public toastCtrl: ToastController,
    public loadingController: LoadingController) { }

  obtCodEsta(cadena) {
    console.log('obtCodEsta : ', cadena);
    var json_object = JSON.parse(cadena);
    var codEsta = json_object.V_COD_ESTA;
    return codEsta;
  }

  obtFechaHora() {
    var fecHora = "";
    var fecha = new Date();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var anio = fecha.getFullYear();
    var hora = fecha.getHours();
    var minuto = fecha.getMinutes();
    var segundo = fecha.getSeconds();
    if (mes < 10)
      mes = 0 + mes;
    if (dia < 10)
      dia = 0 + dia;
    if (hora < 10)
      hora = 0 + hora;
    if (minuto < 10)
      minuto = 0 + minuto;
    if (segundo < 10)
      segundo = 0 + segundo;

    fecHora = anio + "" + mes + "" + dia + "" + hora + "" + minuto + "" + segundo;
    return fecHora;
  }

  separarCadena(cadena) {
    this.cantCaracteres = 120;
    this.particiones;
    this.array = [];
    console.log('separarCadena : ', cadena);
    let key = this.obtFechaHora() + "" + this.obtCodEsta(cadena);
    console.log('key : ', key);
    this.particiones = cadena.length / this.cantCaracteres;
    for (let i = 0; i < this.particiones; i++) {
      var cadSeparada = cadena.substring(0, this.cantCaracteres);
      this.array.push([key, cadSeparada]);
      cadena = cadena.substring(this.cantCaracteres, cadena.length);
    }
    this.send(this.array);
    // console.log(this.array);
    // return this.array;
  }

  async send(obj) {
    const loading = await this.loadingController.create({
      message: 'Enviando mensaje de texto',
    });
    await loading.present();
    console.log(obj.length);
    obj.forEach(element => {
      element = element.toString();
      element = element.replace(/}/g, ')');
      element = element.replace(/{/g, '(');
      console.log(element.length);
      console.log(element);
      if (SMS) {
        SMS.sendSMS(['968169082', '990391969', '979667907', '943056389', '991452414', '951708907', '944127579', '940226757'], element, (ListSms) => {
          console.log(ListSms);
          loading.dismiss();
          this.presentToast('Mensaje enviado exitosamente');
        }, (error) => {
          loading.dismiss();
          console.log(error);
          this.presentToast('Fracaso el enviado del mensaje');
        });
      }
    });
    // let obj: any;
    // obj = {
    //   name: 'John',
    //   age: 30,
    //   city: 'New York',
    //   contactPerson: {
    //     name: 'Ivan',
    //     cellphone: {
    //       name: 'Ivan',
    //       cellphone: 990391969,
    //     },
    //   },
    // };
    // console.log('JSON', JSON.stringify(obj));
    // obj = JSON.stringify(obj);
    ////////////////////////////////////////
    // obj = obj.replace(/}/g, ')');
    // obj = obj.replace(/{/g, '(');
    // console.log(obj.length);
    // console.log(obj);
    // if (SMS) {
    //   SMS.sendSMS(['968169082', '990391969'], obj, (ListSms) => {
    //     console.log(ListSms);
    //     this.presentToast('Mensaje enviado exitosamente');
    //   }, (error) => {
    //     console.log(error);
    //     this.presentToast('Fracaso el enviado del mensaje');
    //   });
    // }
    ///////////////////////////////////////
  }

  async presentToast(Message: any) {
    const toast = await this.toastCtrl.create({
      message: Message,
      duration: 3000,
    });
    toast.present();
  }


}
