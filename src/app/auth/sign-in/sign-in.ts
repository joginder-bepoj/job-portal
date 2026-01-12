import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn implements AfterViewInit {

  signupForm!: FormGroup;
  selectedStatus: 'experienced' | 'fresher' | null = null;
  uploadedResume: File | null = null;
  resumeFile: File | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  // Debug / helper values shown in the UI to assist with Google origin issues
  public googleClientId = environment.googleClientId;
  public googleOrigin = (typeof window !== 'undefined' && (window as any).location) ? (window as any).location.origin : '';
  public googleInitError: string | null = null;
  public socialError: string | null = null;

  ngOnInit() {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      workStatus: ['', Validators.required],
      role: ['admin'],
      alerts: [false]
    });
  }

  ngAfterViewInit() {
    // Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual Google OAuth client ID
    try {
      // Use a safe reference to window to avoid TS errors
      const anyWindow: any = window;
      // Debug: show configured client ID and current origin to help diagnose origin issues
      console.log('Google Client ID:', environment.googleClientId);
      console.log('Current origin:', anyWindow.location?.origin ?? 'unknown');

      if (anyWindow.google && anyWindow.google.accounts && anyWindow.google.accounts.id) {
        anyWindow.google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleCredentialResponse(response),
        });

        anyWindow.google.accounts.id.renderButton(
          document.getElementById('googleBtn'),
          { theme: 'outline', size: 'large' }
        );

        anyWindow.google.accounts.id.prompt();
      } else {
        console.warn('Google Identity Services library not found. Make sure the script is included in index.html');
      }
    } catch (err) {
      console.error('Error initializing Google Sign-In', err);
    }
  }

  private handleCredentialResponse(response: any) {
    if (!response || !response.credential) {
      console.warn('No credential received from Google');
      return;
    }

    const credential = response.credential;
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const profile = JSON.parse(jsonPayload);
      console.log('Google profile:', profile);

      // Send the id_token (credential) to backend social login endpoint
      const payload: any = { id_token: credential };

      this.auth.socialLogin(payload).subscribe({
        next: (res: any) => {
          console.log('Social login response', res);

          // Store any returned token (check common response shapes)
          const token = res?.token || res?.data?.token || res?.access_token;
          if (token) {
            localStorage.setItem('authToken', token);
          }

          // If backend indicates profile is incomplete, redirect to complete-profile
          // Accept several possible flags/fields from backend
          if (res?.incomplete_profile || res?.needs_profile || res?.status === 'incomplete') {
            const userId = res?.user_id || res?.data?.user_id || profile.email;
            this.router.navigate(['/complete-profile'], { queryParams: { user_id: userId, email: profile.email, name: profile.name } });
            return;
          }

          // Otherwise assume login succeeded
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Social login failed', err);

          // If server returns info to complete profile, navigate there
          const errData = err?.error || {};
          if (errData?.incomplete_profile || errData?.needs_profile) {
            const userId = errData?.user_id || profile.email;
            this.router.navigate(['/complete-profile'], { queryParams: { user_id: userId, email: profile.email, name: profile.name } });
            return;
          }

          // Generic fallback: show error to user
          this.socialError = err?.error?.message || 'Social login failed. Please try again or contact support.';
          console.error('Social login failure details', err);
        }
      });

    } catch (e) {
      console.error('Failed to decode credential payload', e);
    }
  }

  copyOrigin() {
    try {
      navigator.clipboard.writeText(this.googleOrigin);
      this.googleInitError = null;
      alert('Origin copied to clipboard: ' + this.googleOrigin);
    } catch (e) {
      console.error('Copy failed', e);
      this.googleInitError = 'Copy failed: ' + ((e as any)?.message || e);
    }
  }

  manualPrompt() {
    try {
      const anyWindow: any = window;
      anyWindow.google?.accounts?.id?.prompt();
    } catch (e) {
      console.error('prompt failed', e);
      this.googleInitError = 'Google prompt failed: ' + ((e as any)?.message || e);
    }
  }

    onResumeUpload(event: any) {
    this.resumeFile = event.target.files[0];
  }
  selectStatus(status: 'experienced' | 'fresher') {
    this.selectedStatus = status;
    this.signupForm.patchValue({ workStatus: status });
  }

  // Submit & Call API
  submitSignup() {
  if (this.signupForm.invalid) {
    this.signupForm.markAllAsTouched();
    return;
  }

  const formData = new FormData();
  formData.append('full_name', this.signupForm.get('fullName')?.value);
  formData.append('email', this.signupForm.get('email')?.value);
  formData.append('password', this.signupForm.get('password')?.value);
  formData.append('mobile', this.signupForm.get('mobile')?.value);
  formData.append('work_status', this.signupForm.get('workStatus')?.value);
  formData.append('role', this.signupForm.get('role')?.value);

  this.auth.registerUser(formData).subscribe({
    next: (res: any) => {
      console.log("Signup Success:", res);

      const email = this.signupForm.get('email')?.value;

      // 👉 Redirect to OTP page with email
      this.router.navigate(['/verify-otp'], {
        queryParams: { email }
      });
    },
    error: (err: any) => {
      console.error("Signup Error:", err);
      alert("Registration failed!");
    }
  });
}

}
