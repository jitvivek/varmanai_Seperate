export interface StoredAuth {
  token: string;
  expiresAt: number;
}

export interface StoredUsage {
  used: number;
  limit: number;
  date: string;
}
