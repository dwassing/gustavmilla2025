import { Component } from '@angular/core';
import { GuestService } from '../../services/guest.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss'
})
export class ProfilePage {
  constructor(private guestService: GuestService) {

  }

  getGuestPreferences(): void {
    this.guestService.getGuestPreferences().subscribe(res => {
      console.log(res);
    })
  }

}
