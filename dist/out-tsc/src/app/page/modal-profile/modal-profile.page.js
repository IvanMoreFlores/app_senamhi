import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
var ModalProfilePage = /** @class */ (function () {
    function ModalProfilePage(modalController, alertController) {
        this.modalController = modalController;
        this.alertController = alertController;
    }
    ModalProfilePage.prototype.ngOnInit = function () {
    };
    ModalProfilePage.prototype.close_modal = function () {
        this.modalController.dismiss();
    };
    ModalProfilePage.prototype.AlertCerrarSession = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            backdropDismiss: false,
                            header: 'Cerrar sesión',
                            message: 'Desea <strong>Cerrar sesión</strong>?',
                            buttons: [
                                {
                                    text: 'NO',
                                    role: 'cancel',
                                    handler: function (blah) {
                                        console.log('Confirm Cancel: blah');
                                    }
                                }, {
                                    text: 'SI',
                                    handler: function () {
                                        console.log('Confirm Okay');
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
    ModalProfilePage = tslib_1.__decorate([
        Component({
            selector: 'app-modal-profile',
            templateUrl: './modal-profile.page.html',
            styleUrls: ['./modal-profile.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            AlertController])
    ], ModalProfilePage);
    return ModalProfilePage;
}());
export { ModalProfilePage };
//# sourceMappingURL=modal-profile.page.js.map