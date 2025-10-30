// Import necessary Angular core and form modules
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

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
  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize the form with controls and validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Username field with required validation
      password: ['', Validators.required], // Password field with required validation
      rememberMe: [false] // Optional checkbox for "Remember me"
    });
  }

  // Handle form submission
  onSubmit() {
    // Extract username and password from the form
    const { username, password } = this.loginForm.value;

    // Check credentials and navigate accordingly
    if (username === 'admin@example.com' && password === 'admin123') {
      // Navigate to admin dashboard if admin credentials match
      this.router.navigate(['/admin/dashboard']);
    } else if (username === 'staff@example.com' && password === 'staff123') {
      // Navigate to staff dashboard if staff credentials match
      this.router.navigate(['/staff/staff-dashboard']);
    } else {
      // Show an alert if credentials are invalid
      alert('Invalid credentials');
    }
  }
}
