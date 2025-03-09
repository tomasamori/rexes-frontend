import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatLabel,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
})
export class UserFormDialogComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  errorMessage: string | null = null;

  ngOnInit(): void {
    if (this.data.user) {
      this.userForm.patchValue(this.data.user);
    }
  }

  userForm = new FormGroup({
    id: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (!this.userForm.valid) {
      return;
    }

    if (this.data.user) {
      let userCopy = {
        id: Number(this.data.user.id),
        email: this.userForm.value.email!,
        password:
          this.data.user.password !== this.userForm.value.password
            ? this.userForm.value.password ?? undefined
            : undefined,
        name: this.userForm.value.name!,
        role: this.userForm.value.role!,
      };
      this.userService.updateUser(userCopy).subscribe({
        next: () => {
          this.snackBar.open('User updated successfully', 'Close', {
            duration: 5000,
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open(
            'An error occurred while updating the user: ' + error.error.message,
            'Close',
            {
              duration: 5000,
            }
          );
        },
      });
    } else {
      let userCopy = {
        email: this.userForm.value.email!,
        password: this.userForm.value.password!,
        name: this.userForm.value.name!,
        role: this.userForm.value.role!,
      };
      this.userService.createUser(userCopy).subscribe({
        next: () => {
          this.snackBar.open('User created successfully', 'Close', {
            duration: 5000,
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open(
            'An error occurred while creating the user: ' + error.error.message,
            'Close',
            {
              duration: 5000,
            }
          );
        },
      });
    }
  }
}
