import { Component } from '@angular/core';
import { GuestService } from '../../services/guest.service';
import { Guest } from '../../models/guest.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss'
})
export class ProfilePage {
  guestPreferences: Guest[] = [];
  constructor(private guestService: GuestService) {

  }

  getGuestPreferences(): void {
    this.guestService.getGuestPreferences().subscribe(res => {
      this.guestPreferences = res;
    })
  }

}
