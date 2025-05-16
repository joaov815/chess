export enum MatchRequestTypeEnum {
  MATCHMAKING,
  MOVE,
  GET_PIECE_AVAILABLE_POSITIONS,
}

export interface ISocketBaseRequest {
  type: MatchRequestTypeEnum;
}
