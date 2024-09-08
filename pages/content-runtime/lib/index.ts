import { expand } from '@lib/expand';
import { exportTransactions } from '@lib/export';

chrome.runtime.onMessage.addListener(async message => {
  switch (message.type) {
    case 'expand':
      await expand();
      break;
    case 'export':
      await exportTransactions();
      break;
    default:
      break;
  }

  return Promise.resolve();
});
