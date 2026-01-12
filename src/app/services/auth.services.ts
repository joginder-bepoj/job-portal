import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://sandbox.bepoj.com/jobsportalapi/public/api';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, formData);
  }

  loginUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  verifyOtp(data: any) {
    return this.http.post(`${this.baseUrl}/verifyOtp`, data);
  }

  resendOtp(data: any) {
    return this.http.post(`${this.baseUrl}/resendotp`, data);
  }

  socialLogin(payload: any) {
    return this.http.post(`${this.baseUrl}/google-login`, payload);
  }

  updateProfile(payload: any) {
    return this.http.post(`${this.baseUrl}/update-profile`, payload);
  }

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return this.userSubject.value;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }
}
