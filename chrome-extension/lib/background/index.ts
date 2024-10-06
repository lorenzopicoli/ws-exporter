import 'webextension-polyfill';

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  const iconVariant = e.matches ? '-white' : '';

  chrome.browserAction.setIcon({
    path: {
      16: `icon${iconVariant}-16.png`,
      32: `icon${iconVariant}-32.png`,
      48: `icon${iconVariant}-48.png`,
      128: `icon${iconVariant}-128.png`,
    },
  });
});
