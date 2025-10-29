import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


export class StaffManagementComponent {
  staffForm: FormGroup;
  staffs: { id: number; name: string; email: string; department: string }[] = [];
  nextId = 1;

  constructor(private fb: FormBuilder) {
    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required]
    });
  }

  addStaff() {
    if (this.staffForm.valid) {
      const newStaff = { id: this.nextId++, ...this.staffForm.value };
      this.staffs.push(newStaff);
      this.staffForm.reset({ department: '' });
    }
  }

  edit(staff: any) {
    this.staffForm.patchValue(staff);
    this.delete(staff.id);
  }

  delete(id: number) {
    this.staffs = this.staffs.filter(s => s.id !== id);
  }
}
