import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonComponent } from '../../components/button/button.component';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'chess-login',
  imports: [NgClass, ReactiveFormsModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private readonly _matchService: MatchService) {}

  form = new FormGroup({
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
  });
  isSubmitted = signal(false);

  getErrorMessage(control: FormControl): string {
    const errorsMessagesPerKey: Record<string, (...args: any) => string> = {
      required: () => 'Required field',
      minlength: (obj: any) =>
        `Should be at least ${obj.requiredLength} characters`,
    };

    const firstError = Object.entries(control.errors ?? {})[0];

    if (!firstError) return '';

    return errorsMessagesPerKey[firstError[0]](firstError[1]) ?? '';
  }

  submit(): void {
    this.isSubmitted.set(true);

    if (this.form.invalid) return;

    this._matchService.connect(this.form.value.username!, (a) => {
      console.log(a);
    });
  }
}
