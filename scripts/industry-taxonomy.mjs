/** Every FEC-reported sector we classify — patterns match employer, PAC, or spender names */

export const INDUSTRY_TAXONOMY = [
  { id: "pro-israel", label: "Pro-Israel Advocacy", patterns: ["united democracy", "aipac", "norpac", "dmfi", "democratic majority for israel", "republican jewish", "j street", "zionist", "pro-israel", "pro israel", "ushpac"] },
  { id: "pharma", label: "Pharma & Health", patterns: ["pfizer", "merck", "abbvie", "johnson & johnson", "eli lilly", "amgen", "pharmaceutical", "pharma", "unitedhealth", "anthem", "cigna", "hospital", "healthcare", "biotech", "medtronic", "health pac", "medical"] },
  { id: "fossil-fuels", label: "Fossil Fuels & Energy", patterns: ["exxon", "chevron", "koch", "marathon", "valero", "occidental", "conocophillips", "shell", "bp america", "oil", "gas", "petroleum", "coal", "utility", "utilities", "nextera", "duke energy", "energy pac"] },
  { id: "agriculture", label: "Agriculture & Agribusiness", patterns: ["monsanto", "bayer", "cargill", "archer daniels", "adm", "deere", "farm bureau", "dairy", "cattle", "poultry", "sugar", "corn", "agriculture", "agribusiness", "fertilizer", "farm pac"] },
  { id: "tech", label: "Technology", patterns: ["google", "alphabet", "microsoft", "apple", "amazon", "meta", "facebook", "netflix", "oracle", "salesforce", "intel", "nvidia", "ibm", "cisco", "software", "technology", "tech"] },
  { id: "fintech", label: "Finance & Fintech", patterns: ["goldman", "jpmorgan", "morgan stanley", "citigroup", "bank of america", "wells fargo", "blackstone", "blackrock", "kkr", "carlyle", "visa", "mastercard", "paypal", "fintech", "capital one", "american express", "banking", "financial", "investment", "venture", "capital"] },
  { id: "defense", label: "Defense & Aerospace", patterns: ["lockheed", "raytheon", "northrop", "boeing", "general dynamics", "bae", "l3harris", "defense", "aerospace", "weapons", "military"] },
  { id: "tobacco", label: "Tobacco", patterns: ["altria", "philip morris", "rj reynolds", "tobacco", "juul"] },
  { id: "private-prisons", label: "Private Prisons", patterns: ["geo group", "corecivic", "private prison", "corrections corp"] },
  { id: "real-estate", label: "Real Estate", patterns: ["real estate", "realty", "property", "developer", "reit", "housing", "landlord", "real estate pac"] },
  { id: "telecom-media", label: "Telecom & Media", patterns: ["comcast", "at&t", "verizon", "t-mobile", "disney", "fox", "news corp", "telecom", "media", "broadcast", "cable", "video", "placements", "communications"] },
  { id: "insurance", label: "Insurance", patterns: ["insurance", "state farm", "allstate", "liberty mutual", "berkshire", "aetna", "humana"] },
  { id: "labor", label: "Labor Unions", patterns: ["afl-cio", "seiu", "teamsters", "afscme", "union", "labor", "teachers union", "uaw", "ibew", "cwa", "workers", "teachers"] },
  { id: "legal", label: "Legal & Trial Lawyers", patterns: ["trial lawyer", "attorney", "law firm", "legal", "lawyer", "bar association", "trial lawyers"] },
  { id: "education", label: "Education", patterns: ["university", "college", "school", "education", "professor", "teacher", "academic"] },
  { id: "crypto", label: "Crypto & Blockchain", patterns: ["crypto", "bitcoin", "blockchain", "coinbase", "binance", "ethereum"] },
  { id: "guns", label: "Gun Rights", patterns: ["nra", "national rifle", "gun", "firearms", "sportsmen"] },
  { id: "environment", label: "Environmental", patterns: ["sierra club", "environment", "conservation", "greenpeace", "climate", "league of conservation", "environmental"] },
  { id: "civic-advocacy", label: "Civic & Advocacy", patterns: ["naacp", "aclu", "planned parenthood", "emily's list", "actblue", "winred", "advocacy", "civic", "nonprofit", "foundation", "progress", "democracy"] },
  { id: "conservative-youth", label: "Conservative Youth Orgs", patterns: ["turning point", "young americans", "heritage foundation", "cato", "club for growth", "americans for prosperity"] },
  { id: "fraternal", label: "Fraternal & Alumni", patterns: ["fraternity", "sorority", "alumni", "sigma", "delta", "fraternal", "rotary", "elks", "moose lodge"] },
  { id: "hospitality", label: "Hospitality & Tourism", patterns: ["hotel", "hospitality", "restaurant", "casino", "tourism", "marriott", "hilton"] },
  { id: "transport", label: "Transportation", patterns: ["airline", "railroad", "shipping", "trucking", "transport", "automotive", "ford", "gm ", "general motors", "toyota"] },
  { id: "retail", label: "Retail & Commerce", patterns: ["walmart", "target", "costco", "retail", "commerce", "amazon", "kroger"] },
  {
    id: "political-committee",
    label: "Political Committees",
    patterns: [
      "pac",
      "committee",
      "victory fund",
      "leadership fund",
      "campaign",
      "for senate",
      "for congress",
      "for house",
      "re-elect",
      "re election",
      "re-election",
      "action fund",
      "political action",
      "cmte",
      "strategies",
      "consulting",
      "holdings",
      "election",
      "caucus",
      "majority",
      "minority",
    ],
  },
];

const NON_EMPLOYER = new Set([
  "not employed",
  "not employed/",
  "self",
  "self-employed",
  "self employed",
  "retired",
  "uncategorized",
  "committee",
  "political committee",
  "political committees",
  "none",
  "n/a",
  "na",
  "unknown",
  "not available",
  "information requested",
  "information requested per fec",
  "information requested per fec:",
  "see below",
  "various",
  "student",
  "homemaker",
  "disabled",
  "unemployed",
]);

const PAC_NAME_HINTS =
  /\b(pac|committee|fund|campaign|for senate|for congress|for house|re-?elect|action fund|political action|cmte|caucus|strategies|consulting|holdings|media|election)\b/i;

export function classifySource(name, employer = "") {
  const text = `${name} ${employer}`.toLowerCase();
  for (const sector of INDUSTRY_TAXONOMY) {
    if (sector.patterns.some((p) => text.includes(p))) {
      return sector;
    }
  }

  const emp = employer.trim().toLowerCase();
  const employerMissing = !emp || NON_EMPLOYER.has(emp);

  if (PAC_NAME_HINTS.test(name)) {
    return { id: "political-committee", label: "Political Committees", patterns: [] };
  }

  if (!employerMissing) {
    return { id: "other-employer", label: employer.trim(), patterns: [] };
  }

  if (emp && NON_EMPLOYER.has(emp)) {
    return { id: "not-disclosed", label: "Employer Not Disclosed", patterns: [] };
  }

  return { id: "uncategorized", label: "Uncategorized", patterns: [] };
}

export function isControversialIndustry(label) {
  const controversial = ["Tobacco", "Fossil Fuels & Energy", "Private Prisons", "Pharma & Health", "Defense & Aerospace", "Pro-Israel Advocacy"];
  return controversial.some((c) => label.includes(c) || c.includes(label));
}