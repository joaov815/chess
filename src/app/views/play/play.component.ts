import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';

import {
  getBoardSquares,
  getInitialPositions,
  Square,
} from '../../models/square';
import { Piece } from '../../models/piece';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'chess-play',
  imports: [NgClass],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {
  constructor(private readonly _matchService: MatchService) {}

  squares = signal<Square[]>([]);
  pieces = signal<Record<string, Piece>>({});

  ngOnInit() {
    const color = this._matchService.myColor!;

    this.squares.set(getBoardSquares(color));
    this.pieces.set(getInitialPositions(this.squares()));
  }
}
