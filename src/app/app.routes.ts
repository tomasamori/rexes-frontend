import { Routes } from '@angular/router';
import { SignInComponent } from './src/authentication/components/sign-in/sign-in.component';
import { HomeComponent } from './src/pages/home/home.component';
import { authenticationGuard } from './src/authentication/guards/authentication.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authenticationGuard] },
  { path: 'signin', component: SignInComponent },
];
