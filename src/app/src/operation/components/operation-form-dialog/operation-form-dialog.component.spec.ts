import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationFormDialogComponent } from './operation-form-dialog.component';

describe('OperationFormDialogComponent', () => {
  let component: OperationFormDialogComponent;
  let fixture: ComponentFixture<OperationFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
