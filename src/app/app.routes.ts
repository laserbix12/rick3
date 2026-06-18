import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'search', loadComponent: () => import('./pages/search/search').then(m => m.Search) },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites').then(m => m.Favorites) },
  { path: 'details/:id', loadComponent: () => import('./pages/details/details').then(m => m.Details) },
  { path: 'documentation', loadComponent: () => import('./pages/documentation/documentation').then(m => m.DocumentationComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent) },
  { path: 'support', loadComponent: () => import('./pages/support/support').then(m => m.SupportComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) }
];
