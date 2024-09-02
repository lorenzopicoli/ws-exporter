import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import type { ComponentPropsWithoutRef } from 'react';

const Popup = () => {
  const logo = 'popup/logo_vertical.svg';

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ['/content-runtime/index.iife.js'],
      })
      .catch(err => {
        if (err.message.includes('Cannot access a chrome:// URL')) {
          alert('You cannot inject script here!');
        }
      });
  };

  //   injectContentScript();

  return (
    <div className={`App bg-slate-50`}>
      <header className={`App-header text-gray-900`}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        <p>
          Edit <code>pages/popup/src/Popup.tsx</code>
        </p>
        <Button>Export</Button>
        <Button onClick={injectContentScript}>Run</Button>
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
