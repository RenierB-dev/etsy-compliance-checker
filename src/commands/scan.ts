import { ConfigManager } from '../utils/config';
import { EtsyApiService } from '../services/etsyApi';
import { ViolationDetector } from '../services/violationDetector';
import { ReportGenerator } from '../services/reportGenerator';
import { ScanResult, Violation } from '../types';
import chalk from 'chalk';

export async function scanCommand(options: { limit?: number; save?: boolean }): Promise<void> {
  try {
    console.log(chalk.blue('🔍 Starting Etsy shop compliance scan...\n'));

    // Load configuration
    const configManager = new ConfigManager();
    const config = configManager.loadConfig();

    // Initialize services
    const etsyApi = new EtsyApiService(config.apiKey, config.shopId);
    const detector = new ViolationDetector();
    const reportGenerator = new ReportGenerator();

    // Test connection
    console.log('Testing Etsy API connection...');
    const connected = await etsyApi.testConnection();

    if (!connected) {
      throw new Error('Failed to connect to Etsy API. Please check your credentials.');
    }

    console.log(chalk.green('✓ Connected to Etsy API\n'));

    // Fetch listings
    const limit = options.limit || 100;
    console.log(`Fetching up to ${limit} listings...`);
    const listings = await etsyApi.getShopListings(limit);

    console.log(chalk.green(`✓ Fetched ${listings.length} listings\n`));

    // Scan for violations
    console.log('Scanning for violations...');
    const allViolations: Violation[] = [];

    for (const listing of listings) {
      const violations = detector.detectViolations(listing);
      allViolations.push(...violations);
    }

    console.log(chalk.green('✓ Scan complete\n'));

    // Generate result
    const result: ScanResult = {
      shop_id: config.shopId,
      scan_date: new Date().toISOString(),
      total_listings: listings.length,
      scanned_listings: listings.length,
      violations: allViolations,
      summary: {
        critical: allViolations.filter(v => v.severity === 'critical').length,
        warnings: allViolations.filter(v => v.severity === 'warning').length,
        info: allViolations.filter(v => v.severity === 'info').length,
      },
    };

    // Display summary
    reportGenerator.displayConsoleSummary(result);

    // Save report if requested
    if (options.save) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const filename = `compliance-report-${timestamp}`;

      const mdReport = reportGenerator.generateMarkdownReport(result);
      const mdPath = reportGenerator.saveReport(mdReport, filename, 'md');

      const jsonReport = reportGenerator.generateJsonReport(result);
      const jsonPath = reportGenerator.saveReport(jsonReport, filename, 'json');

      console.log(chalk.green(`\n✓ Reports saved:`));
      console.log(`  - ${mdPath}`);
      console.log(`  - ${jsonPath}\n`);
    } else {
      console.log(chalk.gray('\nTip: Use --save flag to save the report to a file\n'));
    }
  } catch (error: any) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}
