import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'collections', loadComponent: () => import('./pages/collections/collections.component').then(m => m.CollectionsComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'support', loadComponent: () => import('./pages/support/support.component').then(m => m.SupportComponent) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'checkout', 
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent) 
  },
  { 
    path: 'order-success/:id', 
    canActivate: [authGuard],
    loadComponent: () => import('./pages/order-success/order-success.component').then(m => m.OrderSuccessComponent) 
  },
  { 
    path: 'profile', 
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) 
  },
  { 
    path: 'admin', 
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) 
  },
  { path: '**', redirectTo: '' }
];
