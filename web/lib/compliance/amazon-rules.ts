/**
 * SellerGuard Pro - Comprehensive Amazon Compliance Rules
 *
 * This file contains 60+ compliance rules organized into 6 categories:
 * 1. Product Detail Page (12 rules)
 * 2. Brand & Trademarks (8 rules)
 * 3. Restricted Categories (10 rules)
 * 4. FBA Requirements (8 rules)
 * 5. Content Policy (12 rules)
 * 6. Technical Requirements (10 rules)
 */

import { AmazonComplianceRule, AmazonListing, ViolationResult } from '../types/compliance';

// ============================================================================
// CATEGORY 1: PRODUCT DETAIL PAGE (12 rules)
// ============================================================================

const productDetailPageRules: AmazonComplianceRule[] = [
  {
    id: 'AMZN-PDP-001',
    category: 'product_detail_page',
    severity: 'critical',
    name: 'Title Length Violation',
    description: 'Product title must be between 60-200 characters for optimal display',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const titleLength = listing.title.length;

      if (titleLength < 60) {
        return {
          ruleId: 'AMZN-PDP-001',
          severity: 'critical',
          message: `Title is too short (${titleLength} characters). Amazon recommends 60-200 characters.`,
          field: 'title',
          recommendation: 'Add product details like brand, size, color, and key features'
        };
      }

      if (titleLength > 200) {
        return {
          ruleId: 'AMZN-PDP-001',
          severity: 'critical',
          message: `Title is too long (${titleLength} characters). Amazon limits to 200 characters.`,
          field: 'title',
          recommendation: 'Shorten title to 200 characters or less'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-002',
    category: 'product_detail_page',
    severity: 'warning',
    name: 'Missing Bullet Points',
    description: 'Product should have 5 bullet points for best conversion',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const bulletCount = listing.bulletPoints?.length || 0;

      if (bulletCount === 0) {
        return {
          ruleId: 'AMZN-PDP-002',
          severity: 'warning',
          message: 'No bullet points provided',
          field: 'bulletPoints',
          recommendation: 'Add 5 bullet points highlighting key features and benefits'
        };
      }

      if (bulletCount < 5) {
        return {
          ruleId: 'AMZN-PDP-002',
          severity: 'warning',
          message: `Only ${bulletCount} bullet points. Amazon recommends 5 for optimal conversion.`,
          field: 'bulletPoints',
          recommendation: 'Add more bullet points to reach the recommended 5'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-003',
    category: 'product_detail_page',
    severity: 'warning',
    name: 'Bullet Point Length',
    description: 'Each bullet point should be 150-200 characters for readability',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.bulletPoints || listing.bulletPoints.length === 0) {
        return null;
      }

      const shortBullets = listing.bulletPoints.filter(b => b.length < 100);
      const longBullets = listing.bulletPoints.filter(b => b.length > 250);

      if (shortBullets.length > 0) {
        return {
          ruleId: 'AMZN-PDP-003',
          severity: 'warning',
          message: `${shortBullets.length} bullet point(s) are too short (under 100 characters)`,
          field: 'bulletPoints',
          recommendation: 'Expand bullet points with more detailed product information'
        };
      }

      if (longBullets.length > 0) {
        return {
          ruleId: 'AMZN-PDP-003',
          severity: 'warning',
          message: `${longBullets.length} bullet point(s) are too long (over 250 characters)`,
          field: 'bulletPoints',
          recommendation: 'Shorten bullet points for better readability'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-004',
    category: 'product_detail_page',
    severity: 'critical',
    name: 'Missing Main Image',
    description: 'Product must have a main image',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.mainImageUrl && (!listing.images || listing.images.length === 0)) {
        return {
          ruleId: 'AMZN-PDP-004',
          severity: 'critical',
          message: 'No product images provided',
          field: 'images',
          recommendation: 'Add at least one main product image on white background'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-005',
    category: 'product_detail_page',
    severity: 'warning',
    name: 'Insufficient Images',
    description: 'Products should have 6-7 images for best conversion',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const imageCount = listing.images?.length || 0;

      if (imageCount < 3) {
        return {
          ruleId: 'AMZN-PDP-005',
          severity: 'warning',
          message: `Only ${imageCount} image(s). Amazon recommends 6-7 images.`,
          field: 'images',
          recommendation: 'Add lifestyle shots, detail shots, and infographics'
        };
      }

      if (imageCount < 6) {
        return {
          ruleId: 'AMZN-PDP-005',
          severity: 'info',
          message: `${imageCount} images provided. Consider adding ${6 - imageCount} more for better conversion.`,
          field: 'images',
          recommendation: 'Add more product angles and use cases'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-006',
    category: 'product_detail_page',
    severity: 'warning',
    name: 'Missing Product Description',
    description: 'Product description should be comprehensive and detailed',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.description || listing.description.trim() === '') {
        return {
          ruleId: 'AMZN-PDP-006',
          severity: 'warning',
          message: 'No product description provided',
          field: 'description',
          recommendation: 'Add detailed product description with specifications and benefits'
        };
      }

      if (listing.description.length < 200) {
        return {
          ruleId: 'AMZN-PDP-006',
          severity: 'warning',
          message: `Product description is too short (${listing.description.length} characters)`,
          field: 'description',
          recommendation: 'Expand description to at least 200 characters with product details'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-007',
    category: 'product_detail_page',
    severity: 'warning',
    name: 'Title Capitalization',
    description: 'Title should use Title Case, not ALL CAPS',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const allCapsWords = listing.title.match(/\b[A-Z]{3,}\b/g);

      if (allCapsWords && allCapsWords.length > 2) {
        return {
          ruleId: 'AMZN-PDP-007',
          severity: 'warning',
          message: 'Title contains excessive capitalization',
          field: 'title',
          matchedValue: allCapsWords.join(', '),
          recommendation: 'Use Title Case instead of ALL CAPS for better readability'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-008',
    category: 'product_detail_page',
    severity: 'info',
    name: 'Title Structure Best Practices',
    description: 'Title should follow format: Brand + Product Type + Key Features',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const title = listing.title.toLowerCase();
      const hasBrand = listing.brand && title.includes(listing.brand.toLowerCase());

      if (!hasBrand && listing.brand) {
        return {
          ruleId: 'AMZN-PDP-008',
          severity: 'info',
          message: 'Brand name not found in title',
          field: 'title',
          recommendation: 'Start title with brand name for better recognition'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-009',
    category: 'product_detail_page',
    severity: 'warning',
    name: 'HTML in Bullet Points',
    description: 'Bullet points should not contain HTML tags',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.bulletPoints) return null;

      const htmlPattern = /<[^>]+>/;
      const bulletWithHtml = listing.bulletPoints.find(b => htmlPattern.test(b));

      if (bulletWithHtml) {
        return {
          ruleId: 'AMZN-PDP-009',
          severity: 'warning',
          message: 'Bullet points contain HTML tags',
          field: 'bulletPoints',
          recommendation: 'Remove HTML tags from bullet points'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-010',
    category: 'product_detail_page',
    severity: 'critical',
    name: 'Prohibited Promotional Language in Title',
    description: 'Title cannot contain promotional phrases',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const prohibitedPhrases = [
        'free shipping',
        'sale',
        'best seller',
        'best price',
        'lowest price',
        'on sale',
        'discount',
        'limited time',
        '#1',
        'hot'
      ];

      const title = listing.title.toLowerCase();
      const matched = prohibitedPhrases.find(phrase => title.includes(phrase));

      if (matched) {
        return {
          ruleId: 'AMZN-PDP-010',
          severity: 'critical',
          message: 'Title contains prohibited promotional language',
          field: 'title',
          matchedValue: matched,
          recommendation: 'Remove promotional phrases - Amazon prohibits them in titles'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-011',
    category: 'product_detail_page',
    severity: 'warning',
    name: 'Special Characters in Title',
    description: 'Avoid excessive special characters in title',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const specialChars = listing.title.match(/[!@#$%^&*()+=\[\]{}|;:'",.<>?\/~`]/g);

      if (specialChars && specialChars.length > 3) {
        return {
          ruleId: 'AMZN-PDP-011',
          severity: 'warning',
          message: `Title contains ${specialChars.length} special characters`,
          field: 'title',
          recommendation: 'Reduce special characters for cleaner title'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-PDP-012',
    category: 'product_detail_page',
    severity: 'info',
    name: 'Search Terms Optimization',
    description: 'Utilize backend search terms for SEO',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const searchTerms = listing.searchTerms || listing.keywords || [];
      const totalLength = searchTerms.join(' ').length;

      if (totalLength === 0) {
        return {
          ruleId: 'AMZN-PDP-012',
          severity: 'info',
          message: 'No backend search terms provided',
          field: 'searchTerms',
          recommendation: 'Add search terms to improve product discoverability (max 249 bytes)'
        };
      }

      if (totalLength > 249) {
        return {
          ruleId: 'AMZN-PDP-012',
          severity: 'warning',
          message: `Search terms exceed 249 byte limit (${totalLength} bytes)`,
          field: 'searchTerms',
          recommendation: 'Reduce search terms to fit within 249 byte limit'
        };
      }

      return null;
    }
  }
];

// ============================================================================
// CATEGORY 2: BRAND & TRADEMARKS (8 rules)
// ============================================================================

const brandTrademarkRules: AmazonComplianceRule[] = [
  {
    id: 'AMZN-BT-001',
    category: 'brand_trademarks',
    severity: 'critical',
    name: 'Missing Brand Name',
    description: 'All products must have a brand name',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.brand || listing.brand.trim() === '') {
        return {
          ruleId: 'AMZN-BT-001',
          severity: 'critical',
          message: 'No brand name provided',
          field: 'brand',
          recommendation: 'Add your registered brand name or use "Generic" if unbranded'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-BT-002',
    category: 'brand_trademarks',
    severity: 'critical',
    name: 'Trademark Violation - Major Brands',
    description: 'Cannot use trademarked brand names without authorization',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const majorBrands = [
        'apple', 'samsung', 'nike', 'adidas', 'sony', 'microsoft', 'dell',
        'hp', 'canon', 'nikon', 'lego', 'disney', 'marvel', 'gucci', 'prada',
        'louis vuitton', 'chanel', 'rolex', 'omega', 'ray-ban', 'oakley'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();

      // Check if not official seller but using brand name
      const matchedBrand = majorBrands.find(brand => searchText.includes(brand));

      if (matchedBrand && listing.brand && !listing.brand.toLowerCase().includes(matchedBrand)) {
        const hasCompatibleTerms = searchText.includes('compatible with') ||
                                   searchText.includes('for ' + matchedBrand) ||
                                   searchText.includes('works with');

        if (!hasCompatibleTerms) {
          return {
            ruleId: 'AMZN-BT-002',
            severity: 'critical',
            message: 'Potential trademark violation detected',
            matchedValue: matchedBrand,
            recommendation: 'Only mention other brands if selling compatible accessories and clearly state "Compatible with [Brand]"'
          };
        }
      }

      return null;
    }
  },

  {
    id: 'AMZN-BT-003',
    category: 'brand_trademarks',
    severity: 'warning',
    name: 'Generic Brand Name',
    description: 'Using "Generic" as brand may limit visibility',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (listing.brand && listing.brand.toLowerCase() === 'generic') {
        return {
          ruleId: 'AMZN-BT-003',
          severity: 'warning',
          message: 'Product is branded as "Generic"',
          field: 'brand',
          recommendation: 'Consider registering your own brand for better visibility and brand protection'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-BT-004',
    category: 'brand_trademarks',
    severity: 'critical',
    name: 'Counterfeit Keywords',
    description: 'Cannot use terms suggesting counterfeit products',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const counterfeitTerms = [
        'replica',
        'fake',
        'knockoff',
        'copy',
        'imitation',
        'inspired by',
        'look-alike',
        'dupe'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = counterfeitTerms.find(term => searchText.includes(term));

      if (matched) {
        return {
          ruleId: 'AMZN-BT-004',
          severity: 'critical',
          message: 'Listing contains counterfeit-related terms',
          matchedValue: matched,
          recommendation: 'Remove all terms suggesting counterfeit or replica products'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-BT-005',
    category: 'brand_trademarks',
    severity: 'warning',
    name: 'Brand Registry Recommended',
    description: 'Enroll in Amazon Brand Registry for protection',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      // This is informational - assumes brand is not registered if using generic attributes
      if (listing.brand && listing.brand.toLowerCase() !== 'generic' &&
          !listing.attributes?.brandRegistry) {
        return {
          ruleId: 'AMZN-BT-005',
          severity: 'info',
          message: 'Consider enrolling in Amazon Brand Registry',
          recommendation: 'Brand Registry provides enhanced brand protection and marketing tools'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-BT-006',
    category: 'brand_trademarks',
    severity: 'critical',
    name: 'Designer Brand Misuse',
    description: 'Cannot claim designer brand without authorization',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const designerBrands = [
        'gucci', 'prada', 'versace', 'armani', 'dolce gabbana', 'fendi',
        'burberry', 'givenchy', 'valentino', 'balenciaga', 'saint laurent'
      ];

      if (!listing.brand) return null;

      const brandLower = listing.brand.toLowerCase();
      const isDesignerBrand = designerBrands.some(designer => brandLower.includes(designer));

      if (isDesignerBrand) {
        return {
          ruleId: 'AMZN-BT-006',
          severity: 'critical',
          message: 'Listing claims designer brand - requires authorization',
          field: 'brand',
          recommendation: 'Ensure you are authorized seller of this designer brand'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-BT-007',
    category: 'brand_trademarks',
    severity: 'warning',
    name: 'Compatible Product Labeling',
    description: 'Compatible products must clearly indicate compatibility',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const title = listing.title.toLowerCase();
      const hasOtherBrand = /(for|compatible|fits|works with) (apple|samsung|sony|microsoft)/i.test(listing.title);

      if (hasOtherBrand && listing.brand) {
        const hasCompatiblePrefix = /^(compatible|for|replacement)/i.test(listing.title);

        if (!hasCompatiblePrefix) {
          return {
            ruleId: 'AMZN-BT-007',
            severity: 'warning',
            message: 'Compatible product should start with "Compatible with" or "For"',
            field: 'title',
            recommendation: 'Clearly indicate this is a compatible product, not the original brand'
          };
        }
      }

      return null;
    }
  },

  {
    id: 'AMZN-BT-008',
    category: 'brand_trademarks',
    severity: 'info',
    name: 'Manufacturer Information',
    description: 'Including manufacturer information builds trust',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.manufacturer || listing.manufacturer.trim() === '') {
        return {
          ruleId: 'AMZN-BT-008',
          severity: 'info',
          message: 'No manufacturer information provided',
          field: 'manufacturer',
          recommendation: 'Add manufacturer details for transparency'
        };
      }

      return null;
    }
  }
];

// ============================================================================
// CATEGORY 3: RESTRICTED CATEGORIES (10 rules)
// ============================================================================

const restrictedCategoryRules: AmazonComplianceRule[] = [
  {
    id: 'AMZN-RC-001',
    category: 'restricted_categories',
    severity: 'critical',
    name: 'Hazardous Materials (HAZMAT)',
    description: 'Hazmat products require special approval and labeling',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const hazmatKeywords = [
        'battery', 'lithium', 'aerosol', 'flammable', 'compressed gas',
        'nail polish', 'perfume', 'alcohol', 'paint', 'solvent', 'propane',
        'butane', 'lighter fluid', 'pesticide', 'insecticide'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = hazmatKeywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'AMZN-RC-001',
          severity: 'critical',
          message: 'Product may contain hazardous materials',
          matchedValue: matched,
          recommendation: 'Ensure product has proper HAZMAT approval and labeling for FBA'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-RC-002',
    category: 'restricted_categories',
    severity: 'critical',
    name: 'FDA Regulated Products',
    description: 'Medical devices and supplements require FDA compliance',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const fdaKeywords = [
        'medical device', 'thermometer', 'blood pressure monitor',
        'dietary supplement', 'vitamin', 'cbd', 'cbd oil', 'prescription',
        'medicine', 'drug', 'pharmaceutical', 'fda approved'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = fdaKeywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'AMZN-RC-002',
          severity: 'critical',
          message: 'Product appears to be FDA regulated',
          matchedValue: matched,
          recommendation: 'Ensure FDA compliance and required documentation'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-RC-003',
    category: 'restricted_categories',
    severity: 'critical',
    name: 'Topical Products',
    description: 'Topical products (skin, hair) require approval',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const topicalKeywords = [
        'skin cream', 'lotion', 'moisturizer', 'sunscreen', 'anti-aging',
        'acne treatment', 'wrinkle cream', 'hair growth', 'shampoo', 'conditioner'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = topicalKeywords.find(kw => searchText.includes(kw));

      if (matched && listing.category?.toLowerCase().includes('health')) {
        return {
          ruleId: 'AMZN-RC-003',
          severity: 'critical',
          message: 'Topical product requires category approval',
          matchedValue: matched,
          recommendation: 'Apply for topical products category approval in Seller Central'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-RC-004',
    category: 'restricted_categories',
    severity: 'critical',
    name: 'Pesticides and Insecticides',
    description: 'Pest control products are highly regulated',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const pestKeywords = [
        'pesticide', 'insecticide', 'rodenticide', 'herbicide', 'fungicide',
        'bug spray', 'rat poison', 'weed killer', 'roach killer'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = pestKeywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'AMZN-RC-004',
          severity: 'critical',
          message: 'Pesticide product requires EPA registration',
          matchedValue: matched,
          recommendation: 'Provide EPA registration number and follow pesticide regulations'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-RC-005',
    category: 'restricted_categories',
    severity: 'critical',
    name: 'Automotive Parts Safety',
    description: 'Automotive parts must meet safety standards',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const autoSafetyKeywords = [
        'brake pad', 'brake rotor', 'tire', 'airbag', 'seatbelt',
        'child car seat', 'catalytic converter', 'suspension'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = autoSafetyKeywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'AMZN-RC-005',
          severity: 'critical',
          message: 'Safety-critical automotive part detected',
          matchedValue: matched,
          recommendation: 'Ensure part meets DOT/FMVSS safety standards'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-RC-006',
    category: 'restricted_categories',
    severity: 'critical',
    name: 'Laser Products',
    description: 'Laser products must comply with FDA regulations',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const laserKeywords = ['laser pointer', 'laser pen', 'laser light', 'laser show'];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = laserKeywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'AMZN-RC-006',
          severity: 'critical',
          message: 'Laser product requires FDA compliance',
          matchedValue: matched,
          recommendation: 'Ensure laser product is FDA certified and properly labeled'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-RC-007',
    category: 'restricted_categories',
    severity: 'critical',
    name: 'Jewelry and Precious Metals',
    description: 'Fine jewelry requires approval and certification',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const preciousMetals = ['gold', 'silver', 'platinum', 'diamond', 'gemstone'];
      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();

      const hasPreciousMetal = preciousMetals.some(metal => searchText.includes(metal));

      if (hasPreciousMetal && listing.category?.toLowerCase().includes('jewelry')) {
        const hasCarat = /\d+k\b|\bkarat\b/i.test(listing.title);

        if (hasCarat && !listing.description?.includes('certified')) {
          return {
            ruleId: 'AMZN-RC-007',
            severity: 'warning',
            message: 'Fine jewelry should include metal certification',
            recommendation: 'Include metal purity certification and authenticity documentation'
          };
        }
      }

      return null;
    }
  },

  {
    id: 'AMZN-RC-008',
    category: 'restricted_categories',
    severity: 'critical',
    name: 'Alcohol Products',
    description: 'Alcohol sales require special authorization',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const alcoholKeywords = [
        'wine', 'beer', 'liquor', 'vodka', 'whiskey', 'rum', 'tequila',
        'alcoholic beverage', 'spirits', 'champagne'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();

      // Exclude alcohol-related accessories
      if (searchText.includes('glass') || searchText.includes('opener') ||
          searchText.includes('holder') || searchText.includes('rack')) {
        return null;
      }

      const matched = alcoholKeywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'AMZN-RC-008',
          severity: 'critical',
          message: 'Alcohol products require special authorization',
          matchedValue: matched,
          recommendation: 'Contact Amazon for alcohol selling authorization'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-RC-009',
    category: 'restricted_categories',
    severity: 'critical',
    name: 'Weapons and Weapon Accessories',
    description: 'Weapons are prohibited or heavily restricted',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const weaponKeywords = [
        'gun', 'firearm', 'pistol', 'rifle', 'ammunition', 'ammo',
        'brass knuckles', 'nunchucks', 'throwing star', 'switchblade',
        'taser', 'stun gun', 'pepper spray', 'mace'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = weaponKeywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'AMZN-RC-009',
          severity: 'critical',
          message: 'Weapon or weapon accessory detected',
          matchedValue: matched,
          recommendation: 'Review Amazon weapons policy - most weapons are prohibited'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-RC-010',
    category: 'restricted_categories',
    severity: 'warning',
    name: 'Surveillance Equipment',
    description: 'Surveillance devices have restrictions',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const surveillanceKeywords = [
        'hidden camera', 'spy camera', 'nanny cam', 'gps tracker',
        'phone tap', 'listening device', 'bug detector'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = surveillanceKeywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'AMZN-RC-010',
          severity: 'warning',
          message: 'Surveillance equipment requires compliance verification',
          matchedValue: matched,
          recommendation: 'Ensure product complies with federal and state surveillance laws'
        };
      }

      return null;
    }
  }
];

// ============================================================================
// CATEGORY 4: FBA REQUIREMENTS (8 rules)
// ============================================================================

const fbaRequirementsRules: AmazonComplianceRule[] = [
  {
    id: 'AMZN-FBA-001',
    category: 'fba_requirements',
    severity: 'critical',
    name: 'FBA Label Requirements',
    description: 'FBA inventory must have proper FNSKU labels',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (listing.fulfillmentChannel?.includes('AMAZON')) {
        // This is informational for FBA sellers
        return {
          ruleId: 'AMZN-FBA-001',
          severity: 'info',
          message: 'FBA product - ensure proper FNSKU labeling',
          recommendation: 'All FBA units must have FNSKU labels unless manufacturer barcoded'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-FBA-002',
    category: 'fba_requirements',
    severity: 'warning',
    name: 'FBA Packaging Requirements',
    description: 'Products must meet FBA packaging standards',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (listing.fulfillmentChannel?.includes('AMAZON')) {
        const isFragile = listing.title.toLowerCase().includes('glass') ||
                         listing.title.toLowerCase().includes('fragile') ||
                         listing.description?.toLowerCase().includes('fragile');

        if (isFragile) {
          return {
            ruleId: 'AMZN-FBA-002',
            severity: 'warning',
            message: 'Fragile product requires special FBA prep',
            recommendation: 'Use bubble wrap and "Fragile" labels per FBA prep requirements'
          };
        }
      }

      return null;
    }
  },

  {
    id: 'AMZN-FBA-003',
    category: 'fba_requirements',
    severity: 'critical',
    name: 'FBA Expiration Date Requirements',
    description: 'Products with expiration dates must meet freshness requirements',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const expirationCategories = ['grocery', 'health', 'beauty', 'food', 'supplement'];
      const hasExpirationCategory = expirationCategories.some(cat =>
        listing.category?.toLowerCase().includes(cat)
      );

      if (hasExpirationCategory && listing.fulfillmentChannel?.includes('AMAZON')) {
        return {
          ruleId: 'AMZN-FBA-003',
          severity: 'critical',
          message: 'Expirable product - must meet FBA freshness requirements',
          recommendation: 'Ensure products have at least 90 days until expiration when received at FBA'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-FBA-004',
    category: 'fba_requirements',
    severity: 'warning',
    name: 'FBA Product Dimensions',
    description: 'Oversized products have special FBA requirements',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.dimensions || !listing.fulfillmentChannel?.includes('AMAZON')) {
        return null;
      }

      const { length, width, height, weight } = listing.dimensions;

      // Check for oversized (longest side > 18 inches or weight > 20 lbs)
      const longestSide = Math.max(length || 0, width || 0, height || 0);

      if (longestSide > 18 || (weight && weight > 20)) {
        return {
          ruleId: 'AMZN-FBA-004',
          severity: 'warning',
          message: 'Oversized product - higher FBA fees apply',
          recommendation: 'Review FBA oversized fees and packaging requirements'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-FBA-005',
    category: 'fba_requirements',
    severity: 'warning',
    name: 'FBA Liquid Product Prep',
    description: 'Liquids require special FBA prep',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const liquidKeywords = ['liquid', 'oil', 'lotion', 'cream', 'gel', 'serum', 'shampoo'];
      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();

      const isLiquid = liquidKeywords.some(kw => searchText.includes(kw));

      if (isLiquid && listing.fulfillmentChannel?.includes('AMAZON')) {
        return {
          ruleId: 'AMZN-FBA-005',
          severity: 'warning',
          message: 'Liquid product requires FBA prep',
          recommendation: 'Seal liquids in polybags with suffocation warning per FBA requirements'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-FBA-006',
    category: 'fba_requirements',
    severity: 'info',
    name: 'FBA Multi-Pack Requirements',
    description: 'Multi-packs require special labeling',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const multiPackPattern = /(\d+[-\s]?(pack|count|piece|set))/i;
      const isMultiPack = multiPackPattern.test(listing.title);

      if (isMultiPack && listing.fulfillmentChannel?.includes('AMAZON')) {
        return {
          ruleId: 'AMZN-FBA-006',
          severity: 'info',
          message: 'Multi-pack product detected',
          recommendation: 'Ensure all units in set have "Sold as a set" label if cannot be separated'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-FBA-007',
    category: 'fba_requirements',
    severity: 'warning',
    name: 'FBA Small and Light Program',
    description: 'Eligible products can use FBA Small and Light for lower fees',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.price || !listing.dimensions || !listing.fulfillmentChannel?.includes('AMAZON')) {
        return null;
      }

      // Small and Light eligibility: price under $10, weight under 10 oz, fits in envelope
      const { weight } = listing.dimensions;

      if (listing.price < 10 && weight && weight < 10) {
        return {
          ruleId: 'AMZN-FBA-007',
          severity: 'info',
          message: 'Product may qualify for FBA Small and Light program',
          recommendation: 'Enroll in Small and Light for lower fulfillment fees'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-FBA-008',
    category: 'fba_requirements',
    severity: 'critical',
    name: 'FBA Prohibited Prep',
    description: 'Some prep services are not allowed',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (listing.fulfillmentChannel?.includes('AMAZON')) {
        const prohibitedPrepKeywords = ['assembly required', 'installation required'];
        const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();

        const needsProhibitedPrep = prohibitedPrepKeywords.some(kw => searchText.includes(kw));

        if (needsProhibitedPrep) {
          return {
            ruleId: 'AMZN-FBA-008',
            severity: 'critical',
            message: 'Product requires prep that FBA does not provide',
            recommendation: 'FBA cannot assemble or install products - must be ready to ship'
          };
        }
      }

      return null;
    }
  }
];

// ============================================================================
// CATEGORY 5: CONTENT POLICY (12 rules)
// ============================================================================

const contentPolicyRules: AmazonComplianceRule[] = [
  {
    id: 'AMZN-CP-001',
    category: 'content_policy',
    severity: 'critical',
    name: 'Prohibited Health Claims',
    description: 'Cannot make unsubstantiated health claims',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const prohibitedClaims = [
        'cures cancer', 'treats diabetes', 'cures covid', 'prevents disease',
        'treats illness', 'medical treatment', 'fda approved', 'clinically proven',
        'miracle cure', 'guaranteed results'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = prohibitedClaims.find(claim => searchText.includes(claim));

      if (matched) {
        return {
          ruleId: 'AMZN-CP-001',
          severity: 'critical',
          message: 'Prohibited health claim detected',
          matchedValue: matched,
          recommendation: 'Remove unsubstantiated health claims - violates Amazon policy'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-002',
    category: 'content_policy',
    severity: 'critical',
    name: 'External Links Prohibited',
    description: 'Product listings cannot contain external links',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const urlPattern = /(https?:\/\/|www\.|\.com|\.net|\.org)/i;
      const searchText = `${listing.description || ''} ${listing.bulletPoints?.join(' ') || ''}`;

      if (urlPattern.test(searchText)) {
        return {
          ruleId: 'AMZN-CP-002',
          severity: 'critical',
          message: 'External links found in product content',
          recommendation: 'Remove all external URLs - violates Amazon policy'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-003',
    category: 'content_policy',
    severity: 'critical',
    name: 'Contact Information Prohibited',
    description: 'Cannot include direct contact information',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const searchText = `${listing.description || ''} ${listing.bulletPoints?.join(' ') || ''}`;

      const contactPatterns = [
        /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // phone numbers
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // emails
        /whatsapp/i,
        /contact us at/i,
        /email us/i,
        /call us/i,
        /visit our website/i
      ];

      const matched = contactPatterns.find(pattern => pattern.test(searchText));

      if (matched) {
        return {
          ruleId: 'AMZN-CP-003',
          severity: 'critical',
          message: 'Direct contact information found',
          recommendation: 'Remove all contact info - use Amazon messaging system'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-004',
    category: 'content_policy',
    severity: 'warning',
    name: 'Promotional Language',
    description: 'Avoid time-sensitive promotional language',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const promotionalPhrases = [
        'limited time', 'act now', 'hurry', 'while supplies last',
        'today only', 'special offer', 'exclusive deal', 'discount',
        'sale price', 'reduced price'
      ];

      const searchText = `${listing.description || ''} ${listing.bulletPoints?.join(' ') || ''}`.toLowerCase();
      const matched = promotionalPhrases.find(phrase => searchText.includes(phrase));

      if (matched) {
        return {
          ruleId: 'AMZN-CP-004',
          severity: 'warning',
          message: 'Promotional language detected in product content',
          matchedValue: matched,
          recommendation: 'Remove time-sensitive promotional language'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-005',
    category: 'content_policy',
    severity: 'warning',
    name: 'Subjective Claims',
    description: 'Avoid subjective claims like "best" or "#1"',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const subjectiveClaims = [
        'best seller', 'best quality', 'best price', 'best value',
        '#1', 'number one', 'top rated', 'highest quality', "world's best"
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = subjectiveClaims.find(claim => searchText.includes(claim));

      if (matched) {
        return {
          ruleId: 'AMZN-CP-005',
          severity: 'warning',
          message: 'Subjective claim detected',
          matchedValue: matched,
          recommendation: 'Remove subjective claims unless verified by third party'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-006',
    category: 'content_policy',
    severity: 'info',
    name: 'Customer Review Solicitation',
    description: 'Cannot solicit reviews in product content',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const reviewSolicitation = [
        'leave a review', 'write a review', 'review us', 'rate us',
        'leave feedback', '5 star', 'five star review'
      ];

      const searchText = `${listing.description || ''} ${listing.bulletPoints?.join(' ') || ''}`.toLowerCase();
      const matched = reviewSolicitation.find(phrase => searchText.includes(phrase));

      if (matched) {
        return {
          ruleId: 'AMZN-CP-006',
          severity: 'warning',
          message: 'Review solicitation detected',
          matchedValue: matched,
          recommendation: 'Remove review solicitation - violates Amazon policy'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-007',
    category: 'content_policy',
    severity: 'warning',
    name: 'Warranty Information',
    description: 'Warranty claims must be clear and accurate',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const searchText = `${listing.description || ''} ${listing.bulletPoints?.join(' ') || ''}`.toLowerCase();

      if (searchText.includes('lifetime warranty') || searchText.includes('forever warranty')) {
        return {
          ruleId: 'AMZN-CP-007',
          severity: 'warning',
          message: 'Lifetime warranty claim detected',
          recommendation: 'Ensure warranty terms are clearly defined and legitimate'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-008',
    category: 'content_policy',
    severity: 'critical',
    name: 'Offensive Content',
    description: 'Content must not be offensive or inappropriate',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const offensiveKeywords = [
        'sexy', 'adult', 'explicit', 'xxx', 'nude', 'erotic'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();

      // Exception for legitimate adult product categories
      const legitimateAdultCategories = ['lingerie', 'intimate apparel'];
      const isLegitimateCategory = legitimateAdultCategories.some(cat =>
        listing.category?.toLowerCase().includes(cat)
      );

      if (!isLegitimateCategory) {
        const matched = offensiveKeywords.find(kw => searchText.includes(kw));

        if (matched) {
          return {
            ruleId: 'AMZN-CP-008',
            severity: 'critical',
            message: 'Potentially offensive content detected',
            matchedValue: matched,
            recommendation: 'Review content for appropriateness per Amazon standards'
          };
        }
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-009',
    category: 'content_policy',
    severity: 'info',
    name: 'Comparison to Competitors',
    description: 'Avoid direct comparisons to competitor products',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const comparisonPhrases = [
        'better than', 'superior to', 'beats', 'outperforms',
        'unlike other brands', 'compared to competitors'
      ];

      const searchText = `${listing.description || ''} ${listing.bulletPoints?.join(' ') || ''}`.toLowerCase();
      const matched = comparisonPhrases.find(phrase => searchText.includes(phrase));

      if (matched) {
        return {
          ruleId: 'AMZN-CP-009',
          severity: 'info',
          message: 'Competitor comparison detected',
          matchedValue: matched,
          recommendation: 'Focus on your product benefits without comparing to competitors'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-010',
    category: 'content_policy',
    severity: 'warning',
    name: 'Stock Status Mentions',
    description: 'Do not mention stock levels or availability',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const stockPhrases = [
        'in stock', 'out of stock', 'back in stock', 'low stock',
        'only.*left', 'limited quantity', 'limited stock'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = stockPhrases.find(phrase => new RegExp(phrase).test(searchText));

      if (matched) {
        return {
          ruleId: 'AMZN-CP-010',
          severity: 'warning',
          message: 'Stock status mention detected',
          recommendation: 'Remove stock level references - Amazon displays availability'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-011',
    category: 'content_policy',
    severity: 'critical',
    name: 'Prohibited Symbols',
    description: 'Cannot use certain symbols (trademark, copyright) inappropriately',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const title = listing.title;

      const hasTrademarkSymbol = title.includes('™') || title.includes('®');

      if (hasTrademarkSymbol && !listing.brand) {
        return {
          ruleId: 'AMZN-CP-011',
          severity: 'critical',
          message: 'Trademark symbol used without brand registration',
          recommendation: 'Only use ™ or ® if you own the registered trademark'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-CP-012',
    category: 'content_policy',
    severity: 'warning',
    name: 'Shipping Claims',
    description: 'Cannot make shipping promises in product content',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const shippingClaims = [
        'free shipping', 'fast shipping', 'overnight shipping',
        '2-day shipping', 'prime shipping', 'ships immediately'
      ];

      const searchText = `${listing.title} ${listing.description || ''}`.toLowerCase();
      const matched = shippingClaims.find(claim => searchText.includes(claim));

      if (matched) {
        return {
          ruleId: 'AMZN-CP-012',
          severity: 'warning',
          message: 'Shipping claim in product content',
          matchedValue: matched,
          recommendation: 'Remove shipping claims - Amazon controls shipping display'
        };
      }

      return null;
    }
  }
];

// ============================================================================
// CATEGORY 6: TECHNICAL REQUIREMENTS (10 rules)
// ============================================================================

const technicalRequirementsRules: AmazonComplianceRule[] = [
  {
    id: 'AMZN-TR-001',
    category: 'technical_requirements',
    severity: 'critical',
    name: 'Missing Product Identifiers',
    description: 'Products must have UPC, EAN, or ISBN',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      // Check if ASIN exists but could flag if no proper identifier
      if (listing.asin.startsWith('B0')) {
        // Amazon-generated ASIN, may not have external identifier
        return null;
      }

      // This is informational as we don't have direct access to UPC field
      return {
        ruleId: 'AMZN-TR-001',
        severity: 'info',
        message: 'Ensure product has valid UPC, EAN, or ISBN',
        recommendation: 'Register product with GS1 for legitimate barcodes'
      };
    }
  },

  {
    id: 'AMZN-TR-002',
    category: 'technical_requirements',
    severity: 'warning',
    name: 'SKU Naming Convention',
    description: 'Use clear, logical SKU naming system',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const sku = listing.sku;

      if (sku.length < 3) {
        return {
          ruleId: 'AMZN-TR-002',
          severity: 'warning',
          message: 'SKU is very short - may be unclear',
          field: 'sku',
          recommendation: 'Use descriptive SKUs like BRAND-PRODUCT-SIZE-COLOR'
        };
      }

      // Check for random-looking SKUs (all lowercase or mixed case with no separators)
      if (!/[-_]/.test(sku) && sku.length > 8) {
        return {
          ruleId: 'AMZN-TR-002',
          severity: 'info',
          message: 'Consider using structured SKU format',
          field: 'sku',
          recommendation: 'Use dashes or underscores to separate SKU components'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-TR-003',
    category: 'technical_requirements',
    severity: 'critical',
    name: 'Product Type Selection',
    description: 'Product must be in correct product type',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.productType || listing.productType.trim() === '') {
        return {
          ruleId: 'AMZN-TR-003',
          severity: 'critical',
          message: 'No product type specified',
          field: 'productType',
          recommendation: 'Select the most specific product type for proper categorization'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-TR-004',
    category: 'technical_requirements',
    severity: 'warning',
    name: 'Product Dimensions Required',
    description: 'Physical products should include dimensions',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.dimensions) {
        return {
          ruleId: 'AMZN-TR-004',
          severity: 'warning',
          message: 'No product dimensions provided',
          field: 'dimensions',
          recommendation: 'Add package dimensions (L x W x H) and weight'
        };
      }

      const { length, width, height, weight } = listing.dimensions;

      if (!length || !width || !height || !weight) {
        return {
          ruleId: 'AMZN-TR-004',
          severity: 'warning',
          message: 'Incomplete dimension information',
          field: 'dimensions',
          recommendation: 'Provide complete dimensions: length, width, height, and weight'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-TR-005',
    category: 'technical_requirements',
    severity: 'info',
    name: 'Variation Relationships',
    description: 'Related products should be in parent-child relationships',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      const title = listing.title.toLowerCase();

      // Check if product mentions size or color that suggests variations
      const hasSize = /(small|medium|large|xs|s|m|l|xl|xxl|\d+(\.\d+)?\s*(oz|ml|lb|kg|inch|cm))/.test(title);
      const hasColor = /(black|white|blue|red|green|yellow|pink|purple|gray|brown|orange)/.test(title);

      if (hasSize || hasColor) {
        return {
          ruleId: 'AMZN-TR-005',
          severity: 'info',
          message: 'Product appears to have variations (size/color)',
          recommendation: 'Consider creating parent-child variations for better customer experience'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-TR-006',
    category: 'technical_requirements',
    severity: 'warning',
    name: 'Price Reasonableness',
    description: 'Price should be reasonable for product category',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.price) {
        return {
          ruleId: 'AMZN-TR-006',
          severity: 'critical',
          message: 'No price set for product',
          field: 'price',
          recommendation: 'Set a competitive price for the product'
        };
      }

      if (listing.price < 1) {
        return {
          ruleId: 'AMZN-TR-006',
          severity: 'warning',
          message: `Price is very low ($${listing.price.toFixed(2)})`,
          field: 'price',
          recommendation: 'Ensure price covers costs and Amazon fees'
        };
      }

      if (listing.price > 10000) {
        return {
          ruleId: 'AMZN-TR-006',
          severity: 'warning',
          message: `Price is very high ($${listing.price.toFixed(2)})`,
          field: 'price',
          recommendation: 'Verify price is accurate - unusually high prices may be flagged'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-TR-007',
    category: 'technical_requirements',
    severity: 'info',
    name: 'Product Condition',
    description: 'Condition should match product state',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (!listing.condition) {
        return {
          ruleId: 'AMZN-TR-007',
          severity: 'warning',
          message: 'No condition specified',
          field: 'condition',
          recommendation: 'Specify product condition (New, Used, Refurbished, etc.)'
        };
      }

      if (listing.condition !== 'New' && !listing.conditionNote) {
        return {
          ruleId: 'AMZN-TR-007',
          severity: 'info',
          message: 'Used/refurbished product lacks condition note',
          field: 'conditionNote',
          recommendation: 'Add condition note describing product state'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-TR-008',
    category: 'technical_requirements',
    severity: 'critical',
    name: 'Duplicate Listings',
    description: 'Avoid creating duplicate ASINs',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      // This would require database check in production
      // Informational warning
      return {
        ruleId: 'AMZN-TR-008',
        severity: 'info',
        message: 'Ensure this is not a duplicate listing',
        recommendation: 'Search Amazon catalog before creating new listing - duplicates violate policy'
      };
    }
  },

  {
    id: 'AMZN-TR-009',
    category: 'technical_requirements',
    severity: 'warning',
    name: 'Image Quality Requirements',
    description: 'Main image must be on white background, 1000x1000 pixels minimum',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (listing.mainImageUrl || (listing.images && listing.images.length > 0)) {
        return {
          ruleId: 'AMZN-TR-009',
          severity: 'info',
          message: 'Verify image quality standards',
          recommendation: 'Main image: white background, 1000x1000px minimum, product fills 85% of frame'
        };
      }

      return null;
    }
  },

  {
    id: 'AMZN-TR-010',
    category: 'technical_requirements',
    severity: 'info',
    name: 'Buyable Status',
    description: 'Product should be in buyable status',
    platform: 'amazon',
    check: (listing: AmazonListing) => {
      if (listing.status && listing.status !== 'BUYABLE') {
        let message = '';
        let severity: 'critical' | 'warning' | 'info' = 'warning';

        if (listing.status === 'DELETED') {
          message = 'Product is deleted';
          severity = 'critical';
        } else if (listing.status === 'DISCOVERABLE') {
          message = 'Product is discoverable but not buyable';
          severity = 'warning';
        }

        return {
          ruleId: 'AMZN-TR-010',
          severity,
          message,
          field: 'status',
          recommendation: 'Review listing issues preventing buyable status'
        };
      }

      return null;
    }
  }
];

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const allAmazonRules: AmazonComplianceRule[] = [
  ...productDetailPageRules,      // 12 rules
  ...brandTrademarkRules,          // 8 rules
  ...restrictedCategoryRules,      // 10 rules
  ...fbaRequirementsRules,         // 8 rules
  ...contentPolicyRules,           // 12 rules
  ...technicalRequirementsRules    // 10 rules
];

// Export by category for flexible usage
export const amazonRulesByCategory = {
  product_detail_page: productDetailPageRules,
  brand_trademarks: brandTrademarkRules,
  restricted_categories: restrictedCategoryRules,
  fba_requirements: fbaRequirementsRules,
  content_policy: contentPolicyRules,
  technical_requirements: technicalRequirementsRules
};

// Rule count summary
export const amazonRuleSummary = {
  total: allAmazonRules.length,
  byCategory: {
    product_detail_page: productDetailPageRules.length,
    brand_trademarks: brandTrademarkRules.length,
    restricted_categories: restrictedCategoryRules.length,
    fba_requirements: fbaRequirementsRules.length,
    content_policy: contentPolicyRules.length,
    technical_requirements: technicalRequirementsRules.length
  },
  bySeverity: {
    critical: allAmazonRules.filter(r => r.severity === 'critical').length,
    warning: allAmazonRules.filter(r => r.severity === 'warning').length,
    info: allAmazonRules.filter(r => r.severity === 'info').length
  }
};
