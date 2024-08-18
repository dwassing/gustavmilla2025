import { Component, OnInit } from '@angular/core';
import { GuestService } from '../../services/guest.service';
import { Guest } from '../../models/guest.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss'
})
export class ProfilePage implements OnInit {
  guestPreferences: Guest[] = [];
  constructor(private guestService: GuestService) {

  }

  mockdata: Guest[] = [
    {
      guestId: 2,
      firstName: 'Daniel',
      lastName: 'Wassing',
      foodPreference: '',
      allergi: 'jordnötter',
      registered: true
    },
    {
      guestId: 5,
      firstName: 'Annica',
      lastName: 'Wassing',
      foodPreference: '',
      allergi: 'fisk',
      registered: true
    }
  ]

  ngOnInit(): void {
    this.getGuestPreferences();
  }

  getGuestPreferences(): void {
    this.guestService.getGuestPreferences().subscribe(res => {
      // this.guestPreferences = res;
      this.guestPreferences = this.mockdata;
    })
  }

  async setGuestPreferences(): Promise<boolean> {
    const res = await this.guestService.setGuestPreferences();
    return res;
  }

}
