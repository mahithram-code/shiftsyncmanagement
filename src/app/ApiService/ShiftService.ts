import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shift } from '../Models/Shift';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  constructor(private http: HttpClient) {}

  getMyShifts(): Observable<shift[]> {
    return this.http.get<shift[]>('https://localhost:7216/api/shifts/my');
  }
}
