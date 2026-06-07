const { device } = require('detox');

jest.setTimeout(120000);

beforeAll(async () => {
  if (device.getPlatform() === 'ios') {
    await device.installUtilBinary('applesimutils').catch(() => undefined);
  }
});
