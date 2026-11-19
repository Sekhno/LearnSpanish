import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'classic',
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
      {
        path: 'colors',
        loadComponent: () => import('./colors/colors.component').then(m => m.ColorsComponent)
      },
      {
        path: 'introduction',
        loadComponent: () => import('./introduction/introduction.component').then(m => m.IntroductionComponent)
      },
      {
        path: 'pronouns',
        loadComponent: () => import('./pronouns/pronouns.component').then(m => m.PronounsComponent)
      },
      { path: '', redirectTo: 'numbers', pathMatch: 'full' }
    ]
  },
  {
    path: 'learn',
    loadComponent: () => import('./learn/learn-layout.component').then(m => m.LearnLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./learn/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: ':lang',
        loadComponent: () => import('./learn/course/course.component').then(m => m.CourseComponent)
      },
      {
        path: ':lang/lesson/:id',
        loadComponent: () => import('./learn/lesson/lesson.component').then(m => m.LessonComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
