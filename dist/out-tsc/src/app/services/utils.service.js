import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
var UtilsService = /** @class */ (function () {
    function UtilsService(diagnostic, alertController, network, platform, toastController) {
        this.diagnostic = diagnostic;
        this.alertController = alertController;
        this.network = network;
        this.platform = platform;
        this.toastController = toastController;
    }
    UtilsService.prototype.gpsOn = function () {
        var _this = this;
        this.diagnostic.getLocationMode()
            .then(function (state) {
            if (state === _this.diagnostic.locationMode.LOCATION_OFF) {
                _this.gpsOntAlert();
            }
            else {
                console.log('GPS habilitado');
            }
        }).catch(function (e) { return console.error(e); });
    };
    UtilsService.prototype.datosOn = function () {
        // this.network.onConnect().subscribe((data) => {
        //   console.log(this.network.type);
        //   console.log(data);
        // });
        if (this.network.type === 'none') {
            console.log(this.network.type);
            this.datosOntAlert();
        }
    };
    UtilsService.prototype.datosOntAlert = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            backdropDismiss: false,
                            header: 'GPS Inhabilitado',
                            message: 'Vaya a <strong>Configuración</strong> para habilitar la <strong>Ubicación</strong> ',
                            buttons: [{
                                    text: 'IR A LA CONFIGURACIÓN',
                                    handler: function () {
                                        _this.diagnostic.switchToLocationSettings();
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UtilsService.prototype.gpsOntAlert = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            backdropDismiss: false,
                            header: 'Datos Inhabilitado',
                            message: 'Vaya a <strong>Configuración</strong> para habilitar los <strong>Datos moviles</strong> ',
                            buttons: [{
                                    text: 'IR A LA CONFIGURACIÓN',
                                    handler: function () {
                                        _this.diagnostic.switchToMobileDataSettings();
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UtilsService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Diagnostic,
            AlertController,
            Network,
            Platform,
            ToastController])
    ], UtilsService);
    return UtilsService;
}());
export { UtilsService };
//# sourceMappingURL=utils.service.js.map