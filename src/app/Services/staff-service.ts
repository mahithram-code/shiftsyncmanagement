import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { staff } from '../Models/Staff';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private api = '/api/staffs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<staff[]> {
    return this.http.get<staff[]>(this.api);
  }

  add(payload: Partial<staff>) {
    return this.http.post(this.api, payload);
  }

  update(s: staff) {
    return this.http.put(`${this.api}/${s.id}`, s);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
