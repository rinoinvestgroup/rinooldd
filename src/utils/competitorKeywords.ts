/**
 * Competitor Keywords Mapping
 * Based on PropertyFinder.com keyword analysis (Dec 2025)
 * 
 * This file contains keyword mappings extracted from competitor research
 * to enhance SEO performance across the website.
 */

export interface CompetitorKeyword {
  keyword: string;
  volume: number;
  cpc: number;
  seo_difficulty: number;
  paid_difficulty: number;
  relevancy: number;
  current_ranking_site: string;
}

/**
 * High-priority keywords where rinoproperties.com is already ranking
 */
export const OWNED_KEYWORDS: CompetitorKeyword[] = [
  {
    keyword: "dubai residential oasis",
    volume: 12100,
    cpc: 6.90,
    seo_difficulty: 16,
    paid_difficulty: 10,
    relevancy: 0.71,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "jumeirah garden city",
    volume: 12100,
    cpc: 6.10,
    seo_difficulty: 12,
    paid_difficulty: 26,
    relevancy: 0.62,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "binghatti apartments",
    volume: 5400,
    cpc: 22.26,
    seo_difficulty: 12,
    paid_difficulty: 11,
    relevancy: 0.73,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "south residence jvc",
    volume: 5400,
    cpc: 4.04,
    seo_difficulty: 12,
    paid_difficulty: 11,
    relevancy: 0.58,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "south residences jvc",
    volume: 5400,
    cpc: 4.04,
    seo_difficulty: 12,
    paid_difficulty: 11,
    relevancy: 0.57,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "barsha modern apartments",
    volume: 3600,
    cpc: 2.86,
    seo_difficulty: 13,
    paid_difficulty: 10,
    relevancy: 0.62,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "prime gourmet umm suqeim",
    volume: 3600,
    cpc: 4.11,
    seo_difficulty: 23,
    paid_difficulty: 9,
    relevancy: 0.51,
    current_ranking_site: "rinoproperties.com"
  }
];

/**
 * High-volume opportunity keywords
 */
export const OPPORTUNITY_KEYWORDS: CompetitorKeyword[] = [
  {
    keyword: "one bedroom apartment for sale in dubai",
    volume: 1900,
    cpc: 13.18,
    seo_difficulty: 16,
    paid_difficulty: 33,
    relevancy: 0.91,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "luxury real estate dubai",
    volume: 1600,
    cpc: 20.27,
    seo_difficulty: 39,
    paid_difficulty: 20,
    relevancy: 0.88,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "luxury property dubai",
    volume: 1600,
    cpc: 20.27,
    seo_difficulty: 52,
    paid_difficulty: 20,
    relevancy: 0.83,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "dubai marina apartment for sale",
    volume: 1300,
    cpc: 12.05,
    seo_difficulty: 26,
    paid_difficulty: 33,
    relevancy: 0.86,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "2 bedroom apartments dubai",
    volume: 1300,
    cpc: 5.51,
    seo_difficulty: 21,
    paid_difficulty: 64,
    relevancy: 0.83,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "best real estate companies in dubai",
    volume: 1000,
    cpc: 14.73,
    seo_difficulty: 45,
    paid_difficulty: 36,
    relevancy: 0.81,
    current_ranking_site: "rinoproperties.com"
  }
];

/**
 * Long-tail keywords with low competition
 */
export const LONG_TAIL_KEYWORDS: CompetitorKeyword[] = [
  {
    keyword: "city apartments jvc",
    volume: 1600,
    cpc: 5.80,
    seo_difficulty: 13,
    paid_difficulty: 13,
    relevancy: 0.67,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "the perfect blend dubai jvc",
    volume: 1300,
    cpc: 7.12,
    seo_difficulty: 26,
    paid_difficulty: 10,
    relevancy: 0.61,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "hotel apartments in al barsha",
    volume: 1300,
    cpc: 4.81,
    seo_difficulty: 20,
    paid_difficulty: 99,
    relevancy: 0.66,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "apartment for sale in palm jumeirah",
    volume: 590,
    cpc: 11.53,
    seo_difficulty: 19,
    paid_difficulty: 40,
    relevancy: 0.81,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "buy apartment in palm jumeirah",
    volume: 590,
    cpc: 11.53,
    seo_difficulty: 25,
    paid_difficulty: 40,
    relevancy: 0.77,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "studio apartment for sale in international city dubai",
    volume: 260,
    cpc: 6.28,
    seo_difficulty: 15,
    paid_difficulty: 75,
    relevancy: 0.88,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "villas for sale in jumeirah park",
    volume: 480,
    cpc: 5.73,
    seo_difficulty: 15,
    paid_difficulty: 77,
    relevancy: 0.80,
    current_ranking_site: "rinoproperties.com"
  },
  {
    keyword: "jumeirah golf estates villas for sale",
    volume: 260,
    cpc: 10.10,
    seo_difficulty: 27,
    paid_difficulty: 66,
    relevancy: 0.75,
    current_ranking_site: "rinoproperties.com"
  }
];

