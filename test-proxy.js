const { proxyRequest, getBackendBaseUrl } = require('./packages/shared/dist/utils/apiProxy.js') || {};
console.log('Backend URL:', getBackendBaseUrl ? getBackendBaseUrl() : 'Not exported');
