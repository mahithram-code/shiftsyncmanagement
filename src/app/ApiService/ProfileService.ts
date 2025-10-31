import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../Models/Profile';
import { staff } from '../Models/Staff';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<staff> {
    return this.http.get<staff>('/api/profile');
  }

  updateProfile(request: Profile): Observable<staff> {
    return this.http.put<staff>('/api/profile', request);
  }
}
