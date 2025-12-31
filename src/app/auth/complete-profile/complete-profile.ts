import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.scss'
})
export class CompleteProfile {
  profileForm!: FormGroup;

  submitting = false;
  serverError: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.profileForm = this.fb.group({
      user_id: [''],
      full_name: ['', Validators.required],
      password: ['', Validators.minLength(6)],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      work_status: ['', Validators.required],
      role: ['jobseeker']
    });

    this.route.queryParams.subscribe(params => {
      if (params['user_id']) this.profileForm.patchValue({ user_id: params['user_id'] });
      if (params['name']) this.profileForm.patchValue({ full_name: params['name'] });
      if (params['email']) this.profileForm.patchValue({ /* could prefill email if needed */ });
    });
  }

  submit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.serverError = null;

    const payload = {
      user_id: this.profileForm.get('user_id')?.value,
      full_name: this.profileForm.get('full_name')?.value,
      password: this.profileForm.get('password')?.value,
      mobile: this.profileForm.get('mobile')?.value,
      work_status: this.profileForm.get('work_status')?.value,
      role: this.profileForm.get('role')?.value
    };

    this.auth.updateProfile(payload).subscribe({
      next: (res: any) => {
        console.log('Profile updated', res);
        // Backend may require OTP verification or may return a session token
        const token = res?.token || res?.data?.token || res?.access_token;
        if (token) {
          localStorage.setItem('authToken', token);
          this.router.navigate(['/dashboard']);
          return;
        }

        // Otherwise, if backend sends email for OTP verification, redirect to verify-otp
        if (payload['mobile'] || payload['full_name']) {
          this.router.navigate(['/verify-otp'], { queryParams: { email: (payload as any)['email'] || '' } });
          return;
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Update profile failed', err);
        this.serverError = err?.error?.message || 'Update failed';
        this.submitting = false;
      }
    });
  }
}
