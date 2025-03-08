import { Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  errorMessage: string | null = null;

  hidePassword = signal(true);
  hidePasswordClickEvent(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  signInForm = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    passwordFormControl: new FormControl('', [Validators.required]),
  });

  signIn() {
    return this.authenticationService.signIn(
      this.signInForm.value.emailFormControl!,
      this.signInForm.value.passwordFormControl!
    );
  }

  onSubmit() {
    const result = this.signIn();

    result.subscribe({
      next: (data) => {
        let expirationTime = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('expirationTime', expirationTime.toString());
        this.router.navigate(['/']);
      },
      error: (error) => {
        if (error.status === 401 || error.status === 404) {
          this.errorMessage = 'Invalid email or password';
        } else {
          this.errorMessage = 'An error occurred while signing in';
        }
      },
    });
  }
}
