import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

const redirectIfAuthenticated = () => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) {
    return import('@angular/router').then(({ Router }) => inject(Router).createUrlTree(['/']));
  }
  return true;
};

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../auth/login/login').then((m) => m.Login),
    canActivate: [redirectIfAuthenticated],
  },
  {
    path: 'register',
    loadComponent: () => import('../auth/register/register').then((m) => m.Register),
    canActivate: [redirectIfAuthenticated],
  },
];
