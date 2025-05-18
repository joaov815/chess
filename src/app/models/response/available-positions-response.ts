import { ISocketBaseResponse } from '../socket-base-response';

export interface IAvailablePositions extends ISocketBaseResponse {
  positions: string[];
}
