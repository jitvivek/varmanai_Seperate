import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'VarmanAI — Armor for your AI';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A1330',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M32 4L58 18V46L32 60L6 46V18L32 4Z" stroke="#22D3EE" strokeWidth="3" fill="none" />
            <path d="M22 22L32 44L42 22" stroke="#F5B544" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ marginLeft: '16px', fontSize: '36px', color: '#E2E8F5', fontWeight: 700 }}>
            VarmanAI
          </span>
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#E2E8F5',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: '20px', fontSize: '24px', color: '#8B98C9' }}>
          Scan every prompt. Block every threat. Built for India.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
