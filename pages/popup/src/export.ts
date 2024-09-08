import { isValid, parse } from 'date-fns';

type ParsedTransactions = Array<Record<string, number | string | undefined | null> | undefined>;

/**
 * Examples:
 * 1. Account: Cash
 * 2. Date: July 10, 202411:35 pm -> The date and time are in different lines, but getting textContent will return them in a single line
 * 3. Exchange Rate: 1.4795
 * 4. Original Amount: − 20.00 EUR
 * 5. Spend Rewards: + $0.30 CAD
 * 6. Status: Completed
 * 7. Total: − $29.59 CAD
 */
function parseRow(name: string, value?: string) {
  console.log('Called with', name, value);
  const normalizedName = name.toLowerCase();
  const parseCurrencyValue = (value: string) => {
    const split = value?.split(' ') ?? [];
    if (split.length < 3) {
      const [amount, currency] = split;
      const sign = amount.indexOf('−') > -1 ? '−' : '+';
      return { amount: parseFloat(amount.replace('$', '')) * (sign === '−' ? -1 : 1), currency };
    }
    const [sign, amount, currency] = split;
    return { amount: parseFloat(amount.replace('$', '')) * (sign === '−' ? -1 : 1), currency };
  };
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
  if (normalizedName === 'total' || normalizedName === 'amount') {
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
}

/**
 * Extracts the transaction description from the transaction details container element
 * @param element The transaction details container element
 */
function getTransactionDescription(element: Element) {
  // From the transaction details we find again the header button which contains the name/description
  const transactionHeaderExp = '../child::*[1]/child::*[1]/child::*[1]/child::*[1]/child::*[2]/child::*[1]';
  const transactionHeader = document.evaluate(
    transactionHeaderExp,
    element,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
  const description = transactionHeader?.textContent;

  return description;
}

function processTransactionDetails(element: Element): ParsedTransactions[number] {
  const rows = element.children[0]?.children;
  if (!rows || rows.length === 0) {
    return;
  }

  let rowData: ParsedTransactions[number] = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.children.length !== 2 || !row.children[0].textContent) {
      continue;
    }
    rowData = { ...rowData, ...parseRow(row.children[0].textContent, row.children[1].textContent ?? undefined) };
  }

  if (Object.keys(rowData).length === 0) {
    return;
  }
  const description = getTransactionDescription(element);
  if (description) {
    rowData = { ...rowData, description };
  }
  return rowData;
}

function parsedTransactionsToCsv(parsed: ParsedTransactions) {
  const items = parsed.filter(Boolean);
  const firstItem = items[0];
  if (!firstItem) {
    return '';
  }
  const replacer = (_key: string, value: unknown) => (value === null ? '' : value); // specify how you want to handle null values here
  const header = Object.keys(firstItem);
  const csv = [
    header.join(','), // header row first
    ...items.map(row => header.map(fieldName => JSON.stringify(row?.[fieldName], replacer)).join(',')),
  ].join('\r\n');

  return csv;
}

async function run() {
  // Find the transaction details are which seems to have a role of region
  const role = 'region';
  const roleElement = document.querySelectorAll(`[role="${role}"]`);

  console.log('here');
  console.log(processTransactionDetails);
  const result: ParsedTransactions = Array.from(roleElement).map(processTransactionDetails);
  const csv = parsedTransactionsToCsv(result);
  console.log(csv);
}

export async function exportTransactions() {
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
