import { Routes } from '@angular/router';
import { SignInComponent } from './src/authentication/components/sign-in/sign-in.component';
import { HomeComponent } from './src/pages/home/home.component';
import { authenticationGuard } from './src/authentication/guards/authentication.guard';
import { OperationComponent } from './src/pages/operation/operation.component';
import { UserComponent } from './src/pages/user/user.component';
import { adminGuard } from './src/authentication/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authenticationGuard] },
  { path: 'signin', component: SignInComponent },
  { path: 'operations', component: OperationComponent, canActivate: [authenticationGuard] },
  { path: 'users', component: UserComponent, canActivate: [authenticationGuard, adminGuard] }
];
