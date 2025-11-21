/**
 * SellerGuard Pro - Comprehensive Etsy Compliance Rules
 *
 * This file contains 40+ compliance rules organized into 5 categories:
 * 1. Prohibited Items (15 rules)
 * 2. Title & Description Quality (10 rules)
 * 3. Policy Compliance (10 rules)
 * 4. Pricing & Fees (5 rules)
 * 5. Shop Standards (8 rules)
 */

import { EtsyComplianceRule, EtsyListing, ViolationResult } from '../types/compliance';

// ============================================================================
// CATEGORY 1: PROHIBITED ITEMS (15 rules)
// ============================================================================

const prohibitedItemsRules: EtsyComplianceRule[] = [
  {
    id: 'ETSY-PI-001',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Weapons and Weapon Accessories',
    description: 'Listings cannot contain weapons, firearms, or weapon accessories',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'gun', 'firearm', 'rifle', 'pistol', 'revolver', 'shotgun', 'ammunition',
        'ammo', 'bullet', 'weapon', 'AR-15', 'AK-47', 'glock', 'beretta',
        'brass knuckles', 'nunchucks', 'throwing star', 'switchblade', 'taser'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchText));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-001',
          severity: 'critical',
          message: 'Weapons and weapon accessories are prohibited on Etsy',
          matchedValue: matched,
          recommendation: 'Remove this listing immediately to avoid account suspension'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-002',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Illegal Drugs and Drug Paraphernalia',
    description: 'Listings cannot promote illegal drugs or drug paraphernalia',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'cocaine', 'heroin', 'methamphetamine', 'meth', 'crack', 'lsd', 'ecstasy',
        'mdma', 'marijuana', 'weed', 'cannabis', 'thc', 'cbd oil', 'bong',
        'crack pipe', 'meth pipe', 'drug test', 'synthetic urine'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchText));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-002',
          severity: 'critical',
          message: 'Illegal drugs and drug paraphernalia are strictly prohibited',
          matchedValue: matched,
          recommendation: 'Remove this listing immediately'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-003',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Adult Content and Services',
    description: 'Adult content, pornography, and adult services are prohibited',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'porn', 'pornography', 'xxx', 'adult toy', 'sex toy', 'vibrator',
        'dildo', 'escort', 'webcam show', 'nude photo', 'explicit content',
        'adult entertainment', 'sexual service', 'erotic massage'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchText));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-003',
          severity: 'critical',
          message: 'Adult content and services are prohibited on Etsy',
          matchedValue: matched,
          recommendation: 'Remove adult content or reclassify listing'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-004',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Counterfeit and Trademark Violations',
    description: 'Cannot sell counterfeit items or violate trademarks',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const brands = [
        'nike', 'adidas', 'gucci', 'louis vuitton', 'chanel', 'prada', 'rolex',
        'disney', 'marvel', 'star wars', 'pokemon', 'hello kitty', 'supreme',
        'versace', 'burberry', 'coach', 'tiffany', 'cartier', 'hermes',
        'ray-ban', 'oakley', 'michael kors', 'kate spade', 'yeezy', 'jordan'
      ];

      const suspiciousTerms = ['replica', 'inspired by', 'style', 'type', 'like', 'similar to'];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matchedBrand = brands.find(brand => searchText.includes(brand));
      const hasSuspiciousTerm = suspiciousTerms.some(term => searchText.includes(term));

      if (matchedBrand && hasSuspiciousTerm) {
        return {
          ruleId: 'ETSY-PI-004',
          severity: 'critical',
          message: 'Potential trademark violation or counterfeit product',
          matchedValue: matchedBrand,
          recommendation: 'Remove brand references unless you have proper licensing'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-005',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Prescription Drugs and Medical Devices',
    description: 'Prescription medications and regulated medical devices are prohibited',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'prescription', 'viagra', 'cialis', 'xanax', 'adderall', 'oxycodone',
        'medical device', 'insulin pump', 'nebulizer', 'cpap', 'pacemaker',
        'prescription drug', 'rx medication', 'pharmacy', 'pharmaceutical'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchText));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-005',
          severity: 'critical',
          message: 'Prescription drugs and medical devices require proper authorization',
          matchedValue: matched,
          recommendation: 'Remove unless you have proper medical licensing'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-006',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Hazardous Materials',
    description: 'Hazardous chemicals and flammable materials have restrictions',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'asbestos', 'mercury', 'lead paint', 'radioactive', 'explosive',
        'fireworks', 'gasoline', 'kerosene', 'toxic chemical', 'poison',
        'pesticide', 'aerosol spray', 'compressed gas', 'lithium battery'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchText));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-006',
          severity: 'critical',
          message: 'Hazardous materials require special handling and may be prohibited',
          matchedValue: matched,
          recommendation: 'Verify compliance with shipping regulations or remove'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-007',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Recalled Items',
    description: 'Items subject to government recalls cannot be sold',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = ['recalled product', 'safety recall', 'government recall', 'cpsc recall'];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-007',
          severity: 'critical',
          message: 'Recalled items cannot be sold on Etsy',
          matchedValue: matched,
          recommendation: 'Remove recalled products immediately'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-008',
    category: 'prohibited_items',
    severity: 'warning',
    name: 'Tobacco Products',
    description: 'Tobacco and vaping products have restrictions',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'cigarette', 'cigar', 'tobacco', 'vape', 'e-cigarette', 'vaping',
        'e-liquid', 'nicotine', 'hookah', 'smoking pipe', 'rolling papers'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchText));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-008',
          severity: 'warning',
          message: 'Tobacco and vaping products may be restricted',
          matchedValue: matched,
          recommendation: 'Review Etsy tobacco policy or consider removal'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-009',
    category: 'prohibited_items',
    severity: 'warning',
    name: 'Alcohol Products',
    description: 'Alcoholic beverages require special compliance',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'wine', 'beer', 'liquor', 'vodka', 'whiskey', 'rum', 'tequila',
        'moonshine', 'alcoholic beverage', 'spirits', 'champagne', 'sake'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();

      // Allow wine/beer accessories
      if (searchText.includes('holder') || searchText.includes('glass') ||
          searchText.includes('opener') || searchText.includes('rack')) {
        return null;
      }

      const matched = keywords.find(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchText));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-009',
          severity: 'warning',
          message: 'Alcohol sales require special licensing and compliance',
          matchedValue: matched,
          recommendation: 'Ensure proper licensing or only sell non-alcoholic items'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-010',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Animal Products - Endangered Species',
    description: 'Products from endangered or protected animals are prohibited',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'ivory', 'elephant tusk', 'rhino horn', 'tiger skin', 'turtle shell',
        'coral', 'whale bone', 'seal fur', 'big cat', 'pangolin', 'bear bile'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-010',
          severity: 'critical',
          message: 'Products from endangered species are strictly prohibited',
          matchedValue: matched,
          recommendation: 'Remove immediately - may result in legal action'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-011',
    category: 'prohibited_items',
    severity: 'warning',
    name: 'Live Animals',
    description: 'Live animals and certain animal products are restricted',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'live animal', 'live pet', 'puppy for sale', 'kitten for sale',
        'live bird', 'live fish', 'live reptile', 'animal breeding'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-011',
          severity: 'warning',
          message: 'Live animals cannot be sold on Etsy',
          matchedValue: matched,
          recommendation: 'Only sell animal-related supplies and accessories'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-012',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Human Remains',
    description: 'Human remains and body parts are prohibited',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'human skull', 'human bone', 'human remains', 'cremated remains',
        'human teeth', 'human hair' // note: some vintage human hair items are allowed
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();

      // Exception for vintage human hair jewelry
      if (searchText.includes('vintage') && searchText.includes('hair') &&
          (searchText.includes('jewelry') || searchText.includes('locket'))) {
        return null;
      }

      const matched = keywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-012',
          severity: 'critical',
          message: 'Human remains are prohibited except vintage hair jewelry',
          matchedValue: matched,
          recommendation: 'Remove immediately unless vintage hair jewelry'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-013',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Hate Items and Nazi Memorabilia',
    description: 'Items promoting hate, violence, or Nazi ideology are prohibited',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const keywords = [
        'swastika', 'nazi', 'kkk', 'white supremacy', 'hate group',
        'confederate flag', 'hitler', 'third reich', 'ss officer'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = keywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-013',
          severity: 'critical',
          message: 'Items promoting hate or featuring Nazi symbols are prohibited',
          matchedValue: matched,
          recommendation: 'Remove immediately - violates Etsy anti-discrimination policy'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-014',
    category: 'prohibited_items',
    severity: 'warning',
    name: 'Medical and Health Claims',
    description: 'Unsubstantiated medical or health claims are prohibited',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const claims = [
        'cures cancer', 'treats diabetes', 'cures covid', 'fda approved',
        'medical grade', 'clinically proven', 'guaranteed to cure', 'heals',
        'treats disease', 'prevents illness', 'miracle cure', 'medical treatment'
      ];

      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const matched = claims.find(claim => searchText.includes(claim));

      if (matched) {
        return {
          ruleId: 'ETSY-PI-014',
          severity: 'warning',
          message: 'Unsubstantiated medical claims violate Etsy policy',
          matchedValue: matched,
          recommendation: 'Remove medical claims or provide FDA approval documentation'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PI-015',
    category: 'prohibited_items',
    severity: 'critical',
    name: 'Downloadable Items - Resale Rights',
    description: 'Digital items must not violate copyright or resale rights',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const searchText = `${listing.title} ${listing.description}`.toLowerCase();

      const hasDownload = searchText.includes('digital download') ||
                          searchText.includes('printable') ||
                          searchText.includes('pdf');

      const hasResaleTerms = searchText.includes('resale rights') ||
                             searchText.includes('plr') ||
                             searchText.includes('private label rights') ||
                             searchText.includes('master resale rights');

      if (hasDownload && hasResaleTerms) {
        return {
          ruleId: 'ETSY-PI-015',
          severity: 'critical',
          message: 'Digital items with resale rights may violate Etsy handmade policy',
          recommendation: 'Only sell your own original digital creations'
        };
      }
      return null;
    }
  }
];

