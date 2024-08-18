import { Component, OnInit } from "@angular/core";
import { GuestService } from "../../services/guest.service";
import { Guest } from "../../models/guest.model";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [],
  templateUrl: "./profile.page.html",
  styleUrl: "./profile.page.scss",
})
export class ProfilePage implements OnInit {
  guestPreferences: Guest[] = [];
  numberOfNotRegistered: number = 0;
  constructor(
    private guestService: GuestService,
    private authService: AuthService,
    private router: Router
  ) {}

  mockdata: Guest[] = [
    {
      guestId: 2,
      firstName: "Daniel",
      lastName: "Wassing",
      foodPreference: "",
      allergi: "jordnötter",
      registered: true,
    },
    {
      guestId: 5,
      firstName: "Annica",
      lastName: "Wassing",
      foodPreference: "",
      allergi: "fisk",
      registered: false,
    },
  ];

  ngOnInit(): void {
    this.getGuestPreferences();
  }

  getGuestPreferences(): void {
    this.guestService.getGuestPreferences().subscribe((res) => {
      this.guestPreferences = this.mockdata;
      this.guestPreferences.forEach((guest) => {
        if (!guest.registered) {
          this.numberOfNotRegistered++;
        }
      });
      // this.guestPreferences = this.mockdata;
    });
  }

  async setGuestPreferences(): Promise<boolean> {
    const res = await this.guestService.setGuestPreferences();
    return res;
  }

  logout(): void {
    this.authService.notifyLogoutReason("Du har nu loggat ut!");
    this.router.navigate(["/"]);
    localStorage.clear();
  }
}
