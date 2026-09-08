import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { DealsComponent } from './pages/deals/deals.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'contacts',
    component: ContactsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'deals',
    component: DealsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