// ============================================================================
// CATEGORY 2: TITLE & DESCRIPTION QUALITY (10 rules)
// ============================================================================

const titleDescriptionRules: EtsyComplianceRule[] = [
  {
    id: 'ETSY-TD-001',
    category: 'title_description',
    severity: 'warning',
    name: 'Title Too Short',
    description: 'Title should be at least 20 characters for better SEO',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (listing.title.length < 20) {
        return {
          ruleId: 'ETSY-TD-001',
          severity: 'warning',
          message: `Title is only ${listing.title.length} characters - should be at least 20`,
          field: 'title',
          recommendation: 'Add descriptive keywords to improve search visibility'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-TD-002',
    category: 'title_description',
    severity: 'info',
    name: 'Title Optimal Length',
    description: 'Title should use most of the 140 character limit for best SEO',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (listing.title.length < 60 && listing.title.length >= 20) {
        return {
          ruleId: 'ETSY-TD-002',
          severity: 'info',
          message: `Title is ${listing.title.length} characters - consider using up to 140 for better SEO`,
          field: 'title',
          recommendation: 'Add more descriptive keywords and product details'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-TD-003',
    category: 'title_description',
    severity: 'warning',
    name: 'Excessive Capitalization',
    description: 'Avoid excessive capital letters in titles',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const capsPattern = /[A-Z]{5,}/;
      if (capsPattern.test(listing.title)) {
        return {
          ruleId: 'ETSY-TD-003',
          severity: 'warning',
          message: 'Title contains excessive capitalization',
          field: 'title',
          recommendation: 'Use title case or sentence case for better readability'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-TD-004',
    category: 'title_description',
    severity: 'info',
    name: 'Excessive Punctuation',
    description: 'Avoid excessive exclamation marks or special characters',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const exclamationCount = (listing.title.match(/!/g) || []).length;
      if (exclamationCount > 2) {
        return {
          ruleId: 'ETSY-TD-004',
          severity: 'info',
          message: `Title contains ${exclamationCount} exclamation marks`,
          field: 'title',
          recommendation: 'Use minimal punctuation for professional appearance'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-TD-005',
    category: 'title_description',
    severity: 'warning',
    name: 'Description Too Short',
    description: 'Description should be at least 100 characters',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (listing.description.length < 100) {
        return {
          ruleId: 'ETSY-TD-005',
          severity: 'warning',
          message: `Description is only ${listing.description.length} characters - should be at least 100`,
          field: 'description',
          recommendation: 'Add product details, dimensions, materials, and care instructions'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-TD-006',
    category: 'title_description',
    severity: 'critical',
    name: 'External Links in Description',
    description: 'Descriptions cannot contain external links',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const urlPattern = /(https?:\/\/|www\.|\.com|\.net|\.org)/i;
      if (urlPattern.test(listing.description)) {
        return {
          ruleId: 'ETSY-TD-006',
          severity: 'critical',
          message: 'Description contains external links or URLs',
          field: 'description',
          recommendation: 'Remove all external links - violates Etsy policy'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-TD-007',
    category: 'title_description',
    severity: 'warning',
    name: 'Contact Information in Description',
    description: 'Avoid including direct contact information',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const contactPatterns = [
        /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // phone numbers
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // emails
        /whatsapp/i,
        /contact me at/i,
        /email me/i,
        /call me/i
      ];

      const matched = contactPatterns.find(pattern => pattern.test(listing.description));

      if (matched) {
        return {
          ruleId: 'ETSY-TD-007',
          severity: 'warning',
          message: 'Description contains contact information',
          field: 'description',
          recommendation: 'Use Etsy messaging system - direct contact violates policy'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-TD-008',
    category: 'title_description',
    severity: 'warning',
    name: 'Spam Keywords',
    description: 'Avoid spammy marketing language',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const spamKeywords = [
        'buy now', 'click here', 'limited time', 'act now', 'order today',
        'best price', 'lowest price', 'cheap', 'deal of the day', 'hurry'
      ];

      const searchText = listing.description.toLowerCase();
      const matched = spamKeywords.find(kw => searchText.includes(kw));

      if (matched) {
        return {
          ruleId: 'ETSY-TD-008',
          severity: 'warning',
          message: 'Description contains spammy marketing language',
          field: 'description',
          matchedValue: matched,
          recommendation: 'Use professional, descriptive language instead'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-TD-009',
    category: 'title_description',
    severity: 'info',
    name: 'Missing Size Information',
    description: 'Physical items should include size/dimension information',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const hasSizeInfo = /\b(\d+\.?\d*\s*(inch|cm|mm|meter|foot|ft|"|x|×))/i.test(searchText) ||
                         searchText.includes('dimensions') ||
                         searchText.includes('size:');

      // Only check physical items
      const isDigital = searchText.includes('digital') || searchText.includes('printable') || searchText.includes('download');

      if (!hasSizeInfo && !isDigital && listing.quantity > 0) {
        return {
          ruleId: 'ETSY-TD-009',
          severity: 'info',
          message: 'Consider adding size or dimension information',
          recommendation: 'Include measurements to reduce customer questions'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-TD-010',
    category: 'title_description',
    severity: 'info',
    name: 'Missing Material Information',
    description: 'Include material composition in description',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const searchText = listing.description.toLowerCase();
      const hasMaterialInfo = searchText.includes('material') ||
                             searchText.includes('made of') ||
                             searchText.includes('fabric:') ||
                             listing.materials.length > 0;

      const isDigital = searchText.includes('digital') || searchText.includes('printable');

      if (!hasMaterialInfo && !isDigital) {
        return {
          ruleId: 'ETSY-TD-010',
          severity: 'info',
          message: 'Consider adding material information to description',
          recommendation: 'Specify materials used for transparency and SEO'
        };
      }
      return null;
    }
  }
];

// ============================================================================
// CATEGORY 3: POLICY COMPLIANCE (10 rules)
// ============================================================================

const policyComplianceRules: EtsyComplianceRule[] = [
  {
    id: 'ETSY-PC-001',
    category: 'policy_compliance',
    severity: 'warning',
    name: 'Missing Required Tags',
    description: 'Listings should have at least 3 tags for discoverability',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (listing.tags.length < 3) {
        return {
          ruleId: 'ETSY-PC-001',
          severity: 'warning',
          message: `Only ${listing.tags.length} tags - should have at least 3`,
          field: 'tags',
          recommendation: 'Add more relevant tags to improve search visibility'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PC-002',
    category: 'policy_compliance',
    severity: 'info',
    name: 'Optimize Tag Usage',
    description: 'Use all 13 available tags for maximum visibility',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (listing.tags.length < 13) {
        return {
          ruleId: 'ETSY-PC-002',
          severity: 'info',
          message: `Using ${listing.tags.length}/13 tags - add more for better SEO`,
          field: 'tags',
          recommendation: 'Maximize tag usage with relevant keywords'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PC-003',
    category: 'policy_compliance',
    severity: 'warning',
    name: 'Missing Materials',
    description: 'Physical items should specify materials used',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const isDigital = listing.title.toLowerCase().includes('digital') ||
                       listing.description.toLowerCase().includes('digital download');

      if (listing.materials.length === 0 && !isDigital) {
        return {
          ruleId: 'ETSY-PC-003',
          severity: 'warning',
          message: 'No materials specified for physical item',
          field: 'materials',
          recommendation: 'Add materials for transparency and compliance'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PC-004',
    category: 'policy_compliance',
    severity: 'warning',
    name: 'Missing Shipping Profile',
    description: 'All listings must have a shipping profile',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (!listing.shipping_profile_id) {
        return {
          ruleId: 'ETSY-PC-004',
          severity: 'warning',
          message: 'No shipping profile assigned',
          field: 'shipping_profile_id',
          recommendation: 'Assign a shipping profile to this listing'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PC-005',
    category: 'policy_compliance',
    severity: 'info',
    name: 'Missing Processing Time',
    description: 'Specify processing time for customer expectations',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (!listing.processing_min || !listing.processing_max) {
        return {
          ruleId: 'ETSY-PC-005',
          severity: 'info',
          message: 'Processing time not specified',
          recommendation: 'Set processing time to manage customer expectations'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PC-006',
    category: 'policy_compliance',
    severity: 'critical',
    name: 'Handmade Attribute Required',
    description: 'Must specify who made the item (I did, collective, someone else)',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (!listing.who_made) {
        return {
          ruleId: 'ETSY-PC-006',
          severity: 'critical',
          message: '"Who Made" attribute is missing',
          field: 'who_made',
          recommendation: 'Specify whether item is handmade, by collective, or produced'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PC-007',
    category: 'policy_compliance',
    severity: 'critical',
    name: 'When Made Attribute Required',
    description: 'Must specify when the item was made',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (!listing.when_made) {
        return {
          ruleId: 'ETSY-PC-007',
          severity: 'critical',
          message: '"When Made" attribute is missing',
          field: 'when_made',
          recommendation: 'Specify time period when item was made'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PC-008',
    category: 'policy_compliance',
    severity: 'warning',
    name: 'Supply Items Designation',
    description: 'Craft supplies should be marked as supplies',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const isSupplyRelated = searchText.includes('supply') ||
                             searchText.includes('craft supply') ||
                             searchText.includes('beads') ||
                             searchText.includes('fabric by the yard') ||
                             searchText.includes('yarn');

      if (isSupplyRelated && !listing.is_supply) {
        return {
          ruleId: 'ETSY-PC-008',
          severity: 'warning',
          message: 'Item appears to be a supply but not marked as such',
          field: 'is_supply',
          recommendation: 'Mark as supply if selling craft supplies or materials'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PC-009',
    category: 'policy_compliance',
    severity: 'warning',
    name: 'Missing Product Photos',
    description: 'Listings should have multiple high-quality photos',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const imageCount = listing.images?.length || 0;
      if (imageCount < 3) {
        return {
          ruleId: 'ETSY-PC-009',
          severity: 'warning',
          message: `Only ${imageCount} image(s) - recommend at least 3-5`,
          field: 'images',
          recommendation: 'Add multiple angles and detail shots for better conversion'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PC-010',
    category: 'policy_compliance',
    severity: 'info',
    name: 'Shop Sections Organization',
    description: 'Organize listings into shop sections',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (!listing.shop_section_id) {
        return {
          ruleId: 'ETSY-PC-010',
          severity: 'info',
          message: 'Listing not assigned to a shop section',
          field: 'shop_section_id',
          recommendation: 'Organize listings into sections for better navigation'
        };
      }
      return null;
    }
  }
];

// ============================================================================
// CATEGORY 4: PRICING & FEES (5 rules)
// ============================================================================

const pricingFeesRules: EtsyComplianceRule[] = [
  {
    id: 'ETSY-PF-001',
    category: 'pricing_fees',
    severity: 'warning',
    name: 'Price Too Low',
    description: 'Price may be too low to be profitable after fees',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const price = listing.price.amount / listing.price.divisor;

      if (price < 5) {
        const etsyFee = price * 0.065; // 6.5% transaction fee
        const paymentFee = (price * 0.03) + 0.25; // 3% + $0.25
        const listingFee = 0.20;
        const totalFees = etsyFee + paymentFee + listingFee;
        const profit = price - totalFees;

        return {
          ruleId: 'ETSY-PF-001',
          severity: 'warning',
          message: `Price $${price.toFixed(2)} may not be profitable (fees: $${totalFees.toFixed(2)}, profit: $${profit.toFixed(2)})`,
          field: 'price',
          recommendation: 'Consider raising price to cover fees and materials'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PF-002',
    category: 'pricing_fees',
    severity: 'info',
    name: 'Competitive Pricing Analysis',
    description: 'Review pricing relative to production costs',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const price = listing.price.amount / listing.price.divisor;
      const etsyFee = price * 0.065;
      const paymentFee = (price * 0.03) + 0.25;
      const listingFee = 0.20;
      const totalFees = etsyFee + paymentFee + listingFee;
      const feePercentage = (totalFees / price) * 100;

      if (feePercentage > 25) {
        return {
          ruleId: 'ETSY-PF-002',
          severity: 'info',
          message: `Fees are ${feePercentage.toFixed(1)}% of price - consider pricing strategy`,
          field: 'price',
          recommendation: 'Higher prices reduce fee percentage impact'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PF-003',
    category: 'pricing_fees',
    severity: 'warning',
    name: 'Unusually High Price',
    description: 'Very high prices may indicate an error',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const price = listing.price.amount / listing.price.divisor;

      if (price > 5000) {
        return {
          ruleId: 'ETSY-PF-003',
          severity: 'warning',
          message: `Price $${price.toFixed(2)} is very high - verify this is correct`,
          field: 'price',
          recommendation: 'Ensure price is accurate and justified in description'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PF-004',
    category: 'pricing_fees',
    severity: 'info',
    name: 'Psychological Pricing',
    description: 'Consider charm pricing strategies',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const price = listing.price.amount / listing.price.divisor;
      const cents = Math.round((price % 1) * 100);

      // Check if price ends in .99, .95, or .00
      const isCharmPrice = cents === 99 || cents === 95 || cents === 0;

      if (!isCharmPrice && price > 10) {
        return {
          ruleId: 'ETSY-PF-004',
          severity: 'info',
          message: 'Consider charm pricing (e.g., $19.99 instead of $20.37)',
          field: 'price',
          recommendation: 'Prices ending in .99 or .95 may improve conversion'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-PF-005',
    category: 'pricing_fees',
    severity: 'warning',
    name: 'Free Shipping Consideration',
    description: 'Consider offering free shipping by adjusting price',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const price = listing.price.amount / listing.price.divisor;

      // Free shipping is recommended for orders $35+
      if (price >= 25 && price < 35) {
        return {
          ruleId: 'ETSY-PF-005',
          severity: 'info',
          message: 'Consider free shipping - item close to $35 threshold',
          recommendation: 'Etsy promotes listings with free shipping on orders $35+'
        };
      }
      return null;
    }
  }
];

// ============================================================================
// CATEGORY 5: SHOP STANDARDS (8 rules)
// ============================================================================

const shopStandardsRules: EtsyComplianceRule[] = [
  {
    id: 'ETSY-SS-001',
    category: 'shop_standards',
    severity: 'warning',
    name: 'Out of Stock',
    description: 'Listing shows as out of stock',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (listing.quantity === 0) {
        return {
          ruleId: 'ETSY-SS-001',
          severity: 'warning',
          message: 'Item is out of stock',
          field: 'quantity',
          recommendation: 'Restock or deactivate listing to maintain shop quality'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-SS-002',
    category: 'shop_standards',
    severity: 'info',
    name: 'Low Stock Warning',
    description: 'Inventory running low',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (listing.quantity > 0 && listing.quantity <= 3) {
        return {
          ruleId: 'ETSY-SS-002',
          severity: 'info',
          message: `Low stock: only ${listing.quantity} remaining`,
          field: 'quantity',
          recommendation: 'Consider restocking popular items'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-SS-003',
    category: 'shop_standards',
    severity: 'warning',
    name: 'Listing Not Active',
    description: 'Listing is in draft or inactive state',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      if (listing.state !== 'active') {
        return {
          ruleId: 'ETSY-SS-003',
          severity: 'warning',
          message: `Listing state is "${listing.state}" - not visible to buyers`,
          field: 'state',
          recommendation: 'Activate listing to make it available for purchase'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-SS-004',
    category: 'shop_standards',
    severity: 'info',
    name: 'SEO Keyword Optimization',
    description: 'Ensure keywords are used effectively',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const title = listing.title.toLowerCase();
      const description = listing.description.toLowerCase();
      const tags = listing.tags.map(t => t.toLowerCase());

      // Check if title keywords are repeated in tags
      const titleWords = title.split(' ').filter(w => w.length > 3);
      const repeatedInTags = titleWords.filter(word =>
        tags.some(tag => tag.includes(word))
      );

      if (repeatedInTags.length < 3) {
        return {
          ruleId: 'ETSY-SS-004',
          severity: 'info',
          message: 'Consider reinforcing title keywords in tags',
          recommendation: 'Repeat important keywords from title in tags for better SEO'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-SS-005',
    category: 'shop_standards',
    severity: 'info',
    name: 'Seasonal Relevance',
    description: 'Consider seasonal trends and keywords',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const currentMonth = new Date().getMonth() + 1;

      // Summer items in winter or vice versa
      const summerKeywords = ['beach', 'summer', 'swimsuit', 'sandals', 'sunglasses'];
      const winterKeywords = ['winter', 'christmas', 'snow', 'sweater', 'coat', 'holiday'];

      const hasSummer = summerKeywords.some(kw => searchText.includes(kw));
      const hasWinter = winterKeywords.some(kw => searchText.includes(kw));

      // Winter is Dec-Feb (12, 1, 2), Summer is Jun-Aug (6, 7, 8)
      if (hasSummer && (currentMonth >= 11 || currentMonth <= 2)) {
        return {
          ruleId: 'ETSY-SS-005',
          severity: 'info',
          message: 'Summer item during winter season - consider seasonal marketing',
          recommendation: 'Adjust keywords or prepare for off-season'
        };
      }

      if (hasWinter && (currentMonth >= 5 && currentMonth <= 9)) {
        return {
          ruleId: 'ETSY-SS-005',
          severity: 'info',
          message: 'Winter item during summer season - plan ahead for peak season',
          recommendation: 'Stock up for holiday season or adjust marketing'
        };
      }

      return null;
    }
  },

  {
    id: 'ETSY-SS-006',
    category: 'shop_standards',
    severity: 'info',
    name: 'Gift-Worthy Optimization',
    description: 'Consider gift-related keywords for occasions',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const searchText = `${listing.title} ${listing.description}`.toLowerCase();
      const giftKeywords = ['gift', 'present', 'birthday', 'wedding', 'anniversary', 'mothers day', 'fathers day'];

      const hasGiftKeyword = giftKeywords.some(kw => searchText.includes(kw));
      const hasGiftTag = listing.tags.some(tag => giftKeywords.some(kw => tag.toLowerCase().includes(kw)));

      // Item might be gift-worthy but doesn't mention it
      const giftWorthyCategories = ['jewelry', 'home decor', 'personalized', 'custom', 'handmade'];
      const seemsGiftWorthy = giftWorthyCategories.some(cat => searchText.includes(cat));

      if (seemsGiftWorthy && !hasGiftKeyword && !hasGiftTag) {
        return {
          ruleId: 'ETSY-SS-006',
          severity: 'info',
          message: 'Item may be gift-worthy - consider adding gift keywords',
          recommendation: 'Add "gift", "birthday gift", etc. to increase visibility'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-SS-007',
    category: 'shop_standards',
    severity: 'info',
    name: 'Variation Opportunities',
    description: 'Consider offering product variations',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const searchText = `${listing.title} ${listing.description}`.toLowerCase();

      // Look for items that could have color variations
      const colorMentions = ['color', 'colour', 'black', 'white', 'blue', 'red', 'green'];
      const hasColorMention = colorMentions.some(c => searchText.includes(c));

      // Look for items that could have size variations
      const sizeMentions = ['size', 'small', 'medium', 'large', 'xs', 'xl'];
      const hasSizeMention = sizeMentions.some(s => searchText.includes(s));

      if ((hasColorMention || hasSizeMention) && listing.quantity > 5) {
        return {
          ruleId: 'ETSY-SS-007',
          severity: 'info',
          message: 'Consider offering variations (colors, sizes) for this item',
          recommendation: 'Variations improve customer choice and can increase sales'
        };
      }
      return null;
    }
  },

  {
    id: 'ETSY-SS-008',
    category: 'shop_standards',
    severity: 'info',
    name: 'Return Policy Clarity',
    description: 'Ensure return policy is mentioned',
    platform: 'etsy',
    check: (listing: EtsyListing) => {
      const description = listing.description.toLowerCase();
      const hasReturnMention = description.includes('return') ||
                              description.includes('refund') ||
                              description.includes('exchange') ||
                              description.includes('policy');

      // Digital items typically have different return policies
      const isDigital = description.includes('digital') || description.includes('download');

      if (!hasReturnMention && !isDigital) {
        return {
          ruleId: 'ETSY-SS-008',
          severity: 'info',
          message: 'Consider mentioning return policy in description',
          recommendation: 'Clear return policy builds buyer confidence'
        };
      }
      return null;
    }
  }
];

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const allEtsyRules: EtsyComplianceRule[] = [
  ...prohibitedItemsRules,      // 15 rules
  ...titleDescriptionRules,     // 10 rules
  ...policyComplianceRules,     // 10 rules
  ...pricingFeesRules,          // 5 rules
  ...shopStandardsRules         // 8 rules
];

// Export by category for flexible usage
export const etsyRulesByCategory = {
  prohibited_items: prohibitedItemsRules,
  title_description: titleDescriptionRules,
  policy_compliance: policyComplianceRules,
  pricing_fees: pricingFeesRules,
  shop_standards: shopStandardsRules
};

// Rule count summary
export const etsyRuleSummary = {
  total: allEtsyRules.length,
  byCategory: {
    prohibited_items: prohibitedItemsRules.length,
    title_description: titleDescriptionRules.length,
    policy_compliance: policyComplianceRules.length,
    pricing_fees: pricingFeesRules.length,
    shop_standards: shopStandardsRules.length
  },
  bySeverity: {
    critical: allEtsyRules.filter(r => r.severity === 'critical').length,
    warning: allEtsyRules.filter(r => r.severity === 'warning').length,
    info: allEtsyRules.filter(r => r.severity === 'info').length
  }
};
