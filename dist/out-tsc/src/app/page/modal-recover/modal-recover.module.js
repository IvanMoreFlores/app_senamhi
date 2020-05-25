import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalRecoverPage } from './modal-recover.page';
var routes = [
    {
        path: '',
        component: ModalRecoverPage
    }
];
var ModalRecoverPageModule = /** @class */ (function () {
    function ModalRecoverPageModule() {
    }
    ModalRecoverPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ModalRecoverPage]
        })
    ], ModalRecoverPageModule);
    return ModalRecoverPageModule;
}());
export { ModalRecoverPageModule };
//# sourceMappingURL=modal-recover.module.js.map