import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  response: string = '';
  constructor(
    private loginService: LoginService,
    private router: Router
  ){

  }

  loginUser(form: NgForm){
    console.log(form);
    const username = form.value.username;
    const password = form.value.password;
    this.loginService.loginUser(username, password).subscribe(res => {
      if (res.token){
        localStorage.setItem('firstname', res.first_name);
        localStorage.setItem('lastname', res.last_name);
        localStorage.setItem('token', res.token);
        this.router.navigate([`profile`]);
      }
      else{
        this.response = res.message
      }
    })

  }

  onSubmit(form: NgForm) {
    console.log('Your form data : ', form.value);
}
}
