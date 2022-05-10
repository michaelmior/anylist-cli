const AnyList = require('anylist');
const {cosmiconfig} = require('cosmiconfig');
const {prompt} = require('enquirer');

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const writeFileAsync = promisify(fs.writeFile);

async function loadAny(config) {
  const any = new AnyList({
    email: config.email,
    password: config.password
  });
  await any.login();
  return any;
}

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

async function writeConfig() {
  // Ask the user for email and password
  const questions = [
    {
      type: 'input',
      name: 'email',
      message: 'Email'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password'
    }
  ];
  let config = await prompt(questions);

  // Write the config to file
  const configPath = path.join(process.env.HOME || '', '.anylistrc.json');
  await writeFileAsync(configPath, JSON.stringify(config, null, 2));

  return config;
}

async function main() {
  let config = await getConfig();
  let any = await loadAny(config);
  if (any) {
    const lists = await any.getLists();
    console.log(lists.map((l) => l.name));
    any.teardown();
  }
}

main();
