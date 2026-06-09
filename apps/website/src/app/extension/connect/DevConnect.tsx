'use client';

import ConnectPanel from './ConnectPanel';

/**
 * Dev-mode connect flow (no Clerk keys configured). The backend auto-auths as
 * `dev_user_local`, so no token is needed.
 */
export default function DevConnect() {
  return <ConnectPanel getToken={async () => null} />;
}
