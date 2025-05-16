import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

import { environment } from '../../enviroments/environment';
import { MatchRequestTypeEnum } from '../models/socket-base-request';
import {
  IMatchStartedResponse,
  ISocketBaseResponse,
  MatchResponseTypeEnum,
} from '../models/socket-base-response';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Piece, PieceColorEnum } from '../models/piece';
import { Router } from '@angular/router';
import { Square } from '../models/square';
import { IMovePayload } from '../models/payloads/move-payload';
import { IGetAvailablePositionsPayload } from '../models/payloads/get-available-positions-payload';

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
  myColor?: PieceColorEnum;
  myColor$ = new BehaviorSubject<PieceColorEnum | null>(null);

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

    this.socketConnection$ = this._socket$
      .asObservable()
      .pipe(
        filter(
          (message: ISocketBaseResponse) =>
            message.type !== MatchResponseTypeEnum.PING
        )
      );

    this.socketConnection$.subscribe((message: ISocketBaseResponse) => {
      if (
        [
          MatchResponseTypeEnum.MATCH_STARTED,
          MatchResponseTypeEnum.RECONNECTED,
        ].includes(message.type)
      ) {
        const ongoingGameMessage = <IMatchStartedResponse>message;

        this.myColor = ongoingGameMessage.color;
        this.myColor$.next(this.myColor);

        this._router.navigate(['play']);
      }
    });

    // Register
    this._socket$.next({
      type: MatchRequestTypeEnum.MATCHMAKING,
      username,
    });
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
