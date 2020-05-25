import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
var ModalBirthdayPage = /** @class */ (function () {
    function ModalBirthdayPage(modalController) {
        this.modalController = modalController;
    }
    ModalBirthdayPage.prototype.ngOnInit = function () {
    };
    ModalBirthdayPage.prototype.close_modal = function () {
        this.modalController.dismiss();
    };
    ModalBirthdayPage = tslib_1.__decorate([
        Component({
            selector: 'app-modal-birthday',
            templateUrl: './modal-birthday.page.html',
            styleUrls: ['./modal-birthday.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController])
    ], ModalBirthdayPage);
    return ModalBirthdayPage;
}());
export { ModalBirthdayPage };
//# sourceMappingURL=modal-birthday.page.js.map