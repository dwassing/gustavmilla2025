import { Component } from '@angular/core';
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginPage],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  message: string | null = null;
  constructor(
    private router: Router, private authService: AuthService
  ) {

  }

  goToLoginPage(): void {
    this.router.navigate([`login`])
  }

  ngOnInit() {
    this.authService.logoutReason$.subscribe(msg => {
      this.message = msg;
      if (msg) {
        setTimeout(() => this.authService.clearMessage(), 10000);  // Clear message after 10 seconds
      }
    });
  }

}
