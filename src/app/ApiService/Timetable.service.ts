import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shift } from '../Models/Shift';

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private baseUrl = 'https://localhost:7216/api/schedule';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

 getAll(date?: string): Observable<shift[]> {
  const queryDate = date ?? new Date().toISOString().split('T')[0];
  return this.http.get<shift[]>(`${this.baseUrl}?date=${queryDate}`, {
    headers: this.getHeaders()
  });
}


  create(payload: { staffId: number; shiftDate: string; shiftType: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/assign`, payload, {
      headers: this.getHeaders()
    });
  }

  update(shift: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${shift.id}`, shift, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
