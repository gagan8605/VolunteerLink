import { Routes } from '@angular/router';
import { LayoutComponent } from './features/dashboard/layout/layout.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { EventDetailComponent } from './features/events/event-detail/event-detail.component';
import { MyEventsComponent } from './features/volunteer/my-events/my-events.component';
import { ProfileComponent } from './features/volunteer/profile/profile.component';
import { ManageEventsComponent } from './features/admin/manage-events/manage-events.component';
import { EventFormComponent } from './features/admin/event-form/event-form.component';
import { ViewVolunteersComponent } from './features/admin/view-volunteers/view-volunteers.component';
import { ReportsComponent } from './features/admin/reports/reports.component';
import { VolunteerProfileViewComponent } from './features/admin/volunteer-profile-view/volunteer-profile-view.component';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { volunteerGuard } from './core/guards/volunteer.guard';
import { loggedOutGuard } from './core/guards/logged-out.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
        {
            path: '',
            component: HomeComponent,
            pathMatch: 'full'
        },
        {
            path: 'auth',
            canActivateChild: [loggedOutGuard],
            children: [
                { path: 'login', component: LoginComponent },
                { path: 'register', component: RegisterComponent },
                { path: '', redirectTo: 'login', pathMatch: 'full' }
            ]
        },
        {
            path: 'app',
            canActivate: [authGuard],
            children: [
                { path: '', redirectTo: 'events', pathMatch: 'full' },
                { path: 'events', component: EventListComponent },
                { path: 'events/:id', component: EventDetailComponent },
                {
                    path: 'volunteer',
                    canActivate: [volunteerGuard],
                    children: [
                        { path: '', redirectTo: 'my-events', pathMatch: 'full'},
                        { path: 'my-events', component: MyEventsComponent },
                    ]
                },
                {
                    path: 'admin',
                    canActivate: [adminGuard],
                    children: [
                        { path: '', redirectTo: 'manage-events', pathMatch: 'full'},
                        { path: 'manage-events', component: ManageEventsComponent },
                        { path: 'event/new', component: EventFormComponent },
                        { path: 'event/edit/:id', component: EventFormComponent },
                        { path: 'event/:id/volunteers', component: ViewVolunteersComponent },
                        { path: 'volunteer-profile/:volunteerId', component: VolunteerProfileViewComponent },
                        { path: 'reports', component: ReportsComponent },
                    ]
                },
                {
                    path: 'profile',
                    component: ProfileComponent
                }
            ]
        }
    ]
  },
  { path: '**', redirectTo: '' }
];