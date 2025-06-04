import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @ViewChild('menuToggle') menuToggle!: ElementRef<HTMLInputElement>;
  constructor(private router: Router) {}

  goTo(route: string){
    this.router.navigate([`${route}`])
    this.menuToggle.nativeElement.checked = false; // Close menu
  }
}
