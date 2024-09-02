import { isValid, parse } from 'date-fns';
function findElementWithUUIDHeaderXPath() {
  // Select all elements with role='button'
  const elements = document.querySelectorAll('[role="button"]');

  // Regular expression to match any text followed by '-header'
  const headerRegex = /-header$/;

  // Iterate over the elements and check the ID against the regex
  elements.forEach(element => {
    if (headerRegex.test(element.id)) {
      if (element instanceof HTMLElement) {
        element.click();
      }
    }
  });

  return null; // If no matching element is found
}
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const parseRow = (name: string, value?: string) => {
  const normalizedName = name.toLowerCase();
  const parseCurrencyValue = (value: string) => {
    const [sign, amount, currency] = value?.split(' ') ?? [];
    return { amount: parseFloat(amount.replace('$', '')) * (sign === '−' ? -1 : 1), currency };
  };
  //   account: 'Cash';
  //   date: 'July 10, 202411:35 pm';
  //   exchangeRate: '1.4795';
  //   originalAmount: '− 20.00 EUR';
  //   spendRewards: '+ $0.30 CAD';
  //   status: 'Completed';
  //   total: '− $29.59 CAD';
  if (normalizedName === 'account') {
    return { account: value };
  }
  if (normalizedName === 'status') {
    return { status: value };
  }
  if (normalizedName === 'date') {
    if (!value) {
      return {};
    }
    const date = parse(value, 'MMMM d, yyyyh:mm a', new Date());
    if (isValid(date)) {
      return { date: date.toISOString() };
    }

    const date2 = parse(value, 'MMMM d, yyyy', new Date());
    if (isValid(date2)) {
      return { date: date2.toISOString() };
    }
    return {};
  }
  if (normalizedName === 'original amount') {
    if (!value) {
      return {};
    }
    const parsed = parseCurrencyValue(value);
    return { originalAmount: parsed.amount, originalCurrency: parsed.currency };
  }
  if (normalizedName === 'exchange rate') {
    if (!value) {
      return {};
    }
    return { exchangeRate: parseFloat(value) };
  }
  if (normalizedName === 'total') {
    if (!value) {
      return {};
    }
    const parsed = parseCurrencyValue(value);
    return { total: parsed.amount, totalCurrency: parsed.currency };
  }
  if (normalizedName.indexOf('spend rewards') > -1) {
    if (!value) {
      return {};
    }
    const parsed = parseCurrencyValue(value);

    return { spendRewards: parsed.amount, spendRewardsCurrency: parsed.currency };
  }
  return {};
};

export async function mount() {
  findElementWithUUIDHeaderXPath();

  await delay(3000);
  const role = 'region';
  const roleElement = document.querySelectorAll(`[role="${role}"]`);
  const result: any[] = [];
  roleElement.forEach(element => {
    const xpathExpression = '../child::*[1]/child::*[1]/child::*[1]/child::*[1]/child::*[2]/child::*[1]';
    const r = document.evaluate(xpathExpression, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const descriptionEl = r.singleNodeValue;

    const child = element.children[0];
    const rows = child.children;
    let rowData: Record<string, number | string | undefined | null> = { description: descriptionEl?.textContent };
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.children.length !== 2) {
        continue;
      }
      //   console.log('-----------------------------');
      if (!row.children[0].textContent) {
        continue;
      }
      rowData = { ...rowData, ...parseRow(row.children[0].textContent, row.children[1].textContent ?? undefined) };
      //   console.log(`${row.children[0].textContent}: ${row.children[1].textContent}`);
    }
    result.push(rowData);
  });
  console.log(result);
}
