const mock = require('mock-fs');
const {cosmiconfigSync} = require('cosmiconfig');

// Mock enquirer
jest.mock('enquirer', () => {
  return {prompt: jest.fn()};
});
const {prompt} = require('enquirer');

const path = require('path');
const fs = require('fs').promises;

const {getConfig} = require('./config');

const configPath = path.join(process.env.HOME || '', '.anylistrc.json');

test('correct configuration can be loaded from file', async () => {
  // Trigger lazy module loading
  cosmiconfigSync('').search();

  // Create a mock configuration
  mock({
    [configPath]: '{"email": "foo@example.com", "password": "password"}',
  });

  const config = await getConfig();
  expect(config.email).toBe('foo@example.com');
  expect(config.password).toBe('password');

  mock.restore();
});

test('users can be prompted for input with no config file', async () => {
  // Provide responses to the prompts
  prompt.mockReturnValue({email: 'bar@example.com', password: 'password2'});

  // Trigger lazy module loading
  cosmiconfigSync('').search();

  // Start mocking the file system
  mock();

  const config = await getConfig();
  expect(config.email).toBe('bar@example.com');
  expect(config.password).toBe('password2');

  const writtenConfig = JSON.parse(await fs.readFile(configPath, 'utf8'));
  expect(writtenConfig.email).toBe('bar@example.com');
  expect(writtenConfig.password).toBe('password2');

  mock.restore();
  jest.unmock('enquirer');
});
