import { Component, input } from '@angular/core';

@Component({
  selector: 'chess-username-badge',
  template: `
    <div class="badge">
      <img src="chess_default.gif" alt="user image" height="40" />
      <div>{{ name() }}</div>
    </div>
  `,
  styles: `
    .badge {
      display: flex;
      column-gap: 0.5rem;
      color: #fff;
      padding: 1rem 1.125rem;
    }
  `,
})
export class UsernameBadgeComponent {
  name = input.required<string | null>();
}
