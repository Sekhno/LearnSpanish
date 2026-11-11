import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/api/auth';

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  checkAuth(): Observable<User | null> {
    return this.http.get<User>(`${this.api}/me`, { withCredentials: true }).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(() => {
        this.userSubject.next(null);
        return of(null);
      })
    );
  }

  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post(`${this.api}/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    }).pipe(
      tap((res: any) => this.userSubject.next({ id: 0, username: res.username })),
      tap(() => this.checkAuth().subscribe())
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.api}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.userSubject.next(null)),
      catchError(() => {
        this.userSubject.next(null);
        return of(null);
      })
    );
  }
}
