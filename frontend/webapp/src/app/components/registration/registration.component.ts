import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Guest } from '../../models/guest.model';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  @Output() formSubmitted = new EventEmitter<any>();  // Add an output event emitter

  @Input() guestId!: number;
  @Input() registeredGuest: Guest | undefined;
  guestForm!: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.guestForm = this.fb.group({
      firstName: [this.registeredGuest ? this.registeredGuest.firstName : '', Validators.required],
      lastName: [this.registeredGuest ? this.registeredGuest.lastName : '', Validators.required],
      foodPreferences: [this.registeredGuest ? this.registeredGuest.foodPreference : ''],
      allergi: [this.registeredGuest ? this.registeredGuest.allergi : ''],
      guestId: this.guestId
    });
  }

  onSubmit(): void {
    if (this.guestForm.valid) {
      this.formSubmitted.emit(this.guestForm.value);
      this.submitted = true;
      // Perform your submission logic here, e.g., send data to the server
    } else {
      console.log('Form is not valid');
    }
  }
}
