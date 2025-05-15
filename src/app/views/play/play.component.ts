import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';

import { GameService } from '../../game.service';
import { getBoardSquares, Square } from '../../models/square';

@Component({
  selector: 'chess-play',
  imports: [NgClass],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent {
 constructor(private readonly gameService: GameService) {}

  squares = signal<Square[]>([]);

  ngOnInit() {
    this.squares.set(getBoardSquares());
  }

  test() {
    this.gameService.move();
  }

  // connect() {
  //   this.gameService.connect(this.form.value.username!);
  // }
}
