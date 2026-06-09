import type { SiteAdapter } from './base';

export const copilotAdapter: SiteAdapter = {
  name: 'copilot',

  getInputElement() {
    try {
      return document.querySelector<HTMLElement>('textarea, [contenteditable="true"]');
    } catch {
      return null;
    }
  },

  getInputText(el: HTMLElement): string {
    try {
      if (el instanceof HTMLTextAreaElement) return el.value;
      return el.innerText ?? el.textContent ?? '';
    } catch {
      return '';
    }
  },

  getSendButton() {
    try {
      return document.querySelector<HTMLElement>('button[aria-label="Submit"], button[type="submit"]');
    } catch {
      return null;
    }
  },

  observeInput(callback: (text: string) => void) {
    try {
      const target = this.getInputElement();
      if (!target) return null;

      if (target instanceof HTMLTextAreaElement) {
        target.addEventListener('input', () => {
          const text = target.value;
          if (text.trim()) callback(text);
        });
        return null;
      }

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
