const {cosmiconfigSync} = require('cosmiconfig');
const mock = require('mock-fs');

const path = require('path');

const {getConfig} = require('./config');

test('correct configuration can be loaded from file', async () => {
  // Trigger lazy module loading
  cosmiconfigSync('').search();

  // Create a mock configuration
  const configPath = path.join(process.env.HOME || '', '.anylistrc.json');
  mock({
    [configPath]: '{"email": "foo@example.com", "password": "password"}'
  });

  const config = await getConfig();
  expect(config.email).toBe('foo@example.com');
  expect(config.password).toBe('password');

  mock.restore();
});
