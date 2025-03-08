import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Operation } from '../models/operation.interface';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  constructor(private readonly http: HttpClient) {}

  apiUrl = 'http://localhost:3000/api/v1/operation';

  createOperation(operation: Partial<Operation>) {
    return this.http.post<Operation>(this.apiUrl, operation);
  }

  getAllOperations() {
    return this.http.get<Operation[]>(this.apiUrl);
  }

  updateOperation(operation: Operation) {
    return this.http.put<Operation>(
      this.apiUrl + '/' + operation.id,
      operation
    );
  }

  deleteOperation(id: number) {
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }
}
