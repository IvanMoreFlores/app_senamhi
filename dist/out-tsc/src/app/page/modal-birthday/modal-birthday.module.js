import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalBirthdayPage } from './modal-birthday.page';
var routes = [
    {
        path: '',
        component: ModalBirthdayPage
    }
];
var ModalBirthdayPageModule = /** @class */ (function () {
    function ModalBirthdayPageModule() {
    }
    ModalBirthdayPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ModalBirthdayPage],
            exports: [
                ModalBirthdayPage
            ],
        })
    ], ModalBirthdayPageModule);
    return ModalBirthdayPageModule;
}());
export { ModalBirthdayPageModule };
//# sourceMappingURL=modal-birthday.module.js.map