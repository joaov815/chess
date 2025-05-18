import { PieceColorEnum } from './piece';

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
}
