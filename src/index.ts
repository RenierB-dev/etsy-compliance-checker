#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { scanCommand } from './commands/scan';
import { reportCommand } from './commands/report';
import chalk from 'chalk';

const program = new Command();

program
  .name('etsy-check')
  .description('Etsy shop compliance checker - Scan your shop for policy violations')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize Etsy API credentials')
  .action(initCommand);

program
  .command('scan')
  .description('Scan shop for compliance violations')
  .option('-l, --limit <number>', 'Maximum number of listings to scan', '100')
  .option('-s, --save', 'Save report to file')
  .action(async (options) => {
    await scanCommand({
      limit: parseInt(options.limit),
      save: options.save,
    });
  });

program
  .command('report')
  .description('Generate compliance report from last scan')
  .option('-f, --format <type>', 'Report format: console, json, markdown', 'console')
  .action(async (options) => {
    await reportCommand({
      format: options.format,
    });
  });

// Display help if no command provided
if (process.argv.length <= 2) {
  console.log(chalk.blue.bold('\n🛍️  Etsy Compliance Checker\n'));
  program.help();
}

program.parse(process.argv);
