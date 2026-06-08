/** Opens in-app deep links (`focusguard://…`) while Detox session is active. */

const { device } = require('detox');

const DEEP_LINK_PREFIX = 'focusguard://';

const openDeepLink = async (path) => {
  const normalizedPath = path.replace(/^\/+/, '');
  await device.openURL({ url: `${DEEP_LINK_PREFIX}${normalizedPath}` });
};

module.exports = { openDeepLink };
