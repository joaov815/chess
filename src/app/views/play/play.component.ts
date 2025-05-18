import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { filter, switchMap } from 'rxjs';

import {
  getBoardSquares,
  getInitialPositions,
  Square,
} from '../../models/square';
import { Piece } from '../../models/piece';
import { MatchService } from '../../services/match.service';
import { MatchResponseTypeEnum } from '../../models/socket-base-response';
import { IAvailablePositions } from '../../models/response/available-positions-response';

@Component({
  selector: 'chess-play',
  imports: [NgClass],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {
  constructor(private readonly _matchService: MatchService) {}

  squares = signal<Square[]>([]);
  piecesPerPosition = signal<Record<string, Piece>>({});
  mySelectedPieceIdx = signal<number | null>(null);
  lastPlayedFrom = signal<string | null>(null);
  lastPlayedTo = signal<string | null>(null);
  isMyTurn = signal(true); // TODO:
  availablePlayPositions = signal<string[]>([]);

  piecesPerSquareIdx = computed<Record<number, Piece>>(() => {
    return Object.fromEntries(
      Object.values(this.piecesPerPosition()).map((piece) => [
        piece.square.index,
        piece,
      ])
    );
  });

  highlighted = computed(() => [
    this.mySelectedPieceIdx(),
    this.lastPlayedFrom(),
    this.lastPlayedTo(),
  ]);

  ngOnInit() {
    this._matchService.myColor$
      .pipe(
        filter((color) => color !== null),
        switchMap((color) => {
          this.squares.set(getBoardSquares(color));
          this.piecesPerPosition.set(getInitialPositions(this.squares()));

          return this._matchService.socketConnection$!;
        })
      )
      .subscribe((res) => {
        if (res.type === MatchResponseTypeEnum.AVAILABLE_POSITIONS) {
          this.availablePlayPositions.set((<IAvailablePositions>res).positions);
        }
        console.log(res);
      });
  }

  selectOrMovePiece(index: number) {
    const selected = this.piecesPerSquareIdx()[index];

    if (this.mySelectedPieceIdx() != null && !selected) {
      this.move(index);
    } else if (selected.color == this._matchService.myColor) {
      this.mySelectedPieceIdx.set(index);
      this._matchService.getPieceAvailablePositions(selected);
    }
  }

  move(toSquareIdx: number): void {
    if (!this.isMyTurn() || this.mySelectedPieceIdx() == null) {
      return;
    }

    this._matchService.move(
      this.squares()[this.mySelectedPieceIdx()!],
      this.squares()[toSquareIdx]
    );
  }

  getPieceAvailablePositions(index: number): void {
    this._matchService.getPieceAvailablePositions(
      this.piecesPerSquareIdx()[index]
    );
  }
}
