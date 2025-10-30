// src/app/Services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStatsDto {
  totalStaff: number;
  totalShiftsToday: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'https://localhost:7216/api/Dashboard/stats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStatsDto> {
    return this.http.get<DashboardStatsDto>(`${this.baseUrl}/stats`);
  }
}
