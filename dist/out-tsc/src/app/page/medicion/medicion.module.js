import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MedicionPage } from './medicion.page';
var routes = [
    {
        path: '',
        component: MedicionPage
    }
];
var MedicionPageModule = /** @class */ (function () {
    function MedicionPageModule() {
    }
    MedicionPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MedicionPage]
        })
    ], MedicionPageModule);
    return MedicionPageModule;
}());
export { MedicionPageModule };
//# sourceMappingURL=medicion.module.js.map