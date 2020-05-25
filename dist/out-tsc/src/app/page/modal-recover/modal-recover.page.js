import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
var ModalRecoverPage = /** @class */ (function () {
    function ModalRecoverPage(modalController, alertController, renderer, router) {
        var _this = this;
        this.modalController = modalController;
        this.alertController = alertController;
        this.renderer = renderer;
        this.router = router;
        window.addEventListener('keyboardDidHide', function () {
            _this.renderer.removeClass(_this.tab.nativeElement, 'hide');
        });
        window.addEventListener('keyboardDidShow', function (event) {
            _this.renderer.addClass(_this.tab.nativeElement, 'hide');
        });
    }
    ModalRecoverPage.prototype.ngOnInit = function () {
        var _this = this;
        console.log('ionViewDidLoad');
        setTimeout(function () {
            _this.sInput.setFocus();
        }, 500);
    };
    ModalRecoverPage.prototype.close_modal = function () {
        this.modalController.dismiss();
    };
    ModalRecoverPage.prototype.ngAfterViewInit = function () {
        this.tabEl = this.tab.nativeElement;
    };
    tslib_1.__decorate([
        ViewChild('searchInput'),
        tslib_1.__metadata("design:type", Object)
    ], ModalRecoverPage.prototype, "sInput", void 0);
    tslib_1.__decorate([
        ViewChild('tab', { read: ElementRef }),
        tslib_1.__metadata("design:type", ElementRef)
    ], ModalRecoverPage.prototype, "tab", void 0);
    ModalRecoverPage = tslib_1.__decorate([
        Component({
            selector: 'app-modal-recover',
            templateUrl: './modal-recover.page.html',
            styleUrls: ['./modal-recover.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            AlertController,
            Renderer2,
            Router])
    ], ModalRecoverPage);
    return ModalRecoverPage;
}());
export { ModalRecoverPage };
//# sourceMappingURL=modal-recover.page.js.map