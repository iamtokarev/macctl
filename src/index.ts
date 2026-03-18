import { Command } from 'commander';


const program = new Command();

program
  .name('macctl')
  .description('CLI for controlling macOS')
  .version('1.0.0');

program
    .command('hello')
    .description('Test command')
    .action(() => {
        console.log('Hi there!')
    });

program.parse();