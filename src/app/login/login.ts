// Import necessary Angular core and form modules
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/AuthService';

// Define the component metadata
@Component({
  selector: 'app-login', // Component selector used in templates
  standalone: true, // Enables standalone component usage
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Required modules for template and form functionality
  templateUrl: './login.html' // External HTML template for the component
})
export class LoginComponent {
  // Define the login form group
  loginForm: FormGroup;

  // Inject FormBuilder and Router services
  constructor(private fb: FormBuilder, private router: Router,private authSvc: AuthService) {
    // Initialize the form with controls and validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Username field with required validation
      password: ['', Validators.required], // Password field with required validation
      rememberMe: [false] // Optional checkbox for "Remember me"
    });
  }

  // Handle form submission
  // onSubmit() {
  //   const { username, password } = this.loginForm.value;

  //   this.authSvc.login({ username, password }).subscribe({
  //     next: (res) => {
  //       localStorage.setItem('authToken', res.token); // Save token

  //       this.router.navigate(['admin/dashboard']);

  //     },
  //     error: () => {
  //       alert('Invalid username or password');
  //     }
  //   });

  onSubmit() {
  const { username, password } = this.loginForm.value;

  this.authSvc.login({ username, password }).subscribe({
    next: (res) => {
      localStorage.setItem('authToken', res.token); // Save token
      localStorage.setItem('userRole', res.role);   // Optional: save role for guards or layout

      // Route based on role
      const route = res.role === 'admin' ? 'admin/dashboard' : 'staff/staff-dashboard';
      this.router.navigate([route]);
    },
    error: () => {
      alert('Invalid username or password');
    }
  });
}

}
