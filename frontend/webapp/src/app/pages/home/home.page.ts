import { Component } from '@angular/core';
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginPage],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  constructor(
    private router: Router
  ) {

  }

  goToLoginPage(): void {
    this.router.navigate([`login`])
  }

}
