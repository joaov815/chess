import { Square } from './square';

export enum PieceColorEnum {
  WHITE,
  BLACK,
}

export enum PieceEnum {
  PAWN,
  KNIGHT,
  BISHOP,
  ROOK,
  QUEEN,
  KING,
}

export class Piece {
  constructor(
    public readonly color: PieceColorEnum,
    public readonly value: PieceEnum,
    public readonly square: Square
  ) {
    this.row = square.rowIndex;
    this.column = square.columnIndex;
  }

  public readonly column: number;
  public readonly row: number;

  get image(): string {
    const colorInitial = this.color == PieceColorEnum.WHITE ? 'w' : 'b';
    const pieceInitial = {
      [PieceEnum.PAWN]: 'p',
      [PieceEnum.KNIGHT]: 'n',
      [PieceEnum.BISHOP]: 'b',
      [PieceEnum.ROOK]: 'r',
      [PieceEnum.QUEEN]: 'q',
      [PieceEnum.KING]: 'k',
    }[this.value];

    return `${colorInitial}${pieceInitial}.png`;
  }
}
