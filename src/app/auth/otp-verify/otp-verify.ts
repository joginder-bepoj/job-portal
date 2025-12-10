import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-verify',
  imports: [ FormsModule, ReactiveFormsModule],
  templateUrl: './otp-verify.html',
  styleUrl: './otp-verify.scss',
})
export class OtpVerify {
  otpForm!: FormGroup;
  email!: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'];

    this.otpForm = this.fb.group({
      otp: ['', Validators.required],
      email: [this.email, Validators.required]
    });
  }

  verifyOTP() {
  if (this.otpForm.invalid) {
    this.otpForm.markAllAsTouched();
    return;
  }

  const payload = {
    email: this.email,
    otp: this.otpForm.get('otp')?.value
  };

  this.auth.verifyOtp(payload).subscribe({
    next: (res: any) => {
      console.log("OTP Verified:", res);

      // 👉 Redirect to login page
      this.router.navigate(['/login']);
    },
    error: (err: any) => {
      console.error("OTP Verify Error:", err);
      alert("Invalid OTP!");
    }
  });
}


  resendOTP() {
    this.auth.resendOtp({ email: this.email }).subscribe({
      next: () => alert("OTP Resent!"),
      error: () => alert("Error in resending OTP")
    });
  }
}
