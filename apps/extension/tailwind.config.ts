import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        varman: {
          ink: '#0A1330',
          'ink-2': '#111C44',
          steel: '#1E2A52',
          cyan: '#22D3EE',
          'cyan-deep': '#0891B2',
          gold: '#F5B544',
          safe: '#34D399',
          warn: '#FBBF24',
          danger: '#F43F5E',
          mist: '#E2E8F5',
          fog: '#8B98C9',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
