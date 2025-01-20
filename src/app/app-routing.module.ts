import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa tu guard

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'consoles',
    loadChildren: () => import('./products/consoles/consoles.module').then( m => m.ConsolesPageModule)
  },
  {
    path: 'games',
    loadChildren: () => import('./products/games/games.module').then( m => m.GamesPageModule)
  },
  {
    path: 'controllers',
    loadChildren: () => import('./products/controllers/controllers.module').then( m => m.ControllersPageModule)
  },
  {
    path: 'allproducts',
    loadChildren: () => import('./products/allproducts/allproducts.module').then( m => m.AllproductsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard], // Proteger con el guard
  },
  {
    path: 'changedata',
    loadChildren: () => import('./pages/changedata/changedata.module').then(m => m.ChangedataPageModule),
    canActivate: [AuthGuard], // Proteger con el guard
  },
  {
    path: 'changepassword',
    loadChildren: () => import('./pages/changepassword/changepassword.module').then(m => m.ChangepasswordPageModule),
    canActivate: [AuthGuard], // Proteger con el guard
  },
  {
    path: 'addproduct',
    loadChildren: () => import('./products/addproduct/addproduct.module').then(m => m.AddProductPageModule),
  },  {
    path: 'editproducts',
    loadChildren: () => import('./products/editproducts/editproducts.module').then( m => m.EditproductsPageModule)
  },





  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }