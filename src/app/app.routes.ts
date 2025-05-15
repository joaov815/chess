import { Routes } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { PlayComponent } from './views/play/play.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'register',
  },
  {
    path: 'register',
    component: LoginComponent,
  },
  {
    path: 'play',
    component: PlayComponent,
  },
];
