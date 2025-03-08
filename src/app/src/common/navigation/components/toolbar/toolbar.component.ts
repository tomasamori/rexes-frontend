import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../../authentication/services/authentication.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, NgIf],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  signOut() {
    this.authenticationService.signOut();
    this.router.navigate(['/signin']);
  }

  isAdmin() {
    return this.authenticationService.isAdmin();
  }
}
