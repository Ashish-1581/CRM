import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
  { path: 'leads', loadComponent: () => import('./components/leads/lead-list/lead-list.component').then(m => m.LeadListComponent), canActivate: [AuthGuard, RoleGuard], data: { roles: ['sales','manager'] } },
  { path: 'leads/new', loadComponent: () => import('./components/leads/lead-form/lead-form.component').then(m => m.LeadFormComponent), canActivate: [AuthGuard, RoleGuard], data: { roles: ['sales','manager'] } },
  { path: 'leads/:id', loadComponent: () => import('./components/leads/lead-detail/lead-detail.component').then(m => m.LeadDetailComponent), canActivate: [AuthGuard] },
  { path: 'lead-view/:id', loadComponent: () => import('./components/leads/lead-view/lead-view').then(m => m.LeadView), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
