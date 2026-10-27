import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'san-pham',
    loadComponent: () => import('./pages/product/product').then((m) => m.ProductListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'danh-muc',
    loadComponent: () => import('./pages/cate/cate').then((m) => m.Cate),
    canActivate: [authGuard],
  },
  {
    path: 'custom-mau12',
    loadComponent: () => import('./pages/custom-mau12/custom-mau12').then((m) => m.CustomMau12),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
