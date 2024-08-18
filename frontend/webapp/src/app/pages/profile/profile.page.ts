import { Component, OnInit } from "@angular/core";
import { GuestService } from "../../services/guest.service";
import { Guest } from "../../models/guest.model";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { RegistrationComponent } from "../../components/registration/registration.component";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [RegistrationComponent],
  templateUrl: "./profile.page.html",
  styleUrl: "./profile.page.scss",
})
export class ProfilePage implements OnInit {
  guestPreferences: Guest[] = [];
  notRegisteredIds: number[] = [];
  idsToBeRegistered: number[] = [];
  guestsToBeRegistered: Guest[] = [];
  submitCount: number = 0;
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

  constructor(
    private guestService: GuestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getGuestPreferences();
  }

  getGuestPreferences(): void {
    this.guestService.getGuestPreferences().subscribe((res) => {
      this.guestPreferences = res;
      this.guestPreferences.forEach((guest) => {
        if (!guest.registered) {
          this.notRegisteredIds.push(guest.guestId);
        }
      });
    });
  }

  createGuestRegistration(): void {
    this.idsToBeRegistered.push(this.notRegisteredIds.pop()!!);
  }

  onGuestFormSubmit(guest: Guest){
    this.guestsToBeRegistered.push(guest);
  }

  async setGuestPreferences(): Promise<boolean> {
    const res = await this.guestService.setGuestPreferences(this.guestsToBeRegistered);
    if (res){
      this.guestsToBeRegistered = [];
      this.notRegisteredIds = []; // not quite, only remove those that are registered
    }
    return res;
  }

  logout(): void {
    this.authService.notifyLogoutReason("Du har nu loggat ut!");
    this.router.navigate(["/"]);
    localStorage.clear();
  }
}
