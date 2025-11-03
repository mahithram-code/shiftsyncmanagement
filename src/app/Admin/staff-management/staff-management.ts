// src/app/Admin/staff-management/staff-management.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { StaffService, Staff } from '../../ApiService/StaffService'; 
import { RouterModule } from '@angular/router';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './staff-management.html'
})
export class StaffManagementComponent implements OnInit {
  staffs: Staff[] = []; 
  staffForm: FormGroup;
  selectedStaffId: number | null = null;
  toastMessage: string = '';

  @ViewChild('staffToast', { static: false }) staffToast!: ElementRef;

  constructor(private fb: FormBuilder, private staffSvc: StaffService) {
    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
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
      const payload = this.staffForm.value;
      const name = payload.name;

      if (this.selectedStaffId === null) {
        this.staffSvc.add(payload).subscribe({
          next: (newStaff) => {
            this.staffs.push(newStaff);
            this.staffForm.reset({ securityRole: 'User' });
            this.showToast(`${name} is added successfully!`);
          },
          error: (err) => {
            console.error('Failed to add staff:', err.error);
            alert(err.error || 'Failed to add staff member.');
          }
        });
      } else {
        this.staffSvc.update(this.selectedStaffId, payload).subscribe({
          next: (updatedStaff) => {
            const index = this.staffs.findIndex(s => s.id === this.selectedStaffId);
            if (index !== -1) this.staffs[index] = updatedStaff;
            this.staffForm.reset({ securityRole: 'User' });
            this.selectedStaffId = null;
            this.showToast(`${name} is updated successfully!`);
          },
          error: (err) => {
            console.error('Failed to update staff:', err.error);
            alert(err.error || 'Failed to update staff member.');
          }
        });
      }
    }
  }

  selectStaffForEdit(staff: Staff) {
    this.selectedStaffId = staff.id;
    this.staffForm.patchValue({
      name: staff.name,
      username: staff.username,
      jobRole: staff.jobRole,
      department: staff.department,
      securityRole: staff.securityRole,
      password: ''
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

  showToast(message: string) {
    this.toastMessage = message;
    const toast = new Toast(this.staffToast.nativeElement);
    toast.show();
  }
}
