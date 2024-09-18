import 'webextension-polyfill';
import { expand } from '@lib/expand';
import { exportTransactions } from '@lib/export';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.runtime.onMessage.addListener(async message => {
  switch (message.type) {
    case 'expand':
      //   await expand();
      break;
    case 'export':
      await expand();
      // There are api calls that are made to fetch the transaction details
      // which may take some time to complete. So, we wait for a couple seconds
      await delay(2000);
      await exportTransactions();
      break;
    default:
      break;
  }

  return Promise.resolve();
});
