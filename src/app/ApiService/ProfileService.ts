import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../Models/Profile';
import { staff } from '../Models/Staff';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<staff> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<staff>('https://localhost:7216/api/Profile', { headers });
}



  updateProfile(request: Profile): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put('/api/profile', request, { headers });
}

}
