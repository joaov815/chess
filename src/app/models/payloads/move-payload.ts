import { ISocketBaseRequest } from "../socket-base-request";

export interface IMovePayload extends ISocketBaseRequest {
  fromRow: number;
  fromColumn: number;
  toColumn: number;
  toRow: number;
}
