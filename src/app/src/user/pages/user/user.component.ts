import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/user.interface';
import { UserService } from '../../services/user.service';
import { DeleteDialogComponent } from '../../../common/dialogs/delete-dialog/delete-dialog.component';
import { UserFormDialogComponent } from '../../components/user-form-dialog/user-form-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../authentication/services/authentication.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatIconModule, NgIf],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly deleteDialog = inject(MatDialog);
  private readonly userFormDialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if (this.dataSource) {
        this.dataSource.setData(this.dataToDisplay);
      }
    });
  }

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.displayedColumns.push('actions');
    }
    this.getAllUsers();
  }

  openUserFormDialog(user?: User) {
    const userFormDialogRef = this.userFormDialog.open(
      UserFormDialogComponent,
      {
        data: {
          title: user ? 'Edit user' : 'Create user',
          user,
        },
      }
    );

    userFormDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers();
      }
    });
  }

  openDeleteDialog(userId: number) {
    const deleteDialogRef = this.deleteDialog.open(DeleteDialogComponent, {
      data: {
        entity: 'user',
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(userId);
      }
    });
  }

  getAllUsers() {
    this.userService
      .getAllUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap({
          next: (users) => {
            this.dataToDisplay = users;
            this.dataSource.setData(this.dataToDisplay);
          },
          error: () => {
            this.snackBar.open(
              'An error occurred while fetching users',
              'Close',
              {
                duration: 5000,
              }
            );
          },
        })
      )
      .subscribe();
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.dataToDisplay = this.dataToDisplay.filter(
          (user) => user.id !== id
        );
        this.dataSource.setData(this.dataToDisplay);
        this.snackBar.open('User deleted successfully', 'Close', {
          duration: 5000,
        });
      },
      error: () => {
        this.snackBar.open(
          'An error occurred while deleting the user',
          'Close',
          {
            duration: 5000,
          }
        );
      },
    });
  }

  isAdmin() {
    return this.authenticationService.isAdmin();
  }

  dataToDisplay: User[] = [];

  displayedColumns: string[] = [
    'id',
    'email',
    'name',
    'role',
  ];

  dataSource = new UserDataSource(this.dataToDisplay);
}

class UserDataSource extends DataSource<User> {
  private _dataStream = new ReplaySubject<User[]>();

  constructor(initialData: User[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<User[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: User[]) {
    this._dataStream.next(data);
  }
}
