import type { SiteAdapter } from './base';

export const claudeAdapter: SiteAdapter = {
  name: 'claude',

  getInputElement() {
    try {
      return document.querySelector<HTMLElement>('[contenteditable="true"].ProseMirror, div[contenteditable="true"]');
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
      return document.querySelector<HTMLElement>('button[aria-label="Send Message"], button[type="submit"]');
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
