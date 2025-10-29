import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './staff-profile.html'
})
export class StaffProfileComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['Dr. Priya', Validators.required],
      email: ['priya@example.com', [Validators.required, Validators.email]],
      department: ['General', Validators.required],
      phone: ['', Validators.pattern(/^[0-9]{10}$/)]
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      console.log('Updated profile:', this.profileForm.value);
      alert('Profile updated successfully!');
    }
  }
}
