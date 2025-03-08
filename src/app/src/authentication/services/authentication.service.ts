import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private readonly http: HttpClient) {}

  apiUrl = 'http://localhost:3000/api/v1/authentication';

  signIn(email: string, password: string) {
    return this.http.post<{ token: string; role: string }>(
      this.apiUrl + '/signin',
      {
        email,
        password,
      }
    );
  }

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const expiration = localStorage.getItem('expirationTime');

    if (!token || !expiration) {
      return false;
    }

    const currentTime = new Date().getTime();
    if (currentTime > Number(expiration)) {
      this.signOut(); // Cerrar sesión automáticamente si expiró
      return false;
    }

    return true;
  }

  isAdmin() {
    return localStorage.getItem('role') === 'admin';
  }

  signOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
  }
}
