import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data?.['roles'] as string[]) || [];

  if (auth.hasRole(roles)) {
    return true;
  }

  // Show alert and redirect
  alert('You cannot access this page. Only Sales and Manager have access to leads.');
  router.navigate(['/dashboard']);
  return false;
};