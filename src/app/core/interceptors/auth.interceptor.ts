import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const cloned = req.clone({ withCredentials: true });

  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 401) {
        const isAuthApi = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/me');

        if (!isAuthApi) {
          auth.setUser(null);
          if (!router.url.includes('/auth/login')) {
            router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
          }
        }
      }
      return throwError(() => err);
    }),
  );
};
