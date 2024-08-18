import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionExpiredSubject = new BehaviorSubject<string | null>(null);

  constructor() { }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') != (null || undefined);
  }

  sessionExpired$ = this.sessionExpiredSubject.asObservable();

  notifySessionExpired(message: string) {
    this.sessionExpiredSubject.next(message);
  }

  clearMessage() {
    this.sessionExpiredSubject.next(null);
  }
}
