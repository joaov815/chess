import { Piece, PieceColorEnum, PieceEnum } from './piece';

export class Square {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number
  ) {}

  get position(): string {
    return `${this.rowIndex}${this.columnIndex}`;
  }

  get chessPosition(): string {
    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    return `${columns[this.columnIndex]}${this.rowIndex + 1}`;
  }

  get isBlack(): boolean {
    return (this.rowIndex + this.columnIndex) % 2 == 0;
  }
}

export function getBoardSquares(color: PieceColorEnum): [string, Square][] {
  const squares: [string, Square][] = [];

  const setSquares = (i: number) => {
    for (let j = 0; j < 8; j++) {
      const sq = new Square(i, j);
      squares.push([sq.position, sq]);
    }
  };

  if (color === PieceColorEnum.WHITE) {
    for (let i = 7; i >= 0; i--) {
      setSquares(i);
    }
  } else {
    for (let i = 0; i < 8; i++) {
      setSquares(i);
    }
  }

  return squares;
}

export function getInitialPositions(): Record<string, Piece> {
  const piecesPerPosition: Record<string, Piece> = {};

  for (let i = 0; i < 16; i++) {
    const isWhite = i < 8;
    const row = isWhite ? 1 : 6;
    const column = isWhite ? i : i - 8;
    const position = `${row}${column}`;

    piecesPerPosition[position] = new Piece(
      isWhite ? PieceColorEnum.WHITE : PieceColorEnum.BLACK,
      PieceEnum.PAWN,
      column,
      row
    );
  }

  const piecesValues = [PieceEnum.ROOK, PieceEnum.KNIGHT, PieceEnum.BISHOP];

  for (let j = 0; j < piecesValues.length; j++) {
    for (let i = 0; i < 4; i++) {
      const isWhite = i < 2;
      const column = i % 2 == 0 ? j : 7 - j;
      const row = isWhite ? 0 : 7;
      const position = `${row}${column}`;

      piecesPerPosition[position] = new Piece(
        isWhite ? PieceColorEnum.WHITE : PieceColorEnum.BLACK,
        piecesValues[j],
        column,
        row
      );
    }
  }

  for (let i = 0; i < 4; i++) {
    const isWhite = i < 2;
    const isEven = i % 2 == 0;
    const column = isEven ? 3 : 4;
    const row = isWhite ? 0 : 7;
    const position = `${row}${column}`;

    piecesPerPosition[position] = new Piece(
      isWhite ? PieceColorEnum.WHITE : PieceColorEnum.BLACK,
      isEven ? PieceEnum.QUEEN : PieceEnum.KING,
      column,
      row
    );
  }

  return piecesPerPosition;
}
