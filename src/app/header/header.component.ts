import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(private authservice: AuthService, private router: Router) {}
  logout() {
    this.authservice.logout();
    this.router.navigate(['/auth']);
  }
}
