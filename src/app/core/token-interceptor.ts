import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken'); // ✅ Match your storage key

  // Skip attaching token for external URLs
  if (!req.url.startsWith('https://localhost:7216')) {
    return next(req);
  }

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // ✅ Correct syntax
        }
      })
    : req;

  return next(authReq);
};
