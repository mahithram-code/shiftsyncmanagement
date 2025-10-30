// src/app/Admin/staff-management/staff-management.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { StaffService, Staff } from '../../ApiService/StaffService'; 
// Observable import is no longer strictly necessary but can be kept

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './staff-management.html'
})
export class StaffManagementComponent implements OnInit {
  staffs: Staff[] = []; 
  staffForm: FormGroup;
  
  constructor(private fb: FormBuilder, private staffSvc: StaffService) {
    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      // FIX: Password and SecurityRole re-added to the form
      password: ['', Validators.required], 
      jobRole: ['', Validators.required],
      department: ['', Validators.required],
      securityRole: ['User', Validators.required] 
    });
  }

  ngOnInit() {
    this.loadStaffs();
  }
  
  loadStaffs() {
    this.staffSvc.getAll().subscribe({
      next: (data) => {
        this.staffs = data;
      },
      error: (err) => {
        console.error('Failed to load staff list. Check if admin token is present.', err);
      }
    });
  }

  addStaff() {
    if (this.staffForm.valid) {
      // The form.value now correctly matches the AddStaffRequest payload
      this.staffSvc.add(this.staffForm.value).subscribe({
        next: (newStaff) => {
          this.staffs.push(newStaff);
          this.staffForm.reset({ securityRole: 'User' }); // Reset with default role
        },
        error: (err) => {
          console.error('Failed to add staff:', err.error);
          alert(err.error || 'Failed to add staff member.');
        }
      });
    }
  }

  selectStaffForEdit(staff: Staff) {
    console.log('Editing staff:', staff);
    alert('Edit feature coming soon! Now patching form values.');
    
    this.staffForm.patchValue({
      name: staff.name,
      username: staff.username,
      jobRole: staff.jobRole,
      department: staff.department,
      // FIX: securityRole re-added for patching
      securityRole: staff.securityRole,
      password: '' // Keep password blank when patching
    });
  }

  delete(id: number) {
    this.staffSvc.delete(id).subscribe({
      next: () => {
        this.staffs = this.staffs.filter(s => s.id !== id);
      },
      error: (err) => {
        console.error('Failed to delete staff:', err.error);
        alert(err.error || 'Failed to delete staff member. Check if they are the default admin.');
      }
    });
  }
}