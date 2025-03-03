import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private readonly http: HttpClient) {}

  apiUrl = 'http://localhost:3000/api/v1/authentication';

  signIn(email: string, password: string) {
    return this.http.post<{ token: string }>(this.apiUrl + '/signin', {
      email,
      password,
    });
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  signOut() {
    localStorage.removeItem('authToken');
  }
}
