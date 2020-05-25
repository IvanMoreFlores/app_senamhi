import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ConnectionStatus {
  Online,
  Offline,
}
@Injectable({
  providedIn: 'root',
})
export class NetworkService {

  latitude: number = null;
  longitude: number = null;
  watchLocationUpdates: any;

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(private network: Network, private toastController: ToastController, private plt: Platform,
    private geolocation: Geolocation) {
    this.plt.ready().then(() => {
      // this.coordenadas();
      this.initializeNetworkEvents();
      const status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }

  public initializeNetworkEvents() {

    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('WE ARE OFFLINE');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('WE ARE ONLINE');
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    const connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    const toast = this.toastController.create({
      message: `Ahora estas ${connection}`,
      duration: 3000,
      position: 'bottom',
    });
    toast.then(toast => toast.present());
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

  public coordenadas() {
    this.watchLocationUpdates = this.geolocation.getCurrentPosition().then((data) => {
      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
      this.latitude = null;
      this.longitude = null;
    });
  }

  public salirCoordenada() {
    //  this.watchLocationUpdates.clearWatch();
    //  this.watchLocationUpdates.clearWatch();
  }
}
