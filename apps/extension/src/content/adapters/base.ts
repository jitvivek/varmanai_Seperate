export interface SiteAdapter {
  name: string;
  getInputElement(): HTMLElement | null;
  getInputText(el: HTMLElement): string;
  getSendButton(): HTMLElement | null;
  observeInput(callback: (text: string) => void): MutationObserver | null;
}
