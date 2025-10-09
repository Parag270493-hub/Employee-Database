import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient, private router: Router) { }

  signup(userData: any): Observable<any> {
    // ensure role provided or default to 'user'
    if (!userData.role) userData.role = 'user';
    return this.http.post(this.apiUrl, userData);
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => users.length > 0 ? users[0] : null),
      tap(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      }),
      map(user => !!user)
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const u = this.getCurrentUser();
    return !!u && u.role === 'admin';
  }
}
