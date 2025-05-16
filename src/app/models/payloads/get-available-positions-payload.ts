import { MatchRequestTypeEnum } from '../socket-base-request';

export class IGetAvailablePositionsPayload {
  constructor(public row: number, public column: number) {}

  readonly type = MatchRequestTypeEnum.GET_PIECE_AVAILABLE_POSITIONS;
}
