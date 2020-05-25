import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HidrologiaPage } from './hidrologia.page';
var routes = [
    {
        path: '',
        component: HidrologiaPage
    }
];
var HidrologiaPageModule = /** @class */ (function () {
    function HidrologiaPageModule() {
    }
    HidrologiaPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [HidrologiaPage]
        })
    ], HidrologiaPageModule);
    return HidrologiaPageModule;
}());
export { HidrologiaPageModule };
//# sourceMappingURL=hidrologia.module.js.map