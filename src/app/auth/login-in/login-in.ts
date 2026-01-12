import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login-in',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-in.html',
  styleUrl: './login-in.scss',
})
export class LoginIn {
  loginForm!: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const payload = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.auth.loginUser(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res.status && res.user) {
          this.auth.setUser(res.user);
          this.router.navigate(['/dashboard']);
        }
        this.isLoading = false;
      },
      error: () => {
        alert('Invalid email or password');
        this.isLoading = false;
      },
    });
  }
}
