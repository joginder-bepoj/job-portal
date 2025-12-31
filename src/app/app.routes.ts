import { Routes } from '@angular/router';
import { Dashboard } from './component/dashboard/dashboard';
import { Companies } from './component/companies/companies';
import { SignIn } from './auth/sign-in/sign-in';
import { OtpVerify } from './auth/otp-verify/otp-verify';
import { LoginIn } from './auth/login-in/login-in';
import { CompleteProfile } from './auth/complete-profile/complete-profile';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'companies',
    component: Companies,
  },
  {
    path: 'signin',
    component: SignIn,
  },
  {
    path: 'verify-otp',
    component: OtpVerify,
  },
  {
    path: 'login',
    component: LoginIn
  },
  {
    path: 'complete-profile',
    component: CompleteProfile
  }
];
