export enum MatchResponseTypeEnum {
  PING,
  MATCH_STARTED,
  RECONNECTED,
}

export interface ISocketBaseResponse {
  type: MatchResponseTypeEnum;
}
