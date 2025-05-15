import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

import { ConnectionStatus, MatchService } from '../services/match.service';

export const registerGuard: CanActivateChildFn = () => {
  const matchService = inject(MatchService);
  const router = inject(Router);

  const isConnected =
    matchService.connectionStatus !== ConnectionStatus.DISCONNECTED;

  if (!isConnected) {
    router.navigateByUrl('register');
  }

  return isConnected;
};
