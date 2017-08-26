#!/usr/bin/env node

const program = require('commander');
const ffmpeg = require('ffmpeg');
const promisify = require('promisify-node');
const fs = promisify('fs');
const mime = require('mime');
const replaceExt = require('replace-ext');
const {
  red,
  green,
  yellow,
  bold
} = require('colors');

let filenames = [];
let quality = 10;

program
  .version('0.0.1')
  .arguments('[files...]')
  .usage('<file ...>')
  .option('-f, --force', 'overwrite output files')
  .option('-q, --quality [quality]', `vbr quality (default ${quality})`)
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

if (program.quality) {
  quality = program.quality;
}

filenames.forEach(async (filename) => {
  try {
    await fs.stat(filename);

    if (mime.extension(mime.lookup(filename)) !== 'wav') {
      console.log(`${yellow('skip')} ${bold(filename)} is not a wav file`);
      return;
    }

    let audioFile = await new ffmpeg(filename);

    let oggFilename = replaceExt(filename, '.ogg');

    if (!program.force) {
      try {
        await fs.stat(oggFilename);
        console.log(`${yellow('skip')} ${bold(filename)} would overwrite ${oggFilename}. Use --force to override`);
        return;
      } catch(e) {
        console.log('gdsfd');
      }
    }

    audioFile.addCommand('-y');
    audioFile.addCommand('-strict', '-2');
    audioFile.addCommand('-acodec', 'vorbis');
    audioFile.addCommand('-ac', '2');
    audioFile.addCommand('-aq', quality);

    promisify(audioFile);
    let file = await audioFile.save(filename.replace(/wav/, 'ogg'));

    console.log(`${green('success')} ${bold(filename)} converted to ${file}`);
  } catch(e) {
    console.error(`${red('fail')} ${bold(filename)} ${red(e.msg ? e.msg : e)}`);
  }
});
