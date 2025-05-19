import { Piece, PieceColorEnum } from './piece';
import { IPieceHistory } from './piece-history';

export enum MatchResponseTypeEnum {
  PING,
  MATCH_STARTED,
  RECONNECTED,
  MOVE,
  AVAILABLE_POSITIONS,
  INVALID_MOVE,
  INVALID,
}

export interface ISocketBaseResponse {
  type: MatchResponseTypeEnum;
}

export interface IMatchStartedResponse extends ISocketBaseResponse {
  color: PieceColorEnum;
  pieces: Piece[];
  blackUsername: string;
  whiteUsername: string;
}

export interface IMatchState {
  color: PieceColorEnum;
  piecesPerPosition: Record<string, Piece>;
  blackUsername: string;
  whiteUsername: string;
}

export interface IMoveResponse extends ISocketBaseResponse {
  history: IPieceHistory;
  capturedEnPassantPawn?: string;
}
