import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';
import { ProfilePage } from './pages/profile/profile.page';
import { AuthGuard } from './auth/auth.guard';
import { InfoPage } from './pages/info/info.page';
import { SchedulePage } from './pages/schedule/schedule.page';

export const routes: Routes = [
  { path: '', component: HomePage},
  { path: 'login', component: LoginPage },
  { path: 'info', component: InfoPage },
  { path: 'schedule', component: SchedulePage },
  { path: 'profile', component: ProfilePage, canActivate: [AuthGuard] },
];
