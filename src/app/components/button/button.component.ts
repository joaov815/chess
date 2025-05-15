import { Component, input } from '@angular/core';

@Component({
  selector: 'chess-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  label = input<string>();
  type = input<"button" | "submit">("button");
}
