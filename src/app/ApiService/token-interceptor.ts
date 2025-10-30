import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');

  // FIX: This check was excluding relative paths (like /api/staff).
  // We should attach the token if:
  // 1. The request has a token, AND
  // 2. The request is for a relative path (starts with '/') OR the local base URL.
  
  // A request starting with '/' indicates a local API call.
  const isLocalApi = req.url.startsWith('/api') || req.url.startsWith('https://localhost:7216');

  if (token && isLocalApi) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` 
      }
    });
    return next(authReq);
  }

  // Pass the request through unmodified (no token or external URL).
  return next(req);
};