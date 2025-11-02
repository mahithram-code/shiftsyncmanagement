// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';

// // A simple (and insecure) way to get the user's role.
// // In a real app, you should decode your JWT or use an AuthService.
// const getUserRole = (): string | null => {
//   return localStorage.getItem('userRole'); // Assuming you save the role on login
// };

// export const adminGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const role = getUserRole();

//   if (role === 'Admin') {
//     // User is an Admin, allow access
//     return true;
//   } else {
//     // User is logged in but NOT an admin, redirect
//     console.log('AdminGuard: User is not admin, redirecting.');
//     // Redirect to a 'forbidden' page or their own dashboard
//     router.navigate(['/staff/staff-dashboard']); 
//     return false;
//   }
// };