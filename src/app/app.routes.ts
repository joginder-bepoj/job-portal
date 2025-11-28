import { Routes } from '@angular/router';
import { Dashboard } from './component/dashboard/dashboard';
import { Companies } from './component/companies/companies';


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
  }
];