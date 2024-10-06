import '@src/Popup.css';
import { withSuspense } from './withSuspense';
import { withErrorBoundary } from './withErrorBoundary';
import '@src/Popup.css';

const Popup = () => {
  const logo = 'popup/logo_light.svg';

  const handleExport = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    await chrome.tabs.sendMessage(tab.id!, { type: 'export' });
  };

  return (
    <div className="background min-h-screen p-4">
      <div className="text-center pt-5">
        <img src={chrome.runtime.getURL(logo)} className="w-20 h-20 mx-auto mb-2" alt="logo" />
      </div>
      <div className="text p-4">
        <p className="text text-sm headerText">Export your transactions in just a few simple steps:</p>
        <br />
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Navigate to any of your accounts</li>
          <li>Click on "View all transactions"</li>
          <li>Use the button below to export</li>
        </ol>
      </div>
      <button className="button font-semibold rounded transition duration-150 ease-in-out" onClick={handleExport}>
        ↓ Export Transactions
      </button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
