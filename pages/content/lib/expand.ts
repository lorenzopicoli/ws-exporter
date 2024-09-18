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
        if (element.getAttribute('aria-expanded') === 'false') {
          element.click();
        }
      }
    }
  });
}
