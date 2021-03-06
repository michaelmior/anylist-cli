const {cosmiconfig} = require('cosmiconfig');
const {prompt} = require('enquirer');

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const writeFileAsync = promisify(fs.writeFile);

async function getConfig() {
  // Try to load the config from file
  const explorer = cosmiconfig('anylist');
  let config = await explorer.search();

  // If the config could not be found, prompt and then write it
  if (config) {
    return config.config;
  } else {
    return await writeConfig();
  }
}

module.exports.getConfig = getConfig;

async function writeConfig() {
  // Ask the user for email and password
  const questions = [
    {
      type: 'input',
      name: 'email',
      message: 'Email',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password',
    },
  ];
  let config = await prompt(questions);

  // Write the config to file
  const configPath = path.join(process.env.HOME || '', '.anylistrc.json');
  await writeFileAsync(configPath, JSON.stringify(config, null, 2));

  return config;
}
