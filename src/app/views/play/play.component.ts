import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { filter } from 'rxjs';

import { getBoardSquares, Square } from '../../models/square';
import { Piece, PieceColorEnum } from '../../models/piece';
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
  squaresPerPosition: Record<string, Square> = {};
  piecesPerPosition = signal<Record<string, Piece>>({});
  mySelectedPiecePosition = signal<string | null>(null);
  lastPlayedFrom = signal<string | null>(null);
  lastPlayedTo = signal<string | null>(null);
  isMyTurn = signal(true); // TODO:
  availablePlayPositions = signal<string[]>([]);
  myColor = signal<PieceColorEnum | null>(null);

  rows = computed(() => {
    const rows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    return this.myColor() == PieceColorEnum.WHITE ? rows.reverse() : rows;
  });

  columns = computed(() => {
    const columns = Array.from({ length: 8 }, (_, i) => i + 1);

    return this.myColor() == PieceColorEnum.WHITE ? columns : columns.reverse();
  });

  highlighted = computed(() => [
    this.mySelectedPiecePosition(),
    this.lastPlayedFrom(),
    this.lastPlayedTo(),
  ]);

  ngOnInit(): void {
    this._matchService.state$
      .pipe(filter((state) => state !== null))
      .subscribe((state) => {
        const boardSquares = getBoardSquares(state.color);

        this.myColor.set(state.color);
        this.squares.set(boardSquares.map((s) => s[1]));
        this.squaresPerPosition = Object.fromEntries(boardSquares);

        this.piecesPerPosition.set(state.piecesPerPosition);
      });

    this._matchService.availablePositions$?.subscribe((positions) => {
      this.availablePlayPositions.set(positions ?? []);
    });

    this._matchService.move$?.subscribe((res) => {
      if (!res) return;

      const { history: move, capturedEnPassantPawn } = res;
      const piecePos = `${move.previousRow}${move.previousColumn}`;

      this.piecesPerPosition.update((ppp) => {
        const piece = ppp[piecePos];

        this.isMyTurn.set(piece.color !== this.myColor());

        piece.updatePosition(move.currentRow, move.currentColumn);

        ppp[piece.position] = piece;

        delete ppp[piecePos];

        if (capturedEnPassantPawn && ppp[capturedEnPassantPawn]) {
          delete ppp[capturedEnPassantPawn];
        }

        return ppp;
      });
    });
  }

  selectOrMovePiece(position: string): void {
    const selected = this.piecesPerPosition()[position];

    if (
      this.mySelectedPiecePosition() != null &&
      (!selected || selected.color !== this.myColor())
    ) {
      this.move(position);
    } else if (selected.color == this.myColor()) {
      this.mySelectedPiecePosition.set(position);
      this._matchService.getPieceAvailablePositions(selected);
    }
  }

  move(toPosition: string): void {
    if (!this.isMyTurn() || this.mySelectedPiecePosition() == null) {
      return;
    }

    this._matchService.move(
      this.squaresPerPosition[this.mySelectedPiecePosition()!],
      this.squaresPerPosition[toPosition]
    );
  }

  getPieceAvailablePositions(position: string): void {
    this._matchService.getPieceAvailablePositions(
      this.piecesPerPosition()[position]
    );
  }
}
