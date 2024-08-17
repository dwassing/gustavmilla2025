import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {}

  loginUser(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.backendBaseUrl}/login?username=${username}&password=${password}`, {})
  }
}
