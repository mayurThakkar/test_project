import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap(event => {
      if (event.type === 4 && event.status >= 200 && event.status < 300) {
        if (req.url.includes('/api/login')) {
          notificationService.showSuccess('Login successful! Welcome back.');
        }
      }
    }),
    catchError(error => {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status) {
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please login again.';
            break;
          case 403:
            errorMessage = 'Access denied. You don\'t have permission.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
        }
      }

      notificationService.showError(errorMessage);

      return throwError(() => error);
    })
  );
};