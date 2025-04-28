import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Role, Gender, RegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  roles = Object.values(Role);
  genders = Object.values(Gender);
  selectedRole: Role = Role.Volunteer;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: [Role.Volunteer, Validators.required],
      phoneNumber: [''],
      dateOfBirth: [''],
      gender: [null],
      address: [''],
      location: [''],
      generalOrgType: [''],
      designation: [''],
      organizationName: [''],
      yearsOfExperience: [null, [Validators.min(0)]],
      workEmail: ['', [Validators.email]],
      officeLocation: [''],
      areaOfInterest: [''],
      availability: [''],
      emergencyContactNumber: [''],
      skillsCertifications: [''],
      previousExperience: [''],
      willingToRelocate: [false],
      preferredLocation: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
      this.onRoleChange();
      this.registerForm.get('role')?.valueChanges.subscribe((value) => {
           this.selectedRole = value;
           this.onRoleChange();
      });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
       if(confirmPassword?.hasError('mismatch')){
          confirmPassword?.setErrors(null);
       }
       return null;
    }
  };

  onRoleChange(): void {
    const adminFields = ['designation', 'organizationName', 'yearsOfExperience', 'workEmail', 'officeLocation'];
    const volunteerFields = ['areaOfInterest', 'availability', 'emergencyContactNumber', 'skillsCertifications', 'previousExperience', 'willingToRelocate', 'preferredLocation'];

    if (this.selectedRole === Role.Admin) {
      this.clearValidators(volunteerFields);
      // Example: making organizationName required for Admin
      this.registerForm.get('organizationName')?.addValidators(Validators.required);
    } else if (this.selectedRole === Role.Volunteer) {
      this.clearValidators(adminFields);
       // Example: making areaOfInterest required for Volunteer
      this.registerForm.get('areaOfInterest')?.addValidators(Validators.required);
    } else {
        this.clearValidators(adminFields);
        this.clearValidators(volunteerFields);
    }
    // Update validity for potentially changed fields
    adminFields.forEach(field => this.registerForm.get(field)?.updateValueAndValidity());
    volunteerFields.forEach(field => this.registerForm.get(field)?.updateValueAndValidity());
  }

  private clearValidators(fields: string[]): void {
       fields.forEach(field => {
           const control = this.registerForm.get(field);
           control?.clearValidators();
           // Re-add specific validators if needed for non-required fields (e.g., email format)
           if (field === 'workEmail') {
              control?.addValidators(Validators.email);
           }
            if (field === 'yearsOfExperience') {
              control?.addValidators(Validators.min(0));
           }
           control?.updateValueAndValidity();
       });
   }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
       this.registerForm.markAllAsTouched();
       this.errorMessage = "Please fill in all required (*) fields correctly.";
       console.log("Form Errors:", this.registerForm.errors);
       Object.keys(this.registerForm.controls).forEach(key => {
            const controlErrors = this.registerForm.get(key)?.errors;
            if (controlErrors != null) {
                console.log('Key control: ' + key + ', errors: ' + JSON.stringify(controlErrors));
            }
        });
       return;
    }

    this.isLoading = true;
    const formData = this.registerForm.value;
    // Ensure nulls/empty strings are handled if needed, or let backend handle nulls
    const registrationData: RegisterRequest = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phoneNumber: formData.phoneNumber || null,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address || null,
        location: formData.location || null,
        generalOrgType: formData.generalOrgType || null,
        designation: formData.role === Role.Admin ? (formData.designation || null) : null,
        organizationName: formData.role === Role.Admin ? (formData.organizationName || null) : null,
        yearsOfExperience: formData.role === Role.Admin ? (formData.yearsOfExperience ?? null) : null,
        workEmail: formData.role === Role.Admin ? (formData.workEmail || null) : null,
        officeLocation: formData.role === Role.Admin ? (formData.officeLocation || null) : null,
        areaOfInterest: formData.role === Role.Volunteer ? (formData.areaOfInterest || null) : null,
        availability: formData.role === Role.Volunteer ? (formData.availability || null) : null,
        emergencyContactNumber: formData.role === Role.Volunteer ? (formData.emergencyContactNumber || null) : null,
        skillsCertifications: formData.role === Role.Volunteer ? (formData.skillsCertifications || null) : null,
        previousExperience: formData.role === Role.Volunteer ? (formData.previousExperience || null) : null,
        willingToRelocate: formData.role === Role.Volunteer ? !!formData.willingToRelocate : null,
        preferredLocation: formData.role === Role.Volunteer ? (formData.preferredLocation || null) : null,
    };

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Please log in.';
        this.registerForm.reset({ role: Role.Volunteer, willingToRelocate: false });
        this.onRoleChange();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || 'Registration failed. The email might already be taken, or there was a server error.';
        console.error('Registration error:', err);
      }
    });
  }
}