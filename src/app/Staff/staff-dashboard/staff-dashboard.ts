import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ShiftService } from '../../ApiService/ShiftService';
import { shift } from '../../Models/Shift';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-dashboard.html'
})
export class StaffDashboardComponent implements OnInit {
  staffName = '';
  shifts: shift[] = [];

  constructor(private shiftSvc: ShiftService, private router: Router) {}

  ngOnInit() {
    this.shiftSvc.getMyShifts().subscribe({
      next: (data) => {
        this.shifts = data;
        if (data.length > 0) {
          this.staffName = data[0].staffName ?? '';
        }
      },
      error: (err) => {
        console.error('Failed to load shifts:', err);
      }
    });
  }

  logout() {
    localStorage.clear(); // or sessionStorage.clear() if you're using that
    this.router.navigate(['/']); // Redirect to login or landing page
  }
}
