import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('auth_token');
  
  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('auth_token');
  
  if (!token) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};