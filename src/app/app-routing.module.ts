import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, hasCustomClaim, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['signin']);
const redirectLoggedInToApp = () => redirectLoggedInTo(['app/tabs/tab1']);

const routes: Routes = [
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then( (m) => m.SigninPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToApp },
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( (m) => m.SignupPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToApp },
  },
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
  {
    path: 'cal-modal',
    loadChildren: () => import('./cal-modal/cal-modal.module').then( m => m.CalModalPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'tab5',
    loadChildren: () => import('./tab5/tab5.module').then( m => m.Tab5PageModule)
  },
  {
    path: 'tab6',
    loadChildren: () => import('./tab6/tab6.module').then( m => m.Tab6PageModule)
  },
  {
    path: 'tab7',
    loadChildren: () => import('./tab7/tab7.module').then( m => m.Tab7PageModule)
  },
  {
    path: 'client-modal',
    loadChildren: () => import('./client-modal/client-modal.module').then( m => m.ClientModalPageModule)
  },
  {
    path: 'shift-modal',
    loadChildren: () => import('./shift-modal/shift-modal.module').then( m => m.ShiftModalPageModule)
  },
  {
    path: 'staff-modal',
    loadChildren: () => import('./staff-modal/staff-modal.module').then( m => m.StaffModalPageModule)
  },
  {
    path: 'request-change-modal',
    loadChildren: () => import('./request-change-modal/request-change-modal.module').then( m => m.RequestChangeModalPageModule)
  },
  // { path: '**', redirectTo: 'signin', pathMatch: 'full' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
