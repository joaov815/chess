import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { environment } from '../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class GameService {
  private _socket$!: WebSocketSubject<any>;

  connect(username: string) {
    this._socket$ = webSocket({
      url: `${environment.url}/ws`,
      openObserver: {
        next: () => {
          console.log('Connected 🟢');
        },
      },
      closeObserver: {
        next: () => {
          console.log('Disconnected 🔴');
        },
      },
    });

    this._socket$.asObservable().subscribe((a) => {
      console.log(a);
    });

    this._socket$.next({
      type: 0,
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
