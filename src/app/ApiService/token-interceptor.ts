import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  const isLocalApi = req.url.startsWith('/api') || req.url.startsWith('https://localhost:7216');

  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (token && isLocalApi && !isAuthEndpoint) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
