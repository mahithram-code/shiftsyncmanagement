import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shift } from '../Models/Shift';

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private baseUrl = 'https://localhost:7216/api/schedule';

  constructor(private http: HttpClient) {}

  // ✅ Get all shifts (Admin view)
  getAll(): Observable<shift[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  // FIX: Use the baseUrl to call the .NET backend, not the Angular server
  return this.http.get<shift[]>(`${this.baseUrl}?date=${today}`, { headers });
}



  // ✅ Assign a new shift
  create(payload: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/assign`, payload, { headers });
  }

  // ✅ Update an existing shift
  update(shift: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/${shift.id}`, shift, { headers });
  }

  // ✅ Delete a shift
  delete(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  // ✅ Get shifts for the logged-in staff (if needed)
  getMine(): Observable<shift[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<shift[]>(`${this.baseUrl}/me`, { headers });
  }

  // ✅ Alternate endpoint for staff-specific shifts
  getMyShifts(): Observable<shift[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<shift[]>('https://localhost:7216/api/Schedule/assign', { headers });
  }
}
