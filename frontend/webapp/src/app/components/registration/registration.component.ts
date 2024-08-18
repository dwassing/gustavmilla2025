import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  guestForm!: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.guestForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      foodPreferences: [''],
      allergi: [''],
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
