import { setupInterceptor } from './interceptor';

function init() {
  setupInterceptor();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
