import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'user',
    canActivate : [authGuard],
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'admin',
    canActivate : [authGuard],
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  { path : '',pathMatch : 'full', redirectTo : 'login'},
  { path: '**', pathMatch: 'full', component : PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
