import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { GameService } from './game.service';
import { getBoardSquares, Square } from './models/square';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private readonly gameService: GameService) {}

  form = new FormGroup({
    username: new FormControl('', Validators.minLength(3)),
  });

  squares = signal<Square[]>([]);

  ngOnInit() {
    this.squares.set(getBoardSquares());
  }

  test() {
    this.gameService.move();
  }

  connect() {
    this.gameService.connect(this.form.value.username!);
  }
}
