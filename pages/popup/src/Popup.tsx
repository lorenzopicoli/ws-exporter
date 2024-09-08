import '@src/Popup.css';
import { type ComponentPropsWithoutRef } from 'react';
import { withSuspense } from './withSuspense';
import { withErrorBoundary } from './withErrorBoundary';

const Popup = () => {
  const logo = 'popup/logo_vertical.svg';

  return (
    <div className={`App bg-slate-50`}>
      <header className={`App-header text-gray-900`}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        <p>
          Edit <code>pages/popup/src/Popup.tsx</code>
        </p>
        <Button
          onClick={async () => {
            // await injectContentScript();
            const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
            await chrome.tabs.sendMessage(tab.id!, { type: 'export' });
          }}>
          Export transactions
        </Button>
        <Button
          onClick={async () => {
            // await injectContentScript();
            const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
            await chrome.tabs.sendMessage(tab.id!, { type: 'expand' });
          }}>
          Expand transactions
        </Button>
      </header>
    </div>
  );
};

const Button = (props: ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      className={
        props.className + ' ' + 'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' + 'bg-black text-white'
      }
      onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
