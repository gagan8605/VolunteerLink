import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for ngModel

@Component({
  selector: 'app-consent-modal',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import FormsModule
  templateUrl: './consent-modal.component.html',
  styleUrls: ['./consent-modal.component.css']
})
export class ConsentModalComponent {
  @Input() eventTitle: string | undefined = 'the Event';
  @Output() confirmApply = new EventEmitter<void>();
  @Output() cancelConsent = new EventEmitter<void>();

  agreed: boolean = false;
  showAgreementError: boolean = false;

  // Define the consent points
  consentPoints: string[] = [
    "I understand this is a volunteer position and, unless explicitly stated otherwise (e.g., stipend), is unpaid.",
    "I agree to abide by the rules and code of conduct set forth by the event organizer.",
    "I understand that my application is subject to review and approval by the event organizer.",
    "I will perform my assigned volunteer duties to the best of my ability.",
    "I will arrive on time for my scheduled shifts and notify the organizer promptly if I am unable to attend.",
    "I understand the event organizer may provide specific training or instructions which I agree to follow.",
    "I agree to maintain a positive and respectful attitude towards fellow volunteers, staff, and event attendees.",
    "I understand the nature of the tasks involved and confirm I am physically and mentally capable of performing them.",
    "I consent to the organizer contacting me via the email or phone number provided in my profile regarding this event.",
    "I understand that photographs or videos may be taken during the event for promotional purposes by the organizer.",
    "I acknowledge the cancellation policy: I must cancel my signup at least 12 hours before the event starts if I cannot attend.",
    "I will represent the organizing body in a professional and courteous manner while volunteering.",
    "I understand that failure to adhere to the rules may result in dismissal from my volunteer role.",
    "I agree to report any safety concerns or incidents to the event organizer or designated staff immediately.",
    "I have read and understood all the points mentioned above."
  ];

  onConfirmApply(): void {
    if (this.agreed) {
      this.showAgreementError = false;
      this.confirmApply.emit();
    } else {
      this.showAgreementError = true; // Show error if not agreed
    }
  }

  onCancel(): void {
    this.cancelConsent.emit();
  }

  closeModal(): void {
       this.onCancel(); // Treat closing via 'x' as cancellation
  }
}