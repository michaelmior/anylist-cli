const AnyList = require('anylist');
const {Command} = require('commander');
const {cosmiconfig} = require('cosmiconfig');
const {prompt} = require('enquirer');

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const writeFileAsync = promisify(fs.writeFile);

async function loadAny() {
  const config = await getConfig();
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
  const pkgJson = require('../package.json');
  const program = new Command();
  program
    .name(pkgJson.name)
    .version(pkgJson.version);

  let any = null;

  program.command('add-item')
    .argument('<list>')
    .argument('<item>')
    .action(async (listName, itemName) => {
      any = await loadAny();
      await any.getLists();
      const list = any.getListByName(listName);
      if (list) {
        const item = any.createItem({name: itemName});
        await list.addItem(item);
      } else {
        console.error('List not found');
      }
    });

  program.command('items')
    .argument('<list>')
    .action(async (listName) => {
      any = await loadAny();
      await any.getLists();
      const list = any.getListByName(listName);
      if (list) {
        list.items.forEach((i) => console.log(i.name));
      } else {
        console.error('List not found');
      }
    });

  program.command('lists')
    .action(async () => {
      any = await loadAny();
      const lists = await any.getLists();
      lists.forEach((l) => console.log(l.name));
    });

  program.command('uncheck-all')
    .argument('<list>')
    .action(async (listName) => {
      any = await loadAny();
      await any.getLists();
      const list = any.getListByName(listName);
      if (list) {
        list.uncheckAll();
      } else {
        console.error('List not found');
      }
    });

  await program.parseAsync();

  if (any) {
    any.teardown();
  }
}

main();
