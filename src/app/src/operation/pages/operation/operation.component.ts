import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Operation } from '../../models/operation.interface';
import { OperationService } from '../../services/operation.service';
import { DeleteDialogComponent } from '../../../common/dialogs/delete-dialog/delete-dialog.component';
import { OperationFormDialogComponent } from '../../components/operation-form-dialog/operation-form-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../authentication/services/authentication.service';

@Component({
  selector: 'app-operation',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatIconModule, DatePipe, NgIf],
  templateUrl: './operation.component.html',
  styleUrl: './operation.component.scss',
})
export class OperationComponent implements OnInit {
  private readonly operationService = inject(OperationService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly deleteDialog = inject(MatDialog);
  private readonly operationFormDialog = inject(MatDialog);
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
    this.getAllOperations();
  }

  openOperationFormDialog(operation?: Operation) {
    const operationFormDialogRef = this.operationFormDialog.open(
      OperationFormDialogComponent,
      {
        data: {
          title: operation ? 'Edit operation' : 'Create operation',
          operation,
        },
      }
    );

    operationFormDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllOperations();
      }
    });
  }

  openDeleteDialog(operationId: number) {
    const deleteDialogRef = this.deleteDialog.open(DeleteDialogComponent, {
      data: {
        entity: 'operation',
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteOperation(operationId);
      }
    });
  }

  getAllOperations() {
    this.operationService
      .getAllOperations()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap({
          next: (operations) => {
            this.dataToDisplay = operations;
            this.dataSource.setData(this.dataToDisplay);
          },
          error: () => {
            this.snackBar.open(
              'An error occurred while fetching operations',
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

  deleteOperation(id: number) {
    this.operationService.deleteOperation(id).subscribe({
      next: () => {
        this.dataToDisplay = this.dataToDisplay.filter(
          (operation) => operation.id !== id
        );
        this.dataSource.setData(this.dataToDisplay);
        this.snackBar.open('Operation deleted successfully', 'Close', {
          duration: 5000,
        });
      },
      error: () => {
        this.snackBar.open(
          'An error occurred while deleting the operation',
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

  dataToDisplay: Operation[] = [];

  displayedColumns: string[] = [
    'id',
    'operationTimestamp',
    'amount',
    'type',
    'description',
  ];

  dataSource = new OperationDataSource(this.dataToDisplay);
}

class OperationDataSource extends DataSource<Operation> {
  private _dataStream = new ReplaySubject<Operation[]>();

  constructor(initialData: Operation[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Operation[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Operation[]) {
    this._dataStream.next(data);
  }
}
