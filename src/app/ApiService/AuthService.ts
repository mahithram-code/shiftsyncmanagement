// // src/app/Services/auth.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private baseUrl = 'https://localhost:7216/api/Auth'; // Adjust to match your backend

//   constructor(private http: HttpClient) {}

//   login(credentials: { username: string; password: string }): Observable<any> {
//     return this.http.post(`${this.baseUrl}/login`, credentials);
//   }
// }

// src/app/Services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:7216/api/Auth';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
  return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
    tap((res: any) => {
      if (res && res.token) {
        localStorage.setItem('authToken', res.token); // ✅ Must match interceptor
 // Store token for future requests
      }
    })
  );
}


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload['role'];
      return Array.isArray(roles) ? roles : [roles];
    } catch {
      return [];
    }
  }
}

