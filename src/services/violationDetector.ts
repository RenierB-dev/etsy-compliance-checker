import { EtsyListing, Violation, ViolationRules } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class ViolationDetector {
  private rules: ViolationRules;

  constructor() {
    const rulesPath = path.join(__dirname, '../../rules.json');
    const rulesData = fs.readFileSync(rulesPath, 'utf-8');
    this.rules = JSON.parse(rulesData);
  }

  detectViolations(listing: EtsyListing): Violation[] {
    const violations: Violation[] = [];

    // Check prohibited keywords
    violations.push(...this.checkProhibitedKeywords(listing));

    // Check required fields
    violations.push(...this.checkRequiredFields(listing));

    // Check title patterns
    violations.push(...this.checkTitlePatterns(listing));

    // Check description patterns
    violations.push(...this.checkDescriptionPatterns(listing));

    return violations;
  }

  private checkProhibitedKeywords(listing: EtsyListing): Violation[] {
    const violations: Violation[] = [];
    const searchText = `${listing.title} ${listing.description} ${listing.tags.join(' ')} ${listing.materials.join(' ')}`.toLowerCase();

    for (const [category, rule] of Object.entries(this.rules.prohibitedKeywords)) {
      if (rule.keywords) {
        for (const keyword of rule.keywords) {
          const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
          if (regex.test(searchText)) {
            violations.push({
              listing_id: listing.listing_id,
              listing_title: listing.title,
              listing_url: listing.url || `https://etsy.com/listing/${listing.listing_id}`,
              severity: rule.severity,
              category: `Prohibited: ${category}`,
              message: `${rule.description}: Found keyword "${keyword}"`,
              matched_keyword: keyword,
            });
          }
        }
      }
    }

    return violations;
  }

  private checkRequiredFields(listing: EtsyListing): Violation[] {
    const violations: Violation[] = [];

    for (const fieldRule of this.rules.requiredFields) {
      if (fieldRule.field === 'materials') {
        if (!listing.materials || listing.materials.length === 0) {
          violations.push({
            listing_id: listing.listing_id,
            listing_title: listing.title,
            listing_url: listing.url || `https://etsy.com/listing/${listing.listing_id}`,
            severity: fieldRule.severity,
            category: 'Missing Required Field',
            message: fieldRule.description,
            field: 'materials',
          });
        }
      } else if (fieldRule.field === 'shipping_profile') {
        if (!listing.shipping_profile_id) {
          violations.push({
            listing_id: listing.listing_id,
            listing_title: listing.title,
            listing_url: listing.url || `https://etsy.com/listing/${listing.listing_id}`,
            severity: fieldRule.severity,
            category: 'Missing Required Field',
            message: fieldRule.description,
            field: 'shipping_profile',
          });
        }
      } else if (fieldRule.field === 'tags') {
        const minCount = fieldRule.minCount || 0;
        if (!listing.tags || listing.tags.length < minCount) {
          violations.push({
            listing_id: listing.listing_id,
            listing_title: listing.title,
            listing_url: listing.url || `https://etsy.com/listing/${listing.listing_id}`,
            severity: fieldRule.severity,
            category: 'Missing Required Field',
            message: `${fieldRule.description} (current: ${listing.tags?.length || 0})`,
            field: 'tags',
          });
        }
      }
    }

    return violations;
  }

  private checkTitlePatterns(listing: EtsyListing): Violation[] {
    const violations: Violation[] = [];

    for (const patternRule of this.rules.titlePatterns) {
      const regex = new RegExp(patternRule.pattern);
      if (regex.test(listing.title)) {
        violations.push({
          listing_id: listing.listing_id,
          listing_title: listing.title,
          listing_url: listing.url || `https://etsy.com/listing/${listing.listing_id}`,
          severity: patternRule.severity,
          category: 'Title Issue',
          message: patternRule.description,
          field: 'title',
        });
      }
    }

    return violations;
  }

  private checkDescriptionPatterns(listing: EtsyListing): Violation[] {
    const violations: Violation[] = [];

    for (const patternRule of this.rules.descriptionPatterns) {
      const regex = new RegExp(patternRule.pattern, 'i');
      if (regex.test(listing.description)) {
        violations.push({
          listing_id: listing.listing_id,
          listing_title: listing.title,
          listing_url: listing.url || `https://etsy.com/listing/${listing.listing_id}`,
          severity: patternRule.severity,
          category: 'Description Issue',
          message: patternRule.description,
          field: 'description',
        });
      }
    }

    return violations;
  }
}
