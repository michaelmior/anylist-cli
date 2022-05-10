const AnyList = require('anylist');
const {Command} = require('commander');

const {getConfig} = require('./config');

async function loadAny() {
  const config = await getConfig();
  const any = new AnyList({
    email: config.email,
    password: config.password,
  });
  await any.login();
  return any;
}

async function main() {
  const pkgJson = require('../package.json');
  const program = new Command();
  program.name(pkgJson.name).version(pkgJson.version);

  let any = null;

  program
    .command('add-item')
    .argument('<list>')
    .argument('<item>')
    .action(async (listName, itemName) => {
      any = await loadAny();
      await any.getLists();
      const list = any.getListByName(listName);
      if (list) {
        if (list.getItemByName(itemName)) {
          console.error('Item already exists');
        } else {
          const item = any.createItem({name: itemName});
          await list.addItem(item);
        }
      } else {
        console.error('List not found');
      }
    });

  program
    .command('items')
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

  program.command('lists').action(async () => {
    any = await loadAny();
    const lists = await any.getLists();
    lists.forEach((l) => console.log(l.name));
  });

  program
    .command('uncheck-all')
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