/**
 * Location-based keywords mapping
 */
export const LOCATION_KEYWORDS: Record<string, string[]> = {
  "jvc": [
    "south residence jvc",
    "south residences jvc",
    "city apartments jvc",
    "the perfect blend dubai jvc",
    "hotel apartments jvc",
    "laundry in jvc",
    "villa for sale in jvc dubai"
  ],
  "jumeirah-garden-city": [
    "jumeirah garden city",
    "al noor building jumeirah garden city",
    "garden city dubai",
    "jumeirah garden city park",
    "jumeirah garden city 18a street dubai",
    "oasis village jumeirah security office"
  ],
  "dubai-marina": [
    "dubai marina apartment for sale",
    "dubai marina direction"
  ],
  "palm-jumeirah": [
    "apartment for sale in palm jumeirah",
    "apartments for sale in palm jumeirah",
    "palm jumeirah apartment for sale",
    "buy apartment in palm jumeirah",
    "apartments for sale palm jumeirah",
    "buy apartment palm jumeirah",
    "real estate in palm jumeirah",
    "palm jumeirah real estate"
  ],
  "al-barsha": [
    "barsha modern apartments",
    "hotel apartments in al barsha",
    "studio apartment al barsha",
    "rooms in al barsha"
  ],
  "international-city": [
    "studio flat in international city dubai",
    "studio apartment for sale in international city dubai"
  ],
  "downtown-dubai": [
    "buy apartment in downtown dubai"
  ],
  "dubai-hills": [
    "dubai hills villas for sale"
  ],
  "jumeirah-park": [
    "villas for sale in jumeirah park"
  ],
  "jumeirah-golf-estates": [
    "jumeirah golf estates villas for sale",
    "villas for sale jumeirah golf estates"
  ],
  "umm-suqeim": [
    "prime gourmet umm suqeim",
    "villas in umm suqeim"
  ],
  "city-walk": [
    "studio 971 city walk"
  ],
  "arjan": [
    "hotel in arjan dubai"
  ],
  "satwa": [
    "room in satwa dubai"
  ],
  "deira": [
    "bed space dubai deira"
  ]
};

/**
 * Property type keywords mapping
 */
export const PROPERTY_TYPE_KEYWORDS: Record<string, string[]> = {
  "apartments": [
    "one bedroom apartment for sale in dubai",
    "1 bedroom apartment dubai for sale",
    "2 bedroom apartments dubai",
    "barsha modern apartments",
    "binghatti apartments",
    "hotel apartments in al barsha",
    "studio apartment al barsha"
  ],
  "villas": [
    "dubai hills villas for sale",
    "villas for sale in jumeirah park",
    "jumeirah golf estates villas for sale",
    "villas in umm suqeim",
    "marbella villas"
  ],
  "studios": [
    "studio flat in international city dubai",
    "studio apartment for sale in international city dubai",
    "studio 971 city walk"
  ],
  "luxury": [
    "luxury real estate dubai",
    "luxury property dubai",
    "luxury mansion dubai",
    "luxury mansions dubai",
    "luxury properties hub"
  ]
};

/**
 * Amenity and feature keywords
 */
export const AMENITY_KEYWORDS: string[] = [
  "dubai residential oasis",
  "oasis village jumeirah security office",
  "mind and sense spa dubai",
  "mind & sense spa dubai",
  "beach horse riding dubai",
  "the perfect blend dubai jvc",
  "prime garden dubai",
  "samana business park"
];

/**
 * Informational/Commercial keywords
 */
export const COMMERCIAL_KEYWORDS: string[] = [
  "best real estate companies in dubai",
  "dubai real estate careers",
  "real estate market dubai",
  "property news dubai",
  "dubai real estate data",
  "dubai real estate websites",
  "dubai property website",
  "dubai property websites",
  "dubai real estate agent salary",
  "dubai property group careers",
  "dubai properties group contact number",
  "international property show 2025"
];

/**
 * Generate SEO-optimized title for location pages
 */
