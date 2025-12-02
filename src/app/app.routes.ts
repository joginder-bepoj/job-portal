import { Routes } from '@angular/router';
import { Dashboard } from './component/dashboard/dashboard';
import { Companies } from './component/companies/companies';
import { SignIn } from './auth/sign-in/sign-in';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path:'companies',
    component: Companies
  },
   {
    path:'signin',
    component: SignIn
  }
];