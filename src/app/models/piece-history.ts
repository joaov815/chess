import { Piece } from "./piece";

export interface IPieceHistory {
  piece: Piece;
  createdAt: Date;
  currentColumn: number;
  currentRow: number;
  previousColumn: number;
  previousRow: number;
  round: number;
}
