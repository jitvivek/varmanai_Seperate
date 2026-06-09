import type { SiteAdapter } from './base';

export const chatgptAdapter: SiteAdapter = {
  name: 'chatgpt',

  getInputElement() {
    try {
      return document.querySelector<HTMLElement>('#prompt-textarea, [contenteditable="true"][data-id="root"]');
    } catch {
      return null;
    }
  },

  getInputText(el: HTMLElement): string {
    try {
      return el.innerText ?? el.textContent ?? '';
    } catch {
      return '';
    }
  },

  getSendButton() {
    try {
      return document.querySelector<HTMLElement>('[data-testid="send-button"], button[aria-label="Send prompt"]');
    } catch {
      return null;
    }
  },

  observeInput(callback: (text: string) => void) {
    try {
      const target = this.getInputElement();
      if (!target) return null;

      const observer = new MutationObserver(() => {
        const text = this.getInputText(target);
        if (text.trim()) callback(text);
      });

      observer.observe(target, { childList: true, subtree: true, characterData: true });
      return observer;
    } catch {
      return null;
    }
  },
};
