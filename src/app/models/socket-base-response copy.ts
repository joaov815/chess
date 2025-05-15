import { PieceColorEnum } from "./piece";

export enum MatchResponseTypeEnum {
  PING,
  MATCH_STARTED,
  RECONNECTED,
}

export interface ISocketBaseResponse {
  type: MatchResponseTypeEnum;
}

export interface IMatchStartedResponse extends ISocketBaseResponse {
  color: PieceColorEnum;
}
