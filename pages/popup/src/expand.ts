export async function expand() {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

  await chrome.scripting
    .executeScript({
      target: { tabId: tab.id! },
      func: run,
    })
    .catch(err => {
      if (err.message.includes('Cannot access a chrome:// URL')) {
        alert('You cannot inject script here!');
      }
    });
}

/**
 * Tries to match with each transaction's button header element which can
 * be clicked to reveal the transaction details.
 */
async function run() {
  const elements = document.querySelectorAll('[role="button"]');
  const headerRegex = /-header$/;

  elements.forEach(element => {
    if (headerRegex.test(element.id)) {
      if (element instanceof HTMLElement) {
        element.click();
      }
    }
  });
}
