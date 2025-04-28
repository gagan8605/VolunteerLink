import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile, UserProfileUpdateRequest } from '../../../core/models/profile.model';
import { Role, Gender } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUserProfile: UserProfile | null = null;
  isLoading = true;
  isEditing = false;
  error: string | null = null;
  successMessage: string | null = null;
  currentUserId: number | null = null;
  Role = Role;
  Gender = Gender;
  genders = Object.values(Gender);

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private datePipe = inject(DatePipe);

  constructor() {
     this.profileForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
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
     });
     this.profileForm.disable();
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    if (this.currentUserId) {
      this.loadUserProfile();
    } else {
      this.error = 'Could not identify user to load profile.';
      this.isLoading = false;
    }
  }

  loadUserProfile(): void {
     if (!this.currentUserId) return;
     this.isLoading = true;
     this.error = null;
     this.userService.getUserProfile(this.currentUserId).subscribe({
       next: (profile) => {
         this.currentUserProfile = profile;
         this.populateForm(profile);
         this.isLoading = false;
         this.isEditing = false;
         this.profileForm.disable();
       },
       error: (err) => {
         this.error = 'Failed to load profile information.';
         console.error(err);
         this.isLoading = false;
       }
     });
  }

  populateForm(profile: UserProfile): void {
       const formattedDob = profile.dateOfBirth ? this.datePipe.transform(profile.dateOfBirth, 'yyyy-MM-dd') : null;

       this.profileForm.patchValue({
           fullName: profile.fullName,
           email: profile.email,
           phoneNumber: profile.phoneNumber,
           dateOfBirth: formattedDob,
           gender: profile.gender,
           address: profile.address,
           location: profile.location,
           generalOrgType: profile.generalOrgType,
           designation: profile.adminDetails?.designation,
           organizationName: profile.adminDetails?.organizationName,
           yearsOfExperience: profile.adminDetails?.yearsOfExperience,
           workEmail: profile.adminDetails?.workEmail,
           officeLocation: profile.adminDetails?.officeLocation,
           areaOfInterest: profile.volunteerDetails?.areaOfInterest,
           availability: profile.volunteerDetails?.availability,
           emergencyContactNumber: profile.volunteerDetails?.emergencyContactNumber,
           skillsCertifications: profile.volunteerDetails?.skillsCertifications,
           previousExperience: profile.volunteerDetails?.previousExperience,
           willingToRelocate: profile.volunteerDetails?.willingToRelocate ?? false,
           preferredLocation: profile.volunteerDetails?.preferredLocation
       });
   }

   enableEdit(): void {
       this.isEditing = true;
       this.profileForm.enable();
       // Decide if email should be editable
       this.profileForm.get('email')?.disable(); // Example: Disable email editing
       this.profileForm.get('workEmail')?.disable(); // Example: Disable work email editing
       this.successMessage = null;
       this.error = null;
   }

   cancelEdit(): void {
       this.isEditing = false;
       this.profileForm.disable();
       this.error = null;
       if (this.currentUserProfile) {
           this.populateForm(this.currentUserProfile);
       }
       this.profileForm.markAsPristine();
       this.profileForm.markAsUntouched();
   }

   onSubmit(): void {
       this.error = null;
       this.successMessage = null;

       if (this.profileForm.invalid || !this.currentUserId) {
           this.profileForm.markAllAsTouched();
           this.error = 'Please correct the errors in the form.';
           return;
       }

       this.isLoading = true;
       const formData = this.profileForm.getRawValue(); // Use getRawValue for disabled fields like email
       const updateRequest: UserProfile = {
            id: this.currentUserId!, // Ensure currentUserId is not null
            role: this.currentUserProfile?.role!, // Ensure role is provided
            fullName: formData.fullName,
            email: this.currentUserProfile?.email || formData.email, // Ensure email is included
            phoneNumber: formData.phoneNumber || null,
            dateOfBirth: formData.dateOfBirth || null,
            gender: formData.gender || null,
            address: formData.address || null,
            location: formData.location || null,
            generalOrgType: formData.generalOrgType || null,
           ...(this.currentUserProfile?.role === Role.Admin && {
                designation: formData.designation || null,
                organizationName: formData.organizationName || null,
                yearsOfExperience: formData.yearsOfExperience ?? null,
                // workEmail: formData.workEmail || null, // Exclude if disabled
                officeLocation: formData.officeLocation || null,
            }),
           ...(this.currentUserProfile?.role === Role.Volunteer && {
                areaOfInterest: formData.areaOfInterest || null,
                availability: formData.availability || null,
                emergencyContactNumber: formData.emergencyContactNumber || null,
                skillsCertifications: formData.skillsCertifications || null,
                previousExperience: formData.previousExperience || null,
                willingToRelocate: !!formData.willingToRelocate,
                preferredLocation: formData.preferredLocation || null,
            }),
       };

       this.userService.updateUserProfile(this.currentUserId, updateRequest).subscribe({
          next: (updatedProfile) => {
             this.currentUserProfile = updatedProfile;
             this.isLoading = false;
             this.isEditing = false;
             this.profileForm.disable();
             this.populateForm(updatedProfile); // Repopulate form with potentially processed data
             this.successMessage = 'Profile updated successfully!';
             // Update needs complex state management or refresh to show in header
          },
          error: (err) => {
             this.isLoading = false;
             this.error = err.error?.message || err.error?.error || 'Failed to update profile.';
             console.error('Profile update error:', err);
          }
       });
   }
}