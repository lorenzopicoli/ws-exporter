function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Tries to match with each transaction's button header element which can
 * be clicked to reveal the transaction details.
 */
export async function expand() {
  const elements = document.querySelectorAll('[role="button"]');
  const headerRegex = /-header$/;

  elements.forEach(element => {
    if (headerRegex.test(element.id)) {
      if (element instanceof HTMLElement) {
        element.click();
      }
    }
  });

  // There are api calls that are made to fetch the transaction details
  // which may take some time to complete. So, we wait for a couple seconds
  await delay(2000);
}
