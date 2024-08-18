import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Guest } from '../models/guest.model';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private headers = new HttpHeaders({
    'Authorization': `${localStorage.getItem('token')}`,
    accept: 'application/json'
  });

  constructor(private http: HttpClient) {}

  getGuestPreferences(): Observable<Guest[]> {
    return this.http.get<Guest[]>(`${environment.backendBaseUrl}/getGuestPreferences`, {headers: this.headers})
  }

  async setGuestPreferences(): Promise<boolean> {
    return lastValueFrom(of(true));
  }
}
