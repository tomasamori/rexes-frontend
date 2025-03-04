import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private readonly http: HttpClient) {}

  apiUrl = 'http://localhost:3000/api/v1/authentication';
  userRole: string | null = null;

  signIn(email: string, password: string) {
    return this.http.post<{ token: string, role: string }>(this.apiUrl + '/signin', {
      email,
      password,
    });
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  isAdmin() {
    return this.userRole === 'admin';
  }

  signOut() {
    localStorage.removeItem('authToken');
  }
}
