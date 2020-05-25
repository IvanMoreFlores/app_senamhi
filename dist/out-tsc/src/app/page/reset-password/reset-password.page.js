import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
var ResetPasswordPage = /** @class */ (function () {
    function ResetPasswordPage(platform, navCtrl, alertController, renderer, router) {
        var _this = this;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.renderer = renderer;
        this.router = router;
        this.n_password = '';
        this.c_password = '';
        this.btn_pass = false;
        window.addEventListener('keyboardDidHide', function () {
            _this.renderer.removeClass(_this.tab.nativeElement, 'hide');
        });
        window.addEventListener('keyboardDidShow', function (event) {
            _this.renderer.addClass(_this.tab.nativeElement, 'hide');
        });
    }
    ResetPasswordPage.prototype.ngOnInit = function () {
        var _this = this;
        console.log('ionViewDidLoad');
        setTimeout(function () {
            _this.sInput.setFocus();
        }, 500);
    };
    ResetPasswordPage.prototype.ngAfterViewInit = function () {
        this.tabEl = this.tab.nativeElement;
    };
    ResetPasswordPage.prototype.ConfirmarAlert = function (Rheader, RsubHeader, Rmessage) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            backdropDismiss: false,
                            header: Rheader,
                            subHeader: RsubHeader,
                            message: Rmessage,
                            buttons: ['OK']
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
    ResetPasswordPage.prototype.clickReset = function () {
        if (this.n_password === null || this.n_password === '') {
            this.ConfirmarAlert('Error', 'Dato incompleto', 'El campo nueva contraseña esta vacío');
            return false;
        }
        if (this.c_password === null || this.c_password === '') {
            this.ConfirmarAlert('Error', 'Dato incompleto', 'El campo confirmar contraseña esta vacío');
            return false;
        }
        if (this.n_password !== this.c_password) {
            this.ConfirmarAlert('Error', 'Datos erroneos', 'Los campos no coinciden');
            return false;
        }
        if (this.n_password.length < 8) {
            this.ConfirmarAlert('Error', 'Formato erroneo', 'Contraseña minimo 8 caracteres y maximo 12 caracteres');
            return false;
        }
        if (this.n_password.length > 12) {
            this.ConfirmarAlert('Error', 'Formato erroneo', 'Contraseña minimo 8 caracteres y maximo 12 caracteres');
            return false;
        }
        else {
            this.router.navigateByUrl('/home');
        }
    };
    tslib_1.__decorate([
        ViewChild('searchInput'),
        tslib_1.__metadata("design:type", Object)
    ], ResetPasswordPage.prototype, "sInput", void 0);
    tslib_1.__decorate([
        ViewChild('tab', { read: ElementRef }),
        tslib_1.__metadata("design:type", ElementRef)
    ], ResetPasswordPage.prototype, "tab", void 0);
    ResetPasswordPage = tslib_1.__decorate([
        Component({
            selector: 'app-reset-password',
            templateUrl: './reset-password.page.html',
            styleUrls: ['./reset-password.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            NavController,
            AlertController,
            Renderer2,
            Router])
    ], ResetPasswordPage);
    return ResetPasswordPage;
}());
export { ResetPasswordPage };
//# sourceMappingURL=reset-password.page.js.map