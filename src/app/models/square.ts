export class Square {
  constructor(public rowIndex: number, public columnIndex: number) {}

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

export function getBoardSquares(): Square[] {
  const squares: Square[] = [];

  for (let i = 7; i >= 0; i--) {
    for (let j = 0; j < 8; j++) {
      squares.push(new Square(i, j));
    }
  }

  return squares;
}
