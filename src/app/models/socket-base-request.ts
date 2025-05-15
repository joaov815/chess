export enum MatchRequestTypeEnum {
  MATCHMAKING,
  MOVE,
}

export interface ISocketBaseRequest {
  type: MatchRequestTypeEnum;
}
