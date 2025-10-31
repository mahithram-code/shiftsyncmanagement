import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      jobRole: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.profileSvc.getProfile().subscribe({
      next: (data: staff) => {
        this.profileForm.patchValue({
          name: data.name,
          username: data.username
        });
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const request: Profile = this.profileForm.value;
      this.profileSvc.updateProfile(request).subscribe({
        next: () => alert('Profile updated successfully!'),
        error: (err) => alert(err?.error ?? 'Failed to update profile.')
      });
    }
  }
}
