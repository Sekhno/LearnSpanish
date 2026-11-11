import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'numbers',
        loadComponent: () => import('./numbers/numbers.component').then(m => m.NumbersComponent)
      },
      {
        path: 'shopping',
        loadComponent: () => import('./shopping/shopping.component').then(m => m.ShoppingComponent)
      },
      { path: '', redirectTo: 'numbers', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
