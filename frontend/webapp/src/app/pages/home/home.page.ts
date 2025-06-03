import { Component } from '@angular/core';
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginPage, CarouselModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  message: string | null = null;
  isLoggedIn: boolean = false;
  images = [
    'assets/images/IMG_2.jpg',
    'assets/images/IMG_3.JPG',
    'assets/images/IMG_4.jpg',
    'assets/images/IMG_5.JPG',
    'assets/images/IMG_6.JPG',
    'assets/images/IMG_7.jpg',
    'assets/images/IMG_8.jpg',
    'assets/images/IMG_9.jpg',
    'assets/images/IMG_10.jpg',
    'assets/images/IMG_11.jpg',
    'assets/images/IMG_12.jpg',
    'assets/images/IMG_13.jpg',
  ];
  customOptions = {
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 2 }
    }
  };

  constructor(
    private router: Router, private authService: AuthService
  ) {

  }

  goToLoginPage(): void {
    this.router.navigate([`login`])
  }

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('token') != null;
    this.authService.logoutReason$.subscribe(msg => {
      this.message = msg;
      if (msg) {
        setTimeout(() => this.authService.clearMessage(), 10000);  // Clear message after 10 seconds
      }
    });
  }

}
