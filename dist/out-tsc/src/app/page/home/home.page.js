import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
// Modal
import { ModalProfilePage } from '../modal-profile/modal-profile.page';
import { ModalInfoPage } from '../modal-info/modal-info.page';
import { ModalBirthdayPage } from '../modal-birthday/modal-birthday.page';
import { ModalResetPage } from '../modal-reset/modal-reset.page';
var HomePage = /** @class */ (function () {
    function HomePage(modalController, router, 
    // private sms: SMS,
    navCtrl, platform, toastCtrl) {
        this.modalController = modalController;
        this.router = router;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.toastCtrl = toastCtrl;
        this.mySMS = [];
        this.platform.ready().then(function () {
            if (SMS) {
                SMS.startWatch(function (ListSms) {
                    console.log('watching', 'watching started');
                }, function (error) {
                    console.log('failed to start watching');
                });
            }
        });
    }
    HomePage.prototype.ngOnInit = function () {
        var _this = this;
        this.listMessage();
        // this.ModalBirthday();
        // this.ModalReset();
        // this.ReadListSMS();
        // this.ExpectingSMS();
        document.addEventListener('onSMSArrive', function (ListSms) {
            _this.listMessage();
        });
    };
    HomePage.prototype.ModalBirthday = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: ModalBirthdayPage,
                            componentProps: { value: 123 },
                            backdropDismiss: false,
                            cssClass: 'modal-birthday-css'
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomePage.prototype.ModalReset = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: ModalResetPage,
                            componentProps: { value: 123 },
                            backdropDismiss: false,
                            cssClass: 'modal-birthday-css'
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomePage.prototype.ModalUser = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: ModalProfilePage,
                            componentProps: { value: 123 }
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomePage.prototype.ModalInfo = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: ModalInfoPage,
                            componentProps: { value: 123 }
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomePage.prototype.PageMeteorologia = function () {
        this.router.navigateByUrl('/meteorologia');
    };
    HomePage.prototype.PageHidrologia = function () {
        this.router.navigateByUrl('/hidrologia');
    };
    HomePage.prototype.send = function () {
        var _this = this;
        var obj;
        obj = {
            name: 'John',
            age: 30,
            city: 'New York',
            contactPerson: {
                name: 'Ivan',
                cellphone: {
                    name: 'Ivan',
                    cellphone: 990391969
                }
            }
        };
        console.log('JSON', JSON.stringify(obj));
        obj = JSON.stringify(obj);
        obj = obj.replace(/}/g, ')');
        obj = obj.replace(/{/g, '(');
        console.log(obj.length);
        console.log(obj);
        if (SMS) {
            SMS.sendSMS(['968169082', '990391969'], obj, function (ListSms) {
                console.log(ListSms);
                _this.presentToast('Mensaje enviado exitosamente');
            }, function (error) {
                console.log(error);
                _this.presentToast('Fracaso el enviado del mensaje');
            });
        }
    };
    HomePage.prototype.presentToast = function (Message) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastCtrl.create({
                            message: Message,
                            duration: 3000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.deleteMessage = function (id) {
        var _this = this;
        console.log(id);
        var filter = {
            box: 'inbox',
            // the following 4 filters are OR relationship
            _id: id,
        };
        if (SMS) {
            SMS.deleteSMS(filter, function (ListSms) {
                _this.presentToast('Mensaje eliminado exitosamente');
                _this.listMessage();
            }, function (Error) {
                _this.presentToast('Error al eliminar mensaje');
                _this.listMessage();
            });
        }
    };
    HomePage.prototype.listMessage = function () {
        var _this = this;
        this.mySMS = [];
        this.platform.ready().then(function (readySource) {
            var primer;
            var filter = {
                box: 'inbox',
                indexFrom: 0,
                maxCount: 30,
            };
            if (SMS) {
                SMS.listSMS(filter, function (ListSms) {
                    ListSms.forEach(function (element) {
                        if (element.body.charAt(0) === '(') {
                            primer = element.body;
                            primer = primer.replace(/([(])/g, '{');
                            primer = primer.replace(/([)])/g, '}');
                            primer = primer.trim();
                            primer = primer.replace(/(\w+:)|(\w+ :)/g, function (matchedStr) {
                                return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
                            });
                            primer = JSON.parse(primer);
                            primer.address = element.address;
                            primer._id = element._id;
                            _this.mySMS.push(primer);
                        }
                        else {
                        }
                    });
                    console.log(ListSms);
                    console.log(_this.mySMS);
                }, function (Error) {
                    console.log('error list sms: ' + Error);
                });
            }
        });
    };
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: './home.page.html',
            styleUrls: ['./home.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            Router,
            NavController,
            Platform,
            ToastController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map