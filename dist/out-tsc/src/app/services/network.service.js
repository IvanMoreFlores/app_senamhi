import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
var NetworkService = /** @class */ (function () {
    function NetworkService(network, platform) {
        this.network = network;
        this.platform = platform;
        // Internet Activado
        this.online$ = undefined;
        this.online$ = Observable.create(function (observer) {
            observer.next(true);
        }).pipe(mapTo(true));
        if (this.platform.is('cordova')) {
            // on Device
            this.online$ = merge(this.network.onConnect().pipe(mapTo(true)), this.network.onDisconnect().pipe(mapTo(false)));
        }
        else {
            // on Browser
            this.online$ = merge(of(navigator.onLine), fromEvent(window, 'online').pipe(mapTo(true)), fromEvent(window, 'offline').pipe(mapTo(false)));
        }
    }
    NetworkService.prototype.getNetworkType = function () {
        return this.network.type;
    };
    NetworkService.prototype.getNetworkStatus = function () {
        return this.online$;
    };
    NetworkService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Network, Platform])
    ], NetworkService);
    return NetworkService;
}());
export { NetworkService };
//# sourceMappingURL=network.service.js.map