export const generateLocationTitle = (location: string): string => {
  const titles: Record<string, string> = {
    "jvc": "JVC Properties for Sale | Jumeirah Village Circle",
    "jumeirah-garden-city": "Jumeirah Garden City Dubai ",
    "dubai-marina": "Dubai Marina Apartments ",
    "palm-jumeirah": "Palm Jumeirah Real Estate ",
    "al-barsha": "Al Barsha Apartments ",
    "international-city": "International City Dubai ",
    "downtown-dubai": "Downtown Dubai Properties ",
    "dubai-hills": "Dubai Hills Villas ",
    "jumeirah-park": "Jumeirah Park Villas for Sale | Exclusive Dubai Properties",
    "jumeirah-golf-estates": "Jumeirah Golf Estates Villas | Luxury Golf Course Properties"
  };
  
  return titles[location] || `${location.replace(/-/g, ' ')} Properties for Sale `;
};

/**
 * Generate SEO-optimized meta description for location pages
 */
export const generateLocationDescription = (location: string): string => {
  const descriptions: Record<string, string> = {
    "jvc": "Discover premium properties in Jumeirah Village Circle (JVC) Dubai. South Residence, City Apartments, and luxury hotel apartments. Expert real estate services by Rino Properties.",
    "jumeirah-garden-city": "Explore Jumeirah Garden City's residential oasis. Premium apartments, villas & townhouses in Dubai's most sought-after garden community. Contact Rino Properties today.",
    "dubai-marina": "Find your dream apartment in Dubai Marina. Luxury waterfront properties with stunning views. Expert guidance from Rino Properties for Dubai Marina real estate.",
    "palm-jumeirah": "Premium Palm Jumeirah real estate. Luxury apartments and villas on Dubai's iconic island. Investment opportunities and exclusive properties with Rino Properties.",
    "al-barsha": "Modern apartments in Al Barsha Dubai. Hotel apartments, studios & family residences. Affordable luxury living with expert real estate services.",
    "international-city": "Affordable studio apartments in International City Dubai. Budget-friendly properties with great ROI. Expert guidance from Rino Properties.",
    "downtown-dubai": "Buy premium apartments in Downtown Dubai. City center luxury properties near Burj Khalifa. Expert real estate services by Rino Properties.",
    "dubai-hills": "Luxury villas in Dubai Hills Estate. Family homes with golf course views, parks & premium amenities. Contact Rino Properties for exclusive listings.",
    "jumeirah-park": "Exclusive villas for sale in Jumeirah Park Dubai. Luxury family homes in gated community with parks & amenities. Expert real estate guidance.",
    "jumeirah-golf-estates": "Luxury villas in Jumeirah Golf Estates. Premium properties with golf course access. Investment opportunities with Rino Properties."
  };
  
  return descriptions[location] || `Discover premium properties in ${location.replace(/-/g, ' ')}. Expert real estate services by Rino Properties Dubai.`;
};

/**
 * Generate SEO keywords for location pages
 */
export const generateLocationKeywords = (location: string): string => {
  const baseKeywords = [
    "dubai real estate",
    "properties for sale dubai",
    "luxury properties dubai",
    "dubai property investment"
  ];
  
  const locationSpecific = LOCATION_KEYWORDS[location] || [];
  
  return [...baseKeywords, ...locationSpecific].join(", ");
};

/**
 * Get related keywords for a property type
 */
export const getPropertyTypeKeywords = (type: string): string[] => {
  const normalizedType = type.toLowerCase();
  
  if (normalizedType.includes('apartment')) return PROPERTY_TYPE_KEYWORDS.apartments;
  if (normalizedType.includes('villa')) return PROPERTY_TYPE_KEYWORDS.villas;
  if (normalizedType.includes('studio')) return PROPERTY_TYPE_KEYWORDS.studios;
  if (normalizedType.includes('luxury') || normalizedType.includes('penthouse')) {
    return PROPERTY_TYPE_KEYWORDS.luxury;
  }
  
  return [];
};

/**
 * Get high-priority keywords for homepage
 */
export const getHomepageKeywords = (): string => {
  return [
    ...OWNED_KEYWORDS.slice(0, 10).map(k => k.keyword),
    "dubai real estate",
    "luxury properties uae",
    "property investment dubai",
    "real estate dubai"
  ].join(", ");
};

/**
 * Export all keywords for sitemap generation
 */
export const ALL_COMPETITOR_KEYWORDS = [
  ...OWNED_KEYWORDS,
  ...OPPORTUNITY_KEYWORDS,
  ...LONG_TAIL_KEYWORDS
];

export default {
  OWNED_KEYWORDS,
  OPPORTUNITY_KEYWORDS,
  LONG_TAIL_KEYWORDS,
  LOCATION_KEYWORDS,
  PROPERTY_TYPE_KEYWORDS,
  AMENITY_KEYWORDS,
  COMMERCIAL_KEYWORDS,
  generateLocationTitle,
  generateLocationDescription,
  generateLocationKeywords,
  getPropertyTypeKeywords,
  getHomepageKeywords,
  ALL_COMPETITOR_KEYWORDS
};
