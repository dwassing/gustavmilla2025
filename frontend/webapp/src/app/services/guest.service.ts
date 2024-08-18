import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Guest } from '../models/guest.model';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  constructor(private http: HttpClient) {}

  getGuestPreferences(): Observable<Guest[]> {
    const headers = new HttpHeaders({
      'Authorization': `${localStorage.getItem('token')}`,
      accept: 'application/json'
    });
    return this.http.get<Guest[]>(`${environment.backendBaseUrl}/getGuestPreferences`, {headers})
  }
}
