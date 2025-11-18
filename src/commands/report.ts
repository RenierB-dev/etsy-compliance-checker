import { ReportGenerator } from '../services/reportGenerator';
import { ScanResult } from '../types';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

export async function reportCommand(options: { format?: string }): Promise<void> {
  try {
    const reportsDir = path.join(process.cwd(), 'reports');

    if (!fs.existsSync(reportsDir)) {
      console.log(chalk.yellow('⚠️  No reports directory found.'));
      console.log('Run "etsy-check scan --save" first to generate a report.\n');
      return;
    }

    // Find the most recent JSON report
    const files = fs.readdirSync(reportsDir);
    const jsonReports = files.filter(f => f.endsWith('.json')).sort().reverse();

    if (jsonReports.length === 0) {
      console.log(chalk.yellow('⚠️  No saved reports found.'));
      console.log('Run "etsy-check scan --save" first to generate a report.\n');
      return;
    }

    const latestReport = jsonReports[0];
    const reportPath = path.join(reportsDir, latestReport);

    console.log(chalk.blue(`📄 Loading report: ${latestReport}\n`));

    const reportData = fs.readFileSync(reportPath, 'utf-8');
    const result: ScanResult = JSON.parse(reportData);

    const reportGenerator = new ReportGenerator();

    const format = options.format || 'console';

    if (format === 'json') {
      console.log(reportGenerator.generateJsonReport(result));
    } else if (format === 'markdown' || format === 'md') {
      console.log(reportGenerator.generateMarkdownReport(result));
    } else {
      // Console display
      reportGenerator.displayConsoleSummary(result);

      if (result.violations.length > 0) {
        console.log('\n' + chalk.bold('Violations by Severity:\n'));

        const critical = result.violations.filter(v => v.severity === 'critical');
        const warnings = result.violations.filter(v => v.severity === 'warning');
        const info = result.violations.filter(v => v.severity === 'info');

        if (critical.length > 0) {
          console.log(chalk.red.bold(`🔴 CRITICAL (${critical.length}):`));
          critical.slice(0, 5).forEach(v => {
            console.log(chalk.red(`  - ${v.listing_title}: ${v.message}`));
          });
          if (critical.length > 5) {
            console.log(chalk.gray(`  ... and ${critical.length - 5} more`));
          }
          console.log('');
        }

        if (warnings.length > 0) {
          console.log(chalk.yellow.bold(`⚠️  WARNINGS (${warnings.length}):`));
          warnings.slice(0, 5).forEach(v => {
            console.log(chalk.yellow(`  - ${v.listing_title}: ${v.message}`));
          });
          if (warnings.length > 5) {
            console.log(chalk.gray(`  ... and ${warnings.length - 5} more`));
          }
          console.log('');
        }

        if (info.length > 0) {
          console.log(chalk.blue.bold(`ℹ️  INFO (${info.length}):`));
          info.slice(0, 5).forEach(v => {
            console.log(chalk.blue(`  - ${v.listing_title}: ${v.message}`));
          });
          if (info.length > 5) {
            console.log(chalk.gray(`  ... and ${info.length - 5} more`));
          }
          console.log('');
        }
      }

      console.log(chalk.gray('\nTip: Use --format=markdown or --format=json for detailed output\n'));
    }
  } catch (error: any) {
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}
