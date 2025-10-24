import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./feature/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./feature/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'list',
    canActivate: [authGuard],
   loadComponent: () => import('./feature/components/list/item-list.component').then(m => m.ItemsListComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];