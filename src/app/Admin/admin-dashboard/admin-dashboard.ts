import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent {
  constructor(private router: Router) {} 

  logout() {
    localStorage.clear(); // or sessionStorage.clear()
    this.router.navigate(['']);
  }
}
