import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'VarmanAI — Armor for your AI',
  version: '1.0.0',
  description: 'Scans messages to AI chatbots, blocking prompt injection, harmful content, and data leaks. Built for India.',
  permissions: ['storage', 'activeTab'],
  host_permissions: [
    'https://chatgpt.com/*',
    'https://chat.openai.com/*',
    'https://gemini.google.com/*',
    'https://claude.ai/*',
    'https://copilot.microsoft.com/*',
    'https://www.perplexity.ai/*',
  ],
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [
        'https://chatgpt.com/*',
        'https://chat.openai.com/*',
        'https://gemini.google.com/*',
        'https://claude.ai/*',
        'https://copilot.microsoft.com/*',
        'https://www.perplexity.ai/*',
      ],
      js: ['src/content/index.ts'],
      run_at: 'document_idle',
    },
    {
      // Account-connect bridge: only on the VarmanAI connect page.
      matches: [
        'https://varmanai.com/extension/connect*',
        'https://www.varmanai.com/extension/connect*',
        'http://localhost:3000/extension/connect*',
      ],
      js: ['src/content/bridge.ts'],
      run_at: 'document_idle',
    },
  ],
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: {
      '16': 'src/assets/icon-16.png',
      '48': 'src/assets/icon-48.png',
      '128': 'src/assets/icon-128.png',
    },
  },
  options_page: 'src/options/index.html',
  icons: {
    '16': 'src/assets/icon-16.png',
    '48': 'src/assets/icon-48.png',
    '128': 'src/assets/icon-128.png',
  },
});
