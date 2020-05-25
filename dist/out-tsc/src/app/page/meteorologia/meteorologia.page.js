import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
var MeteorologiaPage = /** @class */ (function () {
    function MeteorologiaPage(router) {
        this.router = router;
        this.div_opciones = true;
        this.div_horarios = false;
    }
    MeteorologiaPage.prototype.ngOnInit = function () {
    };
    MeteorologiaPage.prototype.click_horario = function () {
        this.div_opciones = !this.div_opciones;
        this.div_horarios = !this.div_horarios;
    };
    MeteorologiaPage.prototype.click_regresar = function () {
        this.div_opciones = !this.div_opciones;
        this.div_horarios = !this.div_horarios;
    };
    MeteorologiaPage.prototype.PageMedicion = function () {
        this.router.navigateByUrl('/medicion');
    };
    MeteorologiaPage = tslib_1.__decorate([
        Component({
            selector: 'app-meteorologia',
            templateUrl: './meteorologia.page.html',
            styleUrls: ['./meteorologia.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router])
    ], MeteorologiaPage);
    return MeteorologiaPage;
}());
export { MeteorologiaPage };
//# sourceMappingURL=meteorologia.page.js.map