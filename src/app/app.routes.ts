import { Routes } from '@angular/router';
import { HomeComponent } from './Heropage/homepage/homepage';
import { LoginComponent } from './login/login';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard';
import { StaffManagementComponent } from './Admin/staff-management/staff-management';
import { TimetableComponent } from './Admin/time-table/time-table';
import { StaffDashboardComponent } from './Staff/staff-dashboard/staff-dashboard';
import { StaffProfileComponent } from './Staff/staff-profile/staff-profile';

export const routes: Routes = [
  // Public area
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'staff/staff-dashboard', component: StaffDashboardComponent },
  { path: 'staff/profile', component: StaffProfileComponent },
  // Admin area
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/staff-management', component: StaffManagementComponent },
  { path: 'admin/timetable', component: TimetableComponent },

  // Fallback route
  { path: '**', redirectTo: '' }
];
