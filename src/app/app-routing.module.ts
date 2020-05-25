import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', loadChildren: './page/splash/splash.module#SplashPageModule' },
  { path: 'login', loadChildren: './page/login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './page/home/home.module#HomePageModule' },
  { path: 'modal-birthday', loadChildren: './page/modal-birthday/modal-birthday.module#ModalBirthdayPageModule' },
  { path: 'modal-reset', loadChildren: './page/modal-reset/modal-reset.module#ModalResetPageModule' },
  { path: 'reset-password', loadChildren: './page/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'modal-recover', loadChildren: './page/modal-recover/modal-recover.module#ModalRecoverPageModule' },
  { path: 'modal-profile', loadChildren: './page/modal-profile/modal-profile.module#ModalProfilePageModule' },
  { path: 'modal-info', loadChildren: './page/modal-info/modal-info.module#ModalInfoPageModule' },
  { path: 'meteorologia/:id/:tipo', loadChildren: './page/meteorologia/meteorologia.module#MeteorologiaPageModule' },
  { path: 'hidrologia/:id/:tipo', loadChildren: './page/hidrologia/hidrologia.module#HidrologiaPageModule' },
  { path: 'medicion/:id/:id_hora/:id_tipo', loadChildren: './page/medicion/medicion.module#MedicionPageModule' },
  { path: 'incidencia/:id', loadChildren: './page/incidencia/incidencia.module#IncidenciaPageModule' },
  { path: 'meteoro/:id', loadChildren: './page/meteoro/meteoro.module#MeteoroPageModule' },
  { path: 'aforo/:id', loadChildren: './page/aforo/aforo.module#AforoPageModule' },
  { path: 'listar/:id/:tipo', loadChildren: './page/listar/listar.module#ListarPageModule' },
  { path: 'listar-detalle/:id/:tipo', loadChildren: './page/listar-detalle/listar-detalle.module#ListarDetallePageModule' },
  { path: 'reenviar/:id/:tipo', loadChildren: './page/reenviar/reenviar.module#ReenviarPageModule' },
  { path: 'reenviar-detalle/:id/:tipo', loadChildren: './page/reenviar-detalle/reenviar-detalle.module#ReenviarDetallePageModule' },
  { path: 'libreta/:id/:tipo', loadChildren: './page/libreta/libreta.module#LibretaPageModule' },  { path: 'receptor-home', loadChildren: './page/receptor-home/receptor-home.module#ReceptorHomePageModule' },

  // { path: 'modal-resumen', loadChildren: './page/modal-resumen/modal-resumen.module#ModalResumenPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
