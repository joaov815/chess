import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

import { environment } from '../../enviroments/environment';
import { MatchRequestTypeEnum } from '../models/socket-base-request';
import {
  ISocketBaseResponse,
  MatchResponseTypeEnum,
} from '../models/socket-base-response copy';

enum ConnectionStatus {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
}

@Injectable({ providedIn: 'root' })
export class MatchService {
  private _socket$!: WebSocketSubject<any>;
  connectionStatus = ConnectionStatus.DISCONNECTED;

  connect(username: string, onMessageCb: (body: ISocketBaseResponse) => void) {
    if (this.connectionStatus !== ConnectionStatus.DISCONNECTED) return;

    this.connectionStatus = ConnectionStatus.CONNECTING;

    this._socket$ = webSocket({
      url: `${environment.url}/ws`,
      openObserver: {
        next: () => {
          this.connectionStatus = ConnectionStatus.CONNECTED;
          sessionStorage.setItem('username', username);
          console.info('Connected 🟢');
        },
      },
      closeObserver: {
        next: () => {
          this.connectionStatus = ConnectionStatus.DISCONNECTED;
          console.info('Disconnected 🔴');
        },
      },
    });

    this._socket$.asObservable().subscribe((message: ISocketBaseResponse) => {
      if (message.type === MatchResponseTypeEnum.PING) return;

      onMessageCb(message);
    });

    // Register
    this._socket$.next({
      type: MatchRequestTypeEnum.MATCHMAKING,
      username,
    });
  }

  move() {
    this._socket$.next({
      type: 1,
      fromColumn: 4,
      fromRow: 1,
      toColumn: 4,
      toRow: 3,
    });
  }
}
