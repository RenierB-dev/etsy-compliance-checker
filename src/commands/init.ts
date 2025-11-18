import { ConfigManager } from '../utils/config';
import chalk from 'chalk';

export async function initCommand(): Promise<void> {
  try {
    const configManager = new ConfigManager();

    if (configManager.configExists()) {
      console.log(chalk.yellow('⚠️  Configuration already exists.'));
      console.log('Delete .env file if you want to reconfigure.\n');
      return;
    }

    await configManager.initConfig();
  } catch (error: any) {
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}
