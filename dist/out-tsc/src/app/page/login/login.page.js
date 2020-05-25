import * as tslib_1 from "tslib";
import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
// Modal
import { ModalRecoverPage } from '../modal-recover/modal-recover.page';
import { NetworkService } from '../../services/network.service';
import { UtilsService } from '../../services/utils.service';
var LoginPage = /** @class */ (function () {
    function LoginPage(networkService, renderer, fb, router, platform, modalController, utilsService) {
        this.networkService = networkService;
        this.renderer = renderer;
        this.fb = fb;
        this.router = router;
        this.platform = platform;
        this.modalController = modalController;
        this.utilsService = utilsService;
        this.type = 'password';
        this.icono = 'eye';
        this.data = {
            usuario: null,
            password: null
        };
        this.formularioUsuario = this.fb.group({
            usuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
            password: ['', [Validators.required]]
        });
    }
    LoginPage.prototype.ngOnInit = function () {
        // this.utilsService.gpsOn();
        console.log('[Home] OnInit');
        this.utilsService.gpsOn();
    };
    LoginPage.prototype.type_password = function () {
        if (this.type === 'text') {
            this.icono = 'eye';
            this.type = 'password';
        }
        else {
            this.icono = 'eye-off';
            this.type = 'text';
        }
    };
    LoginPage.prototype.login = function () {
        this.router.navigateByUrl('/home');
    };
    LoginPage.prototype.ModalRecover = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: ModalRecoverPage,
                            componentProps: { value: 123 },
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
    LoginPage = tslib_1.__decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.page.html',
            styleUrls: ['./login.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NetworkService,
            Renderer2,
            FormBuilder,
            Router,
            Platform,
            ModalController,
            UtilsService])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.page.js.map