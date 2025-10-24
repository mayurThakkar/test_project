import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  const requestKey = `${req.method}-${req.url}-${Date.now()}`;
  
  let loadingMessage = 'Loading...';
  
  if (req.url.includes('/api/login')) {
    loadingMessage = 'Signing in...';
  } else if (req.url.includes('/api/items')) {
    if (req.method === 'GET') {
      loadingMessage = 'Fetching items...';
    }
  }
  
  loadingService.setLoading(requestKey, loadingMessage);
  
  return next(req).pipe(
    finalize(() => {
      loadingService.clearLoading(requestKey);
    })
  );
};