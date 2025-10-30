// src/app/ApiService/StaffService.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for the Staff entity received from the API (read operations)
export interface Staff {
  id: number;
  name: string;
  username: string;
  jobRole: string;
  department: string;
  securityRole: string; 
}

// FIX: Add 'password' and 'securityRole' back to the AddStaffRequest payload
export interface AddStaffRequest extends Omit<Staff, 'id'> {
  password: string; // REQUIRED for backend hashing
  securityRole: string; // REQUIRED for backend role assignment
}

@Injectable({ providedIn: 'root' })
export class StaffService {
  // FIX: Use the absolute URL, matching your AuthService
  private api = 'https://localhost:7216/api/staff'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.api);
  }

  // Uses the fixed AddStaffRequest type for the payload
  add(staffData: AddStaffRequest): Observable<Staff> {
    return this.http.post<Staff>(this.api, staffData);
  }

  update(id: number, staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(`${this.api}/${id}`, staff);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}