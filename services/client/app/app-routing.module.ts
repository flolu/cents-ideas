import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopLevelFrontendRoutes } from '@centsideas/enums';

const routes: Routes = [
  {
    path: TopLevelFrontendRoutes.Login,
    loadChildren: () => import('../features/login/login.module').then(m => m.LoginModule),
  },
  {
    path: TopLevelFrontendRoutes.Ideas,
    loadChildren: () => import('./ideas/ideas.module').then(m => m.IdeasModule),
  },
  {
    path: TopLevelFrontendRoutes.User,
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  },
  { path: '**', redirectTo: TopLevelFrontendRoutes.Ideas, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
