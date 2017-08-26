#!/usr/bin/env node

const program = require('commander');

let filenames = [];

program
  .version('0.0.1')
  .arguments('[files...]')
  .usage('<file ...>')
  .action((args) => {
    filenames = args;
  }).on('--help', () => {
    console.log();
    console.log('  Examples:');
    console.log();
    console.log('    $ wav2ogg player_hurt.wav');
    console.log('    $ wav2ogg player_hurt.wav player_heal.wav');
    console.log();
  });

program.parse(process.argv);

if (filenames.length === 0) {
  program.help();
}

filenames.forEach((f) => {
  console.log(f);
});
