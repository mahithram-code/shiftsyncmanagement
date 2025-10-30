import { Component } from '@angular/core'; // FIX: Add Component
import { CommonModule } from '@angular/common'; // FIX: Add CommonModule
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // FIX: Add Reactive Forms classes
import { RouterModule, Router } from '@angular/router'; // FIX: Add RouterModule and Router
import { AuthService } from '../ApiService/AuthService'; // FIX: Add AuthService

// Define the component metadata
@Component({
  selector: 'app-login', // Component selector used in templates
  standalone: true, // Enables standalone component usage
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Required modules for template and form functionality
  templateUrl: './login.html' // External HTML template for the component
})
export class LoginComponent {
  // Define the login form group
  loginForm: FormGroup; // FIX: FormGroup is now recognized

  // Inject FormBuilder and Router services
  constructor(private fb: FormBuilder, private router: Router, private authSvc: AuthService) { // FIX: FormBuilder, Router, AuthService are now recognized
    // Initialize the form with controls and validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // FIX: Validators is now recognized
      password: ['', Validators.required], // FIX: Validators is now recognized
      rememberMe: [false] // Optional checkbox for "Remember me"
    });
  }

  // Handle form submission
 
  onSubmit() {
    const { username, password } = this.loginForm.value;

    this.authSvc.login({ username, password }).subscribe({
      next: (res: any) => { 
        localStorage.setItem('authToken', res.token);
        
        // FIX: Read the 'securityRole' property from the backend response (which is sent as SecurityRole)
        const rawRole = res.securityRole || ''; // <--- Changed from res.role to res.securityRole
        const normalizedRole = rawRole.toLowerCase();
        
        localStorage.setItem('userRole', normalizedRole);

        // Route based on role
        const route = normalizedRole === 'admin' ? 'admin/dashboard' : 'staff/staff-dashboard';
        this.router.navigate([route]);
      },
      error: () => {
        alert('Invalid username or password');
      }
    });
  }

}