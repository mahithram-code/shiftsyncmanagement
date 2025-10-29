import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shift } from '../Models/Shift';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private api = '/api/timetable';

  constructor(private http: HttpClient) {}

  getAll(): Observable<shift[]> {
    return this.http.get<shift[]>(this.api);
  }

  create(payload: any) {
    return this.http.post(this.api, payload);
  }

  update(shift: any) {
    return this.http.put(`${this.api}/${shift.id}`, shift);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  getMine(): Observable<shift[]> {
    return this.http.get<shift[]>(`${this.api}/me`);
  }
}
