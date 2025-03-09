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
import { OperationService } from '../../services/operation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-operation-form-dialog',
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
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './operation-form-dialog.component.html',
  styleUrl: './operation-form-dialog.component.scss',
})
export class OperationFormDialogComponent implements OnInit {
  private readonly operationService = inject(OperationService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(
    MatDialogRef<OperationFormDialogComponent>
  );
  data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this.data.operation) {
      this.operationForm.patchValue(this.data.operation);
    }
  }

  operationForm = new FormGroup({
    id: new FormControl(''),
    operationTimestamp: new FormControl(''),
    type: new FormControl('expense', [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    description: new FormControl('', []),
  });

  onSubmit() {
    if (!this.operationForm.valid) {
      return;
    }

    if (this.data.operation) {
      let operationCopy = {
        id: Number(this.data.operation.id),
        operationTimestamp: new Date(
          this.operationForm.value.operationTimestamp!
        ),
        type: this.operationForm.value.type!,
        amount: Number(this.operationForm.value.amount),
        description: this.operationForm.value.description!,
      };
      this.operationService.updateOperation(operationCopy).subscribe(() => {
        this.snackBar.open('Operation updated successfully', 'Close', {
          duration: 5000,
        });
        this.dialogRef.close(true);
      });
    } else {
      let operationCopy = {
        operationTimestamp: new Date(),
        type: this.operationForm.value.type!,
        amount: Number(this.operationForm.value.amount),
        description: this.operationForm.value.description!,
      };
      this.operationService.createOperation(operationCopy).subscribe(() => {
        this.snackBar.open('Operation created successfully', 'Close', {
          duration: 5000,
        });
        this.dialogRef.close(true);
      });
    }
  }
}
