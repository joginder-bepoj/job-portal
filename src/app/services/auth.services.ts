import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://sandbox.bepoj.com/jobsportalapi/public/api';

  constructor(private http: HttpClient) {}

  // Register API
  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, formData);
  }

  // Login API
  loginUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  verifyOtp(data: any) {
  return this.http.post('https://sandbox.bepoj.com/jobsportalapi/public/api/verifyOtp', data);
}

resendOtp(data: any) {
  return this.http.post('https://sandbox.bepoj.com/jobsportalapi/public/api/resendotp', data);
}
  // Social login: send Google id_token (credential) to backend for verification
  socialLogin(payload: any) {
    return this.http.post(`${this.baseUrl}/google-login`, payload);
  }

  // Update profile after social login if backend requires more details
  updateProfile(payload: any) {
    return this.http.post(`${this.baseUrl}/update-profile`, payload);
  }}
