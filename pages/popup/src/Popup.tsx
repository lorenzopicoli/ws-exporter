import '@src/Popup.css';
import { withSuspense } from './withSuspense';
import { withErrorBoundary } from './withErrorBoundary';

const Popup = () => {
  const logo = 'popup/new-light-no-bg.png';

  const handleExport = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    await chrome.tabs.sendMessage(tab.id!, { type: 'export' });
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="text-center">
            <img src={chrome.runtime.getURL(logo)} className="w-16 h-16 mx-auto mb-2" alt="logo" />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Export your transactions in just a few simple steps:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Navigate to any of your accounts</li>
              <li>Click on "View all transactions"</li>
              <li>Use the button below to export</li>
            </ol>
          </div>
        </div>
        <div className="p-6 bg-gray-750">
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
            onClick={handleExport}>
            ↓ Export Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
