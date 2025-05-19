import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

import { environment } from '../../enviroments/environment';
import { MatchRequestTypeEnum } from '../models/socket-base-request';
import {
  IMatchStartedResponse,
  IMatchState,
  IMoveResponse,
  ISocketBaseResponse,
  MatchResponseTypeEnum,
} from '../models/socket-base-response';
import { Piece } from '../models/piece';
import { getInitialPositions, Square } from '../models/square';
import { IMovePayload } from '../models/payloads/move-payload';
import { IGetAvailablePositionsPayload } from '../models/payloads/get-available-positions-payload';
import { IAvailablePositions } from '../models/response/available-positions-response';

export enum ConnectionStatus {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
}

interface IConnectOptions {
  username: string;
  onConnected?: () => void;
}

@Injectable({ providedIn: 'root' })
export class MatchService {
  constructor(private readonly _router: Router) {
    const username = sessionStorage.getItem('username');

    if (username) {
      this.connect({ username });
    }
  }

  private _socket$!: WebSocketSubject<any>;

  socketConnection$?: Observable<ISocketBaseResponse>;
  connectionStatus = ConnectionStatus.DISCONNECTED;
  state$ = new BehaviorSubject<IMatchState | null>(null);
  move$ = new BehaviorSubject<IMoveResponse | null>(null);
  availablePositions$ = new BehaviorSubject<string[] | null>(null);

  connect({ username, onConnected }: IConnectOptions) {
    if (this.connectionStatus !== ConnectionStatus.DISCONNECTED) return;

    this.connectionStatus = ConnectionStatus.CONNECTING;

    this._socket$ = webSocket({
      url: `${environment.url}/ws`,
      openObserver: {
        next: () => {
          this.connectionStatus = ConnectionStatus.CONNECTED;
          console.info('Connected 🟢');

          sessionStorage.setItem('username', username);

          onConnected?.();
        },
      },
      closeObserver: {
        next: () => {
          this.connectionStatus = ConnectionStatus.DISCONNECTED;
          sessionStorage.removeItem('username');

          console.info('Disconnected 🔴');
        },
      },
    });

    this.socketConnection$ = this._socket$.asObservable().pipe(
      filter((message: ISocketBaseResponse) => {
        return message.type !== MatchResponseTypeEnum.PING;
      })
    );

    this.socketConnection$.subscribe((message: ISocketBaseResponse) => {
      if (
        [
          MatchResponseTypeEnum.MATCH_STARTED,
          MatchResponseTypeEnum.RECONNECTED,
        ].includes(message.type)
      ) {
        this._onMatchStartedOrReconnected(message);
      } else if (message.type === MatchResponseTypeEnum.MOVE) {
        this.move$.next(<IMoveResponse>message);
      } else if (message.type === MatchResponseTypeEnum.AVAILABLE_POSITIONS) {
        this.availablePositions$.next((<IAvailablePositions>message).positions);
      }
    });

    // Register
    this._socket$.next({
      type: MatchRequestTypeEnum.MATCHMAKING,
      username,
    });
  }

  private _onMatchStartedOrReconnected(message: ISocketBaseResponse): void {
    const ongoingGameMessage = <IMatchStartedResponse>message;
    let piecesPerPosition: Record<string, Piece>;

    if (message.type === MatchResponseTypeEnum.MATCH_STARTED) {
      piecesPerPosition = getInitialPositions();
    } else {
      piecesPerPosition = Object.fromEntries(
        ongoingGameMessage.pieces.map((p) => {
          const piece = new Piece(p.color, p.value, p.column, p.row);
          return [piece.position, piece];
        })
      );
    }

    const state: IMatchState = {
      color: ongoingGameMessage.color,
      piecesPerPosition,
    };

    this.state$.next(state);

    this._router.navigate(['play']);
  }

  move(from: Square, to: Square): void {
    const payload: IMovePayload = {
      type: MatchRequestTypeEnum.MOVE,
      fromColumn: from.columnIndex,
      fromRow: from.rowIndex,
      toColumn: to.columnIndex,
      toRow: to.rowIndex,
    };

    this._socket$.next(payload);
  }

  getPieceAvailablePositions({ row, column }: Piece): void {
    const payload = new IGetAvailablePositionsPayload(row, column);

    this._socket$.next(payload);
  }
}
