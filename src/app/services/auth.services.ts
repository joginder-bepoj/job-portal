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
}
