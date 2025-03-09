import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  apiUrl = 'http://localhost:3000/api/v1/user';

  createUser(user: Partial<User>) {
    return this.http.post<User>(this.apiUrl, user);
  }

  getAllUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateUser(user: User) {
    return this.http.put<User>(
      this.apiUrl + '/' + user.id,
      user
    );
  }

  deleteUser(id: number) {
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }
}
