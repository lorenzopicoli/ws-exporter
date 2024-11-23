import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = true;

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  host_permissions: ['*://my.wealthsimple.com/*'],
  permissions: !isFirefox ? ['activeTab', '*://my.wealthsimple.com/*'] : ['activeTab'],
  background: {
    service_worker: 'background.iife.js',
    type: 'module',

    //action: {
    default_popup: !isFirefox ? 'popup/index.html' : undefined,
    default_icon: !isFirefox ? 'icon-white-128.png' : undefined,
  },
  content_scripts: [
    {
      matches: ['http://my.wealthsimple.com/*', 'https://my.wealthsimple.com/*'],
      js: ['content/index.iife.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', '*.png'],
      matches: ['*://my.wealthsimple.com/*'],
    },
  ],
  ...(isFirefox
    ? {
        action: {
          default_popup: 'popup/index.html',
          default_icon: 'icon-white-128.png',
        },
      }
    : {}),
};

export default manifest;
