import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalResetPage } from './modal-reset.page';
var routes = [
    {
        path: '',
        component: ModalResetPage
    }
];
var ModalResetPageModule = /** @class */ (function () {
    function ModalResetPageModule() {
    }
    ModalResetPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ModalResetPage]
        })
    ], ModalResetPageModule);
    return ModalResetPageModule;
}());
export { ModalResetPageModule };
//# sourceMappingURL=modal-reset.module.js.map