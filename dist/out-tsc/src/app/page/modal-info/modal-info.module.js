import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalInfoPage } from './modal-info.page';
var routes = [
    {
        path: '',
        component: ModalInfoPage
    }
];
var ModalInfoPageModule = /** @class */ (function () {
    function ModalInfoPageModule() {
    }
    ModalInfoPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ModalInfoPage]
        })
    ], ModalInfoPageModule);
    return ModalInfoPageModule;
}());
export { ModalInfoPageModule };
//# sourceMappingURL=modal-info.module.js.map