import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // ✅ Import Router here

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent {
  constructor(private router: Router) {} // ✅ Now Angular knows what Router is

  logout() {
    localStorage.clear(); // or sessionStorage.clear()
    this.router.navigate(['']);
  }
}
