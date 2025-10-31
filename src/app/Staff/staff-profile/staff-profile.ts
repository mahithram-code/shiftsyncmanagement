import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ProfileService } from '../../ApiService/ProfileService';
import { staff } from '../../Models/Staff';
import { Profile } from '../../Models/Profile';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './staff-profile.html'
})
export class StaffProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private profileSvc: ProfileService) {
    this.profileForm = this.fb.group({
  name: ['', Validators.required],
  username: ['', [Validators.required, Validators.email]],
  jobRole: ['', Validators.required],
  currentPassword: ['', Validators.required],
  newPassword: ['', Validators.required]
}, {
  validators: this.passwordMatchValidator
});

  }

  ngOnInit() {
    this.profileSvc.getProfile().subscribe({
      next: (data: staff) => {
        this.profileForm.patchValue({
          name: data.name,
          username: data.username,
          jobRole: data.jobRole
        });
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

  updateProfile() {
  console.log('Form submitted:', this.profileForm.value);
  if (this.profileForm.invalid) {
    console.warn('Form is invalid:', this.profileForm.errors);
    console.table(this.profileForm.value); // ✅ See what values are missing
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      console.log(`${key} → valid: ${control?.valid}, value: ${control?.value}`);
    });
    return;
  }

  const request: Profile = {
    name: this.profileForm.value.name,
    username: this.profileForm.value.username,
    jobRole: this.profileForm.value.jobRole,
    currentPassword: this.profileForm.value.currentPassword,
    newPassword: this.profileForm.value.newPassword
  };

  console.log('Sending request:', request); // ✅ Confirm payload

  this.profileSvc.updateProfile(request).subscribe({
    next: () => {
      alert('✅ Profile updated successfully!');
    },
    error: (err) => {
      console.error('Update failed:', err);
      if (err.status === 409) {
        alert('⚠️ Username already exists. Please choose another.');
      } else {
        alert(err?.error ?? '❌ Failed to update profile.');
      }
    }
  });
}


  private passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const currentPassword = group.get('currentPassword')?.value;
    const newPassword = group.get('newPassword')?.value;
    return currentPassword === newPassword ? null : { mismatch: true };
  }

}
