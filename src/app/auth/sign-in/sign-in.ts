import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.services';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {

  signupForm!: FormGroup;
  selectedStatus: 'experienced' | 'fresher' | null = null;
  uploadedResume: File | null = null;
  resumeFile: File | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      workStatus: ['', Validators.required],
      role: ['jobseeker'],   // Default role
    });
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

    // ---- Call API ----
    this.auth.registerUser(formData).subscribe({
      next: (res:any) => {
        console.log("Signup Success:", res);
        alert("Registration successful!");
      },
      error: (err:any) => {
        console.error("Signup Error:", err);
        alert("Registration failed!");
      }
    });
  }
}
