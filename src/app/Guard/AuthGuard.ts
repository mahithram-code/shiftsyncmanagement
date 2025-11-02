// import { Injectable } from '@angular/core';
// import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     const token = localStorage.getItem('authToken');
//     const isLoginPage = state.url === '/login';

//     if (!token && !isLoginPage) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     return true;
//   }
// }
