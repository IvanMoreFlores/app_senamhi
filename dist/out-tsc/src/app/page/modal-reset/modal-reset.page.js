import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
var ModalResetPage = /** @class */ (function () {
    function ModalResetPage(router, modalController) {
        this.router = router;
        this.modalController = modalController;
    }
    ModalResetPage.prototype.ngOnInit = function () {
    };
    ModalResetPage.prototype.PageReset = function () {
        this.modalController.dismiss();
        this.router.navigateByUrl('/reset-password');
    };
    ModalResetPage = tslib_1.__decorate([
        Component({
            selector: 'app-modal-reset',
            templateUrl: './modal-reset.page.html',
            styleUrls: ['./modal-reset.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router,
            ModalController])
    ], ModalResetPage);
    return ModalResetPage;
}());
export { ModalResetPage };
//# sourceMappingURL=modal-reset.page.js.map