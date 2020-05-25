import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MeteorologiaPage } from './meteorologia.page';
var routes = [
    {
        path: '',
        component: MeteorologiaPage
    }
];
var MeteorologiaPageModule = /** @class */ (function () {
    function MeteorologiaPageModule() {
    }
    MeteorologiaPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MeteorologiaPage]
        })
    ], MeteorologiaPageModule);
    return MeteorologiaPageModule;
}());
export { MeteorologiaPageModule };
//# sourceMappingURL=meteorologia.module.js.map