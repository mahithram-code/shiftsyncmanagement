import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports:  [CommonModule, RouterModule],
  templateUrl: './staff-dashboard.html'
})
export class StaffDashboardComponent implements OnInit {
  staffName = 'Dr. Priya';
  shifts = [
    { day: 'Day 1', role: 'Doctor', shiftType: 'Day Shift' },
    { day: 'Day 2', role: 'Doctor', shiftType: 'Night Shift' },
    { day: 'Day 3', role: 'Doctor', shiftType: 'Day Shift' }
  ];

  ngOnInit() {
    // you can replace with API call later
  }
  
}
