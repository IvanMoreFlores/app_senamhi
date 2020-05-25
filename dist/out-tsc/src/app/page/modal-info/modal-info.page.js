import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
var ModalInfoPage = /** @class */ (function () {
    function ModalInfoPage(modalController) {
        this.modalController = modalController;
    }
    ModalInfoPage.prototype.ngOnInit = function () {
    };
    ModalInfoPage.prototype.close_modal = function () {
        this.modalController.dismiss();
    };
    ModalInfoPage = tslib_1.__decorate([
        Component({
            selector: 'app-modal-info',
            templateUrl: './modal-info.page.html',
            styleUrls: ['./modal-info.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController])
    ], ModalInfoPage);
    return ModalInfoPage;
}());
export { ModalInfoPage };
//# sourceMappingURL=modal-info.page.js.map