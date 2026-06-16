/** Curated lobbying organizations — matched via Senate LDA + FEC donor names */

export const KNOWN_LOBBYING_ORGS = [
  {
    id: "aipac",
    label: "AIPAC",
    sector: "Pro-Israel Advocacy",
    ldaRegistrantName: "AMERICAN ISRAEL PUBLIC AFFAIRS",
    fecPatterns: ["aipac", "american israel public affairs"],
  },
  {
    id: "phrma",
    label: "PhRMA",
    sector: "Pharma & Health",
    ldaClientName: "PHARMACEUTICAL RESEARCH",
    ldaRegistrantName: "PHARMACEUTICAL RESEARCH AND MANUFACTURERS",
    fecPatterns: ["phrma", "pharmaceutical research", "manufacturers of america"],
  },
  {
    id: "pfizer",
    label: "Pfizer",
    sector: "Pharma & Health",
    ldaClientName: "PFIZER",
    fecPatterns: ["pfizer"],
  },
  {
    id: "api",
    label: "American Petroleum Institute",
    sector: "Fossil Fuels & Energy",
    ldaClientName: "AMERICAN PETROLEUM INSTITUTE",
    fecPatterns: ["american petroleum institute", "petroleum institute"],
  },
  {
    id: "us-chamber",
    label: "U.S. Chamber of Commerce",
    sector: "Business & Trade",
    ldaClientName: "U.S. CHAMBER OF COMMERCE",
    ldaRegistrantName: "U.S. CHAMBER OF COMMERCE",
    fecPatterns: ["u.s. chamber", "us chamber of commerce", "chamber of commerce"],
  },
  {
    id: "nra",
    label: "NRA / National Rifle Association",
    sector: "Gun Rights",
    ldaClientName: "NATIONAL RIFLE ASSOCIATION",
    fecPatterns: ["national rifle", "nra"],
  },
  {
    id: "aarp",
    label: "AARP",
    sector: "Civic & Advocacy",
    ldaClientName: "AARP",
    fecPatterns: ["aarp"],
  },
  {
    id: "naacp",
    label: "NAACP",
    sector: "Civic & Advocacy",
    ldaClientName: "NAACP",
    fecPatterns: ["naacp"],
  },
  {
    id: "afl-cio",
    label: "AFL-CIO",
    sector: "Labor Unions",
    ldaClientName: "AFL-CIO",
    fecPatterns: ["afl-cio", "afl cio"],
  },
  {
    id: "planned-parenthood",
    label: "Planned Parenthood",
    sector: "Civic & Advocacy",
    ldaClientName: "PLANNED PARENTHOOD",
    fecPatterns: ["planned parenthood"],
  },
  {
    id: "boeing",
    label: "Boeing",
    sector: "Defense & Aerospace",
    ldaClientName: "BOEING",
    fecPatterns: ["boeing"],
  },
  {
    id: "lockheed",
    label: "Lockheed Martin",
    sector: "Defense & Aerospace",
    ldaClientName: "LOCKHEED MARTIN",
    fecPatterns: ["lockheed"],
  },
  {
    id: "raytheon",
    label: "RTX / Raytheon",
    sector: "Defense & Aerospace",
    ldaClientName: "RAYTHEON",
    fecPatterns: ["raytheon", "rtx"],
  },
  {
    id: "exxon",
    label: "ExxonMobil",
    sector: "Fossil Fuels & Energy",
    ldaClientName: "EXXON",
    fecPatterns: ["exxon", "exxonmobil"],
  },
  {
    id: "chevron",
    label: "Chevron",
    sector: "Fossil Fuels & Energy",
    ldaClientName: "CHEVRON",
    fecPatterns: ["chevron"],
  },
  {
    id: "meta",
    label: "Meta",
    sector: "Technology",
    ldaClientName: "META PLATFORMS",
    fecPatterns: ["meta platforms", "facebook", "meta"],
  },
  {
    id: "google",
    label: "Google / Alphabet",
    sector: "Technology",
    ldaClientName: "GOOGLE",
    fecPatterns: ["google", "alphabet"],
  },
  {
    id: "amazon",
    label: "Amazon",
    sector: "Technology",
    ldaClientName: "AMAZON",
    fecPatterns: ["amazon"],
  },
  {
    id: "jpmorgan",
    label: "JPMorgan Chase",
    sector: "Finance & Fintech",
    ldaClientName: "JPMORGAN",
    fecPatterns: ["jpmorgan", "jp morgan"],
  },
  {
    id: "goldman",
    label: "Goldman Sachs",
    sector: "Finance & Fintech",
    ldaClientName: "GOLDMAN SACHS",
    fecPatterns: ["goldman sachs", "goldman"],
  },
  {
    id: "heritage",
    label: "Heritage Foundation",
    sector: "Conservative Youth Orgs",
    ldaClientName: "HERITAGE FOUNDATION",
    fecPatterns: ["heritage foundation"],
  },
  {
    id: "sierra-club",
    label: "Sierra Club",
    sector: "Environmental",
    ldaClientName: "SIERRA CLUB",
    fecPatterns: ["sierra club"],
  },
  {
    id: "j-street",
    label: "J Street",
    sector: "Pro-Israel Advocacy",
    ldaClientName: "J STREET",
    fecPatterns: ["j street"],
  },
  {
    id: "adm",
    label: "Archer Daniels Midland",
    sector: "Agriculture & Agribusiness",
    ldaClientName: "ARCHER DANIELS MIDLAND",
    fecPatterns: ["archer daniels", "adm"],
  },
  {
    id: "monsanto-bayer",
    label: "Bayer / Crop Science",
    sector: "Agriculture & Agribusiness",
    ldaClientName: "BAYER",
    fecPatterns: ["bayer", "monsanto"],
  },
];

export function normalizeForMatch(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function fecTextMatchesOrg(text, org) {
  const norm = normalizeForMatch(text);
  return org.fecPatterns.some((p) => norm.includes(p));
}