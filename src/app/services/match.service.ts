import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

import { environment } from '../../enviroments/environment';
import { MatchRequestTypeEnum } from '../models/socket-base-request';
import {
  IMatchStartedResponse,
  ISocketBaseResponse,
  MatchResponseTypeEnum,
} from '../models/socket-base-response copy';
import { filter, Observable } from 'rxjs';
import { PieceColorEnum } from '../models/piece';
import { Router } from '@angular/router';

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
  constructor(private readonly _router: Router) {}

  private _socket$!: WebSocketSubject<any>;

  socketConnection$?: Observable<ISocketBaseResponse>;
  connectionStatus = ConnectionStatus.DISCONNECTED;
  myColor?: PieceColorEnum;

  connect({ username, onConnected }: IConnectOptions) {
    if (this.connectionStatus !== ConnectionStatus.DISCONNECTED) return;

    this.connectionStatus = ConnectionStatus.CONNECTING;

    this._socket$ = webSocket({
      url: `${environment.url}/ws`,
      openObserver: {
        next: () => {
          this.connectionStatus = ConnectionStatus.CONNECTED;
          console.info('Connected 🟢');

          onConnected?.();
        },
      },
      closeObserver: {
        next: () => {
          this.connectionStatus = ConnectionStatus.DISCONNECTED;
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

        this._router.navigate(['play']);
      }
    });

    // Register
    this._socket$.next({
      type: MatchRequestTypeEnum.MATCHMAKING,
      username,
    });
  }
}
