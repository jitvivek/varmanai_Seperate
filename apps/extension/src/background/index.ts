import './messageRouter';
import { updateBadge } from './badgeManager';

// Initialize extension badge on install
chrome.runtime.onInstalled.addListener(() => {
  updateBadge('idle');
});
