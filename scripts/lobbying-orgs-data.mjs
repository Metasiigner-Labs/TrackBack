/**
 * Curated influence organizations — Senate LDA + FEC name/sector matching.
 * Sectors align with industry-taxonomy.mjs labels where possible.
 */

export const KNOWN_LOBBYING_ORGS = [
  // ── Pro-Israel & foreign policy ──
  { id: "aipac", label: "AIPAC", sector: "Pro-Israel Advocacy", ldaRegistrantName: "AMERICAN ISRAEL PUBLIC AFFAIRS", fecPatterns: ["aipac", "american israel public affairs"] },
  { id: "j-street", label: "J Street", sector: "Pro-Israel Advocacy", ldaClientName: "J STREET", fecPatterns: ["j street"] },
  { id: "norpac", label: "NorPAC", sector: "Pro-Israel Advocacy", fecPatterns: ["norpac"] },
  { id: "dmfi", label: "Democratic Majority for Israel", sector: "Pro-Israel Advocacy", fecPatterns: ["democratic majority for israel", "dmfi"] },
  { id: "rjc", label: "Republican Jewish Coalition", sector: "Pro-Israel Advocacy", ldaClientName: "REPUBLICAN JEWISH", fecPatterns: ["republican jewish"] },
  { id: "udp", label: "United Democracy Project (AIPAC super PAC)", sector: "Pro-Israel Advocacy", fecPatterns: ["united democracy project"] },

  // ── Pharma & health ──
  { id: "phrma", label: "PhRMA", sector: "Pharma & Health", ldaClientName: "PHARMACEUTICAL RESEARCH", ldaRegistrantName: "PHARMACEUTICAL RESEARCH AND MANUFACTURERS", fecPatterns: ["phrma", "pharmaceutical research", "manufacturers of america"] },
  { id: "pfizer", label: "Pfizer", sector: "Pharma & Health", ldaClientName: "PFIZER", fecPatterns: ["pfizer"] },
  { id: "merck", label: "Merck", sector: "Pharma & Health", ldaClientName: "MERCK", fecPatterns: ["merck"] },
  { id: "jnj", label: "Johnson & Johnson", sector: "Pharma & Health", ldaClientName: "JOHNSON & JOHNSON", fecPatterns: ["johnson & johnson", "johnson and johnson"] },
  { id: "lilly", label: "Eli Lilly", sector: "Pharma & Health", ldaClientName: "ELI LILLY", fecPatterns: ["eli lilly", "lilly"] },
  { id: "abbvie", label: "AbbVie", sector: "Pharma & Health", ldaClientName: "ABBVIE", fecPatterns: ["abbvie"] },
  { id: "amgen", label: "Amgen", sector: "Pharma & Health", ldaClientName: "AMGEN", fecPatterns: ["amgen"] },
  { id: "gilead", label: "Gilead Sciences", sector: "Pharma & Health", ldaClientName: "GILEAD", fecPatterns: ["gilead"] },
  { id: "bms", label: "Bristol-Myers Squibb", sector: "Pharma & Health", ldaClientName: "BRISTOL-MYERS", fecPatterns: ["bristol-myers", "bristol myers"] },
  { id: "moderna", label: "Moderna", sector: "Pharma & Health", ldaClientName: "MODERNA", fecPatterns: ["moderna"] },
  { id: "unitedhealth", label: "UnitedHealth Group", sector: "Pharma & Health", ldaClientName: "UNITEDHEALTH", fecPatterns: ["unitedhealth", "united health"] },
  { id: "elevance", label: "Elevance Health (Anthem)", sector: "Pharma & Health", ldaClientName: "ELEVANCE", fecPatterns: ["elevance", "anthem", "wellpoint"] },
  { id: "cigna", label: "Cigna", sector: "Pharma & Health", ldaClientName: "CIGNA", fecPatterns: ["cigna"] },
  { id: "humana", label: "Humana", sector: "Pharma & Health", ldaClientName: "HUMANA", fecPatterns: ["humana"] },
  { id: "cvs", label: "CVS Health", sector: "Pharma & Health", ldaClientName: "CVS", fecPatterns: ["cvs health", "cvs"] },
  { id: "ahip", label: "AHIP (Health Insurance Plans)", sector: "Pharma & Health", ldaClientName: "AMERICA'S HEALTH INSURANCE", fecPatterns: ["ahip", "health insurance plans"] },
  { id: "aha", label: "American Hospital Association", sector: "Pharma & Health", ldaClientName: "AMERICAN HOSPITAL ASSOCIATION", fecPatterns: ["american hospital association", "hospital association"] },
  { id: "bio", label: "Biotechnology Innovation Organization", sector: "Pharma & Health", ldaClientName: "BIOTECHNOLOGY INNOVATION", fecPatterns: ["biotechnology innovation", "bio "] },

  // ── Fossil fuels & energy ──
  { id: "api", label: "American Petroleum Institute", sector: "Fossil Fuels & Energy", ldaClientName: "AMERICAN PETROLEUM INSTITUTE", fecPatterns: ["american petroleum institute", "petroleum institute"] },
  { id: "exxon", label: "ExxonMobil", sector: "Fossil Fuels & Energy", ldaClientName: "EXXON", fecPatterns: ["exxon", "exxonmobil"] },
  { id: "chevron", label: "Chevron", sector: "Fossil Fuels & Energy", ldaClientName: "CHEVRON", fecPatterns: ["chevron"] },
  { id: "koch", label: "Koch Industries", sector: "Fossil Fuels & Energy", ldaClientName: "KOCH", fecPatterns: ["koch industries", "koch companies"] },
  { id: "marathon", label: "Marathon Petroleum", sector: "Fossil Fuels & Energy", ldaClientName: "MARATHON", fecPatterns: ["marathon petroleum", "marathon oil"] },
  { id: "valero", label: "Valero Energy", sector: "Fossil Fuels & Energy", ldaClientName: "VALERO", fecPatterns: ["valero"] },
  { id: "conocophillips", label: "ConocoPhillips", sector: "Fossil Fuels & Energy", ldaClientName: "CONOCOPHILLIPS", fecPatterns: ["conocophillips"] },
  { id: "occidental", label: "Occidental Petroleum", sector: "Fossil Fuels & Energy", ldaClientName: "OCCIDENTAL", fecPatterns: ["occidental petroleum", "occidental"] },
  { id: "shell", label: "Shell USA", sector: "Fossil Fuels & Energy", ldaClientName: "SHELL", fecPatterns: ["shell oil", "shell usa"] },
  { id: "bp", label: "BP America", sector: "Fossil Fuels & Energy", ldaClientName: "BP AMERICA", fecPatterns: ["bp america", "british petroleum"] },
  { id: "eei", label: "Edison Electric Institute", sector: "Fossil Fuels & Energy", ldaClientName: "EDISON ELECTRIC", fecPatterns: ["edison electric institute"] },
  { id: "duke-energy", label: "Duke Energy", sector: "Fossil Fuels & Energy", ldaClientName: "DUKE ENERGY", fecPatterns: ["duke energy"] },
  { id: "nextera", label: "NextEra Energy", sector: "Fossil Fuels & Energy", ldaClientName: "NEXTERA", fecPatterns: ["nextera"] },
  { id: "nma", label: "National Mining Association", sector: "Fossil Fuels & Energy", ldaClientName: "NATIONAL MINING", fecPatterns: ["national mining association"] },

  // ── Defense & aerospace ──
  { id: "boeing", label: "Boeing", sector: "Defense & Aerospace", ldaClientName: "BOEING", fecPatterns: ["boeing"] },
  { id: "lockheed", label: "Lockheed Martin", sector: "Defense & Aerospace", ldaClientName: "LOCKHEED MARTIN", fecPatterns: ["lockheed"] },
  { id: "raytheon", label: "RTX / Raytheon", sector: "Defense & Aerospace", ldaClientName: "RAYTHEON", fecPatterns: ["raytheon", "rtx"] },
  { id: "northrop", label: "Northrop Grumman", sector: "Defense & Aerospace", ldaClientName: "NORTHROP GRUMMAN", fecPatterns: ["northrop grumman", "northrop"] },
  { id: "gd", label: "General Dynamics", sector: "Defense & Aerospace", ldaClientName: "GENERAL DYNAMICS", fecPatterns: ["general dynamics"] },
  { id: "l3harris", label: "L3Harris Technologies", sector: "Defense & Aerospace", ldaClientName: "L3HARRIS", fecPatterns: ["l3harris", "l3 harris"] },
  { id: "bae", label: "BAE Systems", sector: "Defense & Aerospace", ldaClientName: "BAE SYSTEMS", fecPatterns: ["bae systems"] },

  // ── Agriculture & food ──
  { id: "adm", label: "Archer Daniels Midland", sector: "Agriculture & Agribusiness", ldaClientName: "ARCHER DANIELS MIDLAND", fecPatterns: ["archer daniels", "adm"] },
  { id: "bayer", label: "Bayer / Crop Science", sector: "Agriculture & Agribusiness", ldaClientName: "BAYER", fecPatterns: ["bayer", "monsanto"] },
  { id: "cargill", label: "Cargill", sector: "Agriculture & Agribusiness", ldaClientName: "CARGILL", fecPatterns: ["cargill"] },
  { id: "deere", label: "Deere & Company", sector: "Agriculture & Agribusiness", ldaClientName: "DEERE", fecPatterns: ["deere", "john deere"] },
  { id: "farm-bureau", label: "American Farm Bureau Federation", sector: "Agriculture & Agribusiness", ldaClientName: "FARM BUREAU", fecPatterns: ["farm bureau"] },
  { id: "tyson", label: "Tyson Foods", sector: "Agriculture & Agribusiness", ldaClientName: "TYSON", fecPatterns: ["tyson foods", "tyson"] },
  { id: "coca-cola", label: "Coca-Cola", sector: "Agriculture & Agribusiness", ldaClientName: "COCA-COLA", fecPatterns: ["coca-cola", "coca cola"] },
  { id: "pepsico", label: "PepsiCo", sector: "Agriculture & Agribusiness", ldaClientName: "PEPSICO", fecPatterns: ["pepsico", "pepsi"] },

  // ── Technology ──
  { id: "google", label: "Google / Alphabet", sector: "Technology", ldaClientName: "GOOGLE", fecPatterns: ["google", "alphabet"] },
  { id: "meta", label: "Meta", sector: "Technology", ldaClientName: "META PLATFORMS", fecPatterns: ["meta platforms", "facebook", "meta"] },
  { id: "amazon", label: "Amazon", sector: "Technology", ldaClientName: "AMAZON", fecPatterns: ["amazon"] },
  { id: "microsoft", label: "Microsoft", sector: "Technology", ldaClientName: "MICROSOFT", fecPatterns: ["microsoft"] },
  { id: "apple", label: "Apple", sector: "Technology", ldaClientName: "APPLE", fecPatterns: ["apple inc", "apple"] },
  { id: "oracle", label: "Oracle", sector: "Technology", ldaClientName: "ORACLE", fecPatterns: ["oracle"] },
  { id: "salesforce", label: "Salesforce", sector: "Technology", ldaClientName: "SALESFORCE", fecPatterns: ["salesforce"] },
  { id: "intel", label: "Intel", sector: "Technology", ldaClientName: "INTEL", fecPatterns: ["intel"] },
  { id: "nvidia", label: "Nvidia", sector: "Technology", ldaClientName: "NVIDIA", fecPatterns: ["nvidia"] },
  { id: "ibm", label: "IBM", sector: "Technology", ldaClientName: "IBM", fecPatterns: ["ibm"] },
  { id: "cisco", label: "Cisco", sector: "Technology", ldaClientName: "CISCO", fecPatterns: ["cisco"] },
  { id: "netflix", label: "Netflix", sector: "Technology", ldaClientName: "NETFLIX", fecPatterns: ["netflix"] },
  { id: "uber", label: "Uber", sector: "Technology", ldaClientName: "UBER", fecPatterns: ["uber"] },
  { id: "bytedance", label: "ByteDance / TikTok", sector: "Technology", ldaClientName: "BYTEDANCE", fecPatterns: ["bytedance", "tiktok"] },

  // ── Finance & fintech ──
  { id: "jpmorgan", label: "JPMorgan Chase", sector: "Finance & Fintech", ldaClientName: "JPMORGAN", fecPatterns: ["jpmorgan", "jp morgan"] },
  { id: "goldman", label: "Goldman Sachs", sector: "Finance & Fintech", ldaClientName: "GOLDMAN SACHS", fecPatterns: ["goldman sachs", "goldman"] },
  { id: "morgan-stanley", label: "Morgan Stanley", sector: "Finance & Fintech", ldaClientName: "MORGAN STANLEY", fecPatterns: ["morgan stanley"] },
  { id: "citigroup", label: "Citigroup", sector: "Finance & Fintech", ldaClientName: "CITIGROUP", fecPatterns: ["citigroup", "citibank"] },
  { id: "bofa", label: "Bank of America", sector: "Finance & Fintech", ldaClientName: "BANK OF AMERICA", fecPatterns: ["bank of america"] },
  { id: "wells-fargo", label: "Wells Fargo", sector: "Finance & Fintech", ldaClientName: "WELLS FARGO", fecPatterns: ["wells fargo"] },
  { id: "blackstone", label: "Blackstone", sector: "Finance & Fintech", ldaClientName: "BLACKSTONE", fecPatterns: ["blackstone"] },
  { id: "blackrock", label: "BlackRock", sector: "Finance & Fintech", ldaClientName: "BLACKROCK", fecPatterns: ["blackrock"] },
  { id: "visa", label: "Visa", sector: "Finance & Fintech", ldaClientName: "VISA", fecPatterns: ["visa"] },
  { id: "mastercard", label: "Mastercard", sector: "Finance & Fintech", ldaClientName: "MASTERCARD", fecPatterns: ["mastercard"] },
  { id: "aba", label: "American Bankers Association", sector: "Finance & Fintech", ldaClientName: "AMERICAN BANKERS", fecPatterns: ["american bankers association"] },
  { id: "sifma", label: "SIFMA (Securities Industry)", sector: "Finance & Fintech", ldaClientName: "SECURITIES INDUSTRY AND FINANCIAL", fecPatterns: ["sifma", "securities industry"] },

  // ── Telecom & media ──
  { id: "comcast", label: "Comcast / NBCUniversal", sector: "Telecom & Media", ldaClientName: "COMCAST", fecPatterns: ["comcast", "nbcuniversal"] },
  { id: "att", label: "AT&T", sector: "Telecom & Media", ldaClientName: "AT&T", fecPatterns: ["at&t", "att"] },
  { id: "verizon", label: "Verizon", sector: "Telecom & Media", ldaClientName: "VERIZON", fecPatterns: ["verizon"] },
  { id: "tmobile", label: "T-Mobile", sector: "Telecom & Media", ldaClientName: "T-MOBILE", fecPatterns: ["t-mobile", "tmobile"] },
  { id: "disney", label: "Walt Disney Company", sector: "Telecom & Media", ldaClientName: "DISNEY", fecPatterns: ["walt disney", "disney"] },
  { id: "fox", label: "Fox Corporation", sector: "Telecom & Media", ldaClientName: "FOX", fecPatterns: ["fox corporation", "fox news"] },
  { id: "news-corp", label: "News Corp", sector: "Telecom & Media", ldaClientName: "NEWS CORP", fecPatterns: ["news corp", "news corporation"] },

  // ── Tobacco ──
  { id: "altria", label: "Altria", sector: "Tobacco", ldaClientName: "ALTRIA", fecPatterns: ["altria"] },
  { id: "philip-morris", label: "Philip Morris USA", sector: "Tobacco", ldaClientName: "PHILIP MORRIS", fecPatterns: ["philip morris"] },
  { id: "reynolds", label: "Reynolds American", sector: "Tobacco", ldaClientName: "REYNOLDS AMERICAN", fecPatterns: ["reynolds american", "rj reynolds"] },

  // ── Private prisons ──
  { id: "geo-group", label: "GEO Group", sector: "Private Prisons", ldaClientName: "GEO GROUP", fecPatterns: ["geo group"] },
  { id: "corecivic", label: "CoreCivic", sector: "Private Prisons", ldaClientName: "CORECIVIC", fecPatterns: ["corecivic", "corrections corporation"] },

  // ── Real estate ──
  { id: "nar", label: "National Association of Realtors", sector: "Real Estate", ldaClientName: "NATIONAL ASSOCIATION OF REALTORS", fecPatterns: ["national association of realtors", "realtors"] },
  { id: "nahb", label: "National Association of Home Builders", sector: "Real Estate", ldaClientName: "NATIONAL ASSOCIATION OF HOME BUILDERS", fecPatterns: ["home builders", "nahb"] },

  // ── Labor unions ──
  { id: "afl-cio", label: "AFL-CIO", sector: "Labor Unions", ldaClientName: "AFL-CIO", fecPatterns: ["afl-cio", "afl cio"] },
  { id: "seiu", label: "SEIU", sector: "Labor Unions", ldaClientName: "SEIU", fecPatterns: ["seiu", "service employees international"] },
  { id: "teamsters", label: "Teamsters", sector: "Labor Unions", ldaClientName: "TEAMSTERS", fecPatterns: ["teamsters"] },
  { id: "afscme", label: "AFSCME", sector: "Labor Unions", ldaClientName: "AFSCME", fecPatterns: ["afscme"] },
  { id: "uaw", label: "UAW", sector: "Labor Unions", ldaClientName: "UAW", fecPatterns: ["uaw", "united auto workers"] },
  { id: "nea", label: "National Education Association", sector: "Labor Unions", ldaClientName: "NATIONAL EDUCATION ASSOCIATION", fecPatterns: ["national education association", "nea"] },

  // ── Civic & advocacy ──
  { id: "aarp", label: "AARP", sector: "Civic & Advocacy", ldaClientName: "AARP", fecPatterns: ["aarp"] },
  { id: "naacp", label: "NAACP", sector: "Civic & Advocacy", ldaClientName: "NAACP", fecPatterns: ["naacp"] },
  { id: "planned-parenthood", label: "Planned Parenthood", sector: "Civic & Advocacy", ldaClientName: "PLANNED PARENTHOOD", fecPatterns: ["planned parenthood"] },
  { id: "aclu", label: "ACLU", sector: "Civic & Advocacy", ldaClientName: "AMERICAN CIVIL LIBERTIES", fecPatterns: ["aclu", "civil liberties union"] },
  { id: "emilys-list", label: "EMILY's List", sector: "Civic & Advocacy", fecPatterns: ["emily's list", "emilys list"] },
  { id: "lcv", label: "League of Conservation Voters", sector: "Civic & Advocacy", ldaClientName: "LEAGUE OF CONSERVATION", fecPatterns: ["league of conservation voters"] },

  // ── Conservative / libertarian influence ──
  { id: "heritage", label: "Heritage Foundation", sector: "Conservative Youth Orgs", ldaClientName: "HERITAGE FOUNDATION", fecPatterns: ["heritage foundation"] },
  { id: "cato", label: "Cato Institute", sector: "Conservative Youth Orgs", ldaClientName: "CATO INSTITUTE", fecPatterns: ["cato institute"] },
  { id: "club-for-growth", label: "Club for Growth", sector: "Conservative Youth Orgs", ldaClientName: "CLUB FOR GROWTH", fecPatterns: ["club for growth"] },
  { id: "afp", label: "Americans for Prosperity", sector: "Conservative Youth Orgs", ldaClientName: "AMERICANS FOR PROSPERITY", fecPatterns: ["americans for prosperity"] },
  { id: "turning-point", label: "Turning Point USA", sector: "Conservative Youth Orgs", fecPatterns: ["turning point usa", "turning point"] },
  { id: "aei", label: "American Enterprise Institute", sector: "Conservative Youth Orgs", ldaClientName: "AMERICAN ENTERPRISE INSTITUTE", fecPatterns: ["american enterprise institute"] },

  // ── Environmental ──
  { id: "sierra-club", label: "Sierra Club", sector: "Environmental", ldaClientName: "SIERRA CLUB", fecPatterns: ["sierra club"] },
  { id: "nrdc", label: "NRDC", sector: "Environmental", ldaClientName: "NATURAL RESOURCES DEFENSE", fecPatterns: ["natural resources defense", "nrdc"] },
  { id: "edf", label: "Environmental Defense Fund", sector: "Environmental", ldaClientName: "ENVIRONMENTAL DEFENSE", fecPatterns: ["environmental defense fund", "edf"] },

  // ── Guns ──
  { id: "nra", label: "NRA / National Rifle Association", sector: "Gun Rights", ldaClientName: "NATIONAL RIFLE ASSOCIATION", fecPatterns: ["national rifle", "nra"] },

  // ── Hospitality & gambling ──
  { id: "aga", label: "American Gaming Association", sector: "Hospitality & Tourism", ldaClientName: "AMERICAN GAMING", fecPatterns: ["american gaming association"] },
  { id: "mgm", label: "MGM Resorts", sector: "Hospitality & Tourism", ldaClientName: "MGM RESORTS", fecPatterns: ["mgm resorts", "mgm"] },
  { id: "marriott", label: "Marriott International", sector: "Hospitality & Tourism", ldaClientName: "MARRIOTT", fecPatterns: ["marriott"] },

  // ── Transportation ──
  { id: "ford", label: "Ford Motor Company", sector: "Transportation", ldaClientName: "FORD MOTOR", fecPatterns: ["ford motor", "ford"] },
  { id: "gm", label: "General Motors", sector: "Transportation", ldaClientName: "GENERAL MOTORS", fecPatterns: ["general motors", "gm "] },
  { id: "airlines-america", label: "Airlines for America", sector: "Transportation", ldaClientName: "AIRLINES FOR AMERICA", fecPatterns: ["airlines for america"] },
  { id: "fedex", label: "FedEx", sector: "Transportation", ldaClientName: "FEDEX", fecPatterns: ["fedex"] },
  { id: "ups", label: "UPS", sector: "Transportation", ldaClientName: "UPS", fecPatterns: ["ups", "united parcel"] },

  // ── Retail ──
  { id: "walmart", label: "Walmart", sector: "Retail & Commerce", ldaClientName: "WALMART", fecPatterns: ["walmart"] },
  { id: "nrf", label: "National Retail Federation", sector: "Retail & Commerce", ldaClientName: "NATIONAL RETAIL FEDERATION", fecPatterns: ["national retail federation"] },
  { id: "costco", label: "Costco", sector: "Retail & Commerce", ldaClientName: "COSTCO", fecPatterns: ["costco"] },

  // ── Crypto ──
  { id: "coinbase", label: "Coinbase", sector: "Crypto & Blockchain", ldaClientName: "COINBASE", fecPatterns: ["coinbase"] },
  { id: "blockchain-assoc", label: "Blockchain Association", sector: "Crypto & Blockchain", ldaClientName: "BLOCKCHAIN ASSOCIATION", fecPatterns: ["blockchain association"] },

  // ── Legal ──
  { id: "aba-legal", label: "American Bar Association", sector: "Legal & Trial Lawyers", ldaClientName: "AMERICAN BAR ASSOCIATION", fecPatterns: ["american bar association"] },
  { id: "atra", label: "American Tort Reform Association", sector: "Legal & Trial Lawyers", ldaClientName: "AMERICAN TORT REFORM", fecPatterns: ["tort reform"] },

  // ── Insurance ──
  { id: "aia", label: "American Insurance Association", sector: "Insurance", ldaClientName: "AMERICAN INSURANCE ASSOCIATION", fecPatterns: ["american insurance association"] },
  { id: "pci", label: "Property Casualty Insurers", sector: "Insurance", ldaClientName: "PROPERTY CASUALTY INSURERS", fecPatterns: ["property casualty insurers"] },

  // ── Business & trade (cross-sector) ──
  { id: "us-chamber", label: "U.S. Chamber of Commerce", sector: "Business & Trade", ldaClientName: "U.S. CHAMBER OF COMMERCE", ldaRegistrantName: "U.S. CHAMBER OF COMMERCE", fecPatterns: ["u.s. chamber", "us chamber of commerce", "chamber of commerce"] },
  { id: "business-roundtable", label: "Business Roundtable", sector: "Business & Trade", ldaClientName: "BUSINESS ROUNDTABLE", fecPatterns: ["business roundtable"] },
  { id: "nam", label: "National Association of Manufacturers", sector: "Business & Trade", ldaClientName: "NATIONAL ASSOCIATION OF MANUFACTURERS", fecPatterns: ["national association of manufacturers"] },
  { id: "acc", label: "American Chemistry Council", sector: "Business & Trade", ldaClientName: "AMERICAN CHEMISTRY", fecPatterns: ["american chemistry council"] },
  { id: "nra-restaurant", label: "National Restaurant Association", sector: "Business & Trade", ldaClientName: "NATIONAL RESTAURANT ASSOCIATION", fecPatterns: ["national restaurant association"] },
];