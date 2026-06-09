export function updateBadge(verdict: 'safe' | 'suspicious' | 'malicious' | 'idle'): void {
  try {
    const colors: Record<string, string> = {
      safe: '#34D399',
      suspicious: '#FBBF24',
      malicious: '#F43F5E',
      idle: '#22D3EE',
    };

    const texts: Record<string, string> = {
      safe: '✓',
      suspicious: '!',
      malicious: '✗',
      idle: '',
    };

    chrome.action.setBadgeBackgroundColor({ color: colors[verdict] ?? '#22D3EE' });
    chrome.action.setBadgeText({ text: texts[verdict] ?? '' });
  } catch {
    // Badge API unavailable
  }
}
