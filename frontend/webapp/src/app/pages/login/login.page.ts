import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  constructor(
    private loginService: LoginService,
    private router: Router
  ){

  }

  loginUser(){
    this.loginService.loginUser('danwa', 'danwa').subscribe(res => {
      if (res.token){
        localStorage.setItem('firstname', res.first_name);
        localStorage.setItem('lastname', res.last_name);
        localStorage.setItem('token', res.token);
        this.router.navigate([`profile`]);
      }
    })

  }
}
