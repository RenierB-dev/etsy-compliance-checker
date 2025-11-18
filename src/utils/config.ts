import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

export class ConfigManager {
  private envPath: string;

  constructor() {
    this.envPath = path.join(process.cwd(), '.env');
  }

  async initConfig(): Promise<void> {
    console.log('🔧 Initializing Etsy Compliance Checker...\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (prompt: string): Promise<string> => {
      return new Promise(resolve => {
        rl.question(prompt, answer => {
          resolve(answer);
        });
      });
    };

    try {
      const apiKey = await question('Enter your Etsy API Key: ');
      const shopId = await question('Enter your Etsy Shop ID: ');

      const envContent = `# Etsy API Configuration
ETSY_API_KEY=${apiKey}
ETSY_SHOP_ID=${shopId}
`;

      fs.writeFileSync(this.envPath, envContent, 'utf-8');

      console.log('\n✅ Configuration saved to .env file');
      console.log('You can now run: etsy-check scan\n');
    } finally {
      rl.close();
    }
  }

  loadConfig(): { apiKey: string; shopId: string } {
    if (!fs.existsSync(this.envPath)) {
      throw new Error(
        'Configuration not found. Please run "etsy-check init" first.'
      );
    }

    const envContent = fs.readFileSync(this.envPath, 'utf-8');
    const config: { apiKey?: string; shopId?: string } = {};

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (key === 'ETSY_API_KEY') {
          config.apiKey = value;
        } else if (key === 'ETSY_SHOP_ID') {
          config.shopId = value;
        }
      }
    });

    if (!config.apiKey || !config.shopId) {
      throw new Error(
        'Invalid configuration. Please run "etsy-check init" again.'
      );
    }

    return { apiKey: config.apiKey, shopId: config.shopId };
  }

  configExists(): boolean {
    return fs.existsSync(this.envPath);
  }
}
