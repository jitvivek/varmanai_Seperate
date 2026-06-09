import type { SiteAdapter } from './base';

export const genericAdapter: SiteAdapter = {
  name: 'generic',

  getInputElement() {
    try {
      return document.querySelector<HTMLElement>(
        'textarea:focus, [contenteditable="true"]:focus, textarea, [contenteditable="true"]'
      );
    } catch {
      return null;
    }
  },

  getInputText(el: HTMLElement): string {
    try {
      if (el instanceof HTMLTextAreaElement) return el.value;
      if (el instanceof HTMLInputElement) return el.value;
      return el.innerText ?? el.textContent ?? '';
    } catch {
      return '';
    }
  },

  getSendButton() {
    try {
      return document.querySelector<HTMLElement>('button[type="submit"], button[aria-label="Send"]');
    } catch {
      return null;
    }
  },

  observeInput(callback: (text: string) => void) {
    try {
      const target = this.getInputElement();
      if (!target) return null;

      if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
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
