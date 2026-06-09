import type { DetectionResult } from '@varmanai/core';

export type MessageType =
  | 'SCAN_TEXT'
  | 'SCAN_RESULT'
  | 'GET_STATUS'
  | 'STATUS_RESPONSE'
  | 'USAGE_UPDATE'
  | 'AUTH_TOKEN'
  | 'SIGN_OUT'
  | 'OPEN_TAB';

export interface ScanTextMessage {
  type: 'SCAN_TEXT';
  payload: { text: string; site: string };
}

export interface ScanResultMessage {
  type: 'SCAN_RESULT';
  payload: DetectionResult & { usage?: { used: number; limit: number; remaining: number } };
}

export interface GetStatusMessage {
  type: 'GET_STATUS';
}

export interface StatusResponseMessage {
  type: 'STATUS_RESPONSE';
  payload: {
    authenticated: boolean;
    online: boolean;
    usage: { used: number; limit: number; remaining: number };
  };
}

export interface UsageUpdateMessage {
  type: 'USAGE_UPDATE';
  payload: { used: number; limit: number; remaining: number };
}

export interface AuthTokenMessage {
  type: 'AUTH_TOKEN';
  payload: { token: string };
}

export interface SignOutMessage {
  type: 'SIGN_OUT';
}

export interface OpenTabMessage {
  type: 'OPEN_TAB';
  payload: { url: string };
}

export type ExtensionMessage =
  | ScanTextMessage
  | ScanResultMessage
  | GetStatusMessage
  | StatusResponseMessage
  | UsageUpdateMessage
  | AuthTokenMessage
  | SignOutMessage
  | OpenTabMessage;
