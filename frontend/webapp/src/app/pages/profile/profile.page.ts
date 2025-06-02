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
  registeredGuests: Guest[] = [];
  notRegisteredGuests: Guest[] = [];
  idToBeRegistered: number | undefined;
  guestTemplate: Guest | undefined;
  guestsToBeRegistered: Guest[] = [];
  submitCount: number = 0;

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
      this.registeredGuests = res;
      this.notRegisteredGuests = [];
      this.registeredGuests.forEach((guest) => {
        if (!guest.registered) {
          this.notRegisteredGuests.push(guest);
        }
      });
    });
  }

  createGuestRegistration(guest: Guest): void {
    this.idToBeRegistered = guest.guestId;
    this.guestTemplate = guest;
  }

  onGuestFormSubmit(guest: Guest){
    this.registeredGuests.forEach(guest => {
      guest.isEditMode = false;
    });
    this.guestsToBeRegistered.push(guest);

    this.notRegisteredGuests = this.notRegisteredGuests.filter(
      (removeGuest) => +removeGuest.guestId !== +guest.guestId
    );

    this.idToBeRegistered = undefined;
    this.setGuestPreferences();
  }

  updateGuest(guest: Guest){
    this.registeredGuests[this.registeredGuests.indexOf(guest)].isEditMode = true;
  }

  async setGuestPreferences(): Promise<boolean> {
    const res = await this.guestService.setGuestPreferences(this.guestsToBeRegistered);
    if (res){
      this.guestsToBeRegistered = [];
    }
    this.getGuestPreferences();
    return res;
  }

  async unregisterGuest(guest: Guest): Promise<boolean> {
    const res = await this.guestService.removeGuest(guest);
    this.registeredGuests.splice(this.registeredGuests.indexOf(guest), 1);
    if (res) this.getGuestPreferences();
    return res;
  }

  logout(): void {
    this.authService.notifyLogoutReason("Du har nu loggat ut!");
    this.router.navigate(["/"]);
    localStorage.clear();
  }
}
