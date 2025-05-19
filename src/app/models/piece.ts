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
    public column: number,
    public row: number
  ) {}

  updatePosition(row: number, column: number): void {
    this.row = row;
    this.column = column;
  }

  get position(): string {
    return `${this.row}${this.column}`;
  }

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
