export interface TransparencyLink {
  title: string;
  description: string;
  href: string;
  official?: boolean;
}

export interface TransparencyCategory {
  id: string;
  title: string;
  summary: string;
  links: TransparencyLink[];
}

export const TRANSPARENCY_CATEGORIES: TransparencyCategory[] = [
  {
    id: "congress-money",
    title: "Congressional money & lobbying",
    summary: "What TrackBack already maps — campaign cash, outside PACs, lobbyist contributions.",
    links: [
      {
        title: "TrackBack member profiles",
        description: "Purity Scores, donors, LD-203, lobbying org ties for all 537 federal lawmakers.",
        href: "/find",
        official: false,
      },
      {
        title: "FEC — Federal Election Commission",
        description: "Official campaign finance filings for every federal candidate and committee.",
        href: "https://www.fec.gov/data/",
        official: true,
      },
      {
        title: "LDA.gov — Lobbying disclosures",
        description: "Registered lobbyists, clients, and LD-203 contributions to officials.",
        href: "https://lda.gov/",
        official: true,
      },
      {
        title: "GovTrack — Congressional votes",
        description: "Roll call votes, bill status, and member voting records.",
        href: "https://www.govtrack.us/",
        official: false,
      },
    ],
  },
  {
    id: "stock-trades",
    title: "STOCK Act & financial disclosures",
    summary: "Members must report stock trades within 45 days. TrackBack shows recent PTR filings on profiles.",
    links: [
      {
        title: "House financial disclosures",
        description: "Periodic Transaction Reports (PTR) from the Clerk of the House.",
        href: "https://disclosures-clerk.house.gov/FinancialDisclosure",
        official: true,
      },
      {
        title: "Senate financial disclosures",
        description: "PTR and annual disclosure search — Senate Office of Public Records.",
        href: "https://efdsearch.senate.gov/search/home/",
        official: true,
      },
      {
        title: "Office of Government Ethics",
        description: "Executive branch financial disclosure guidance and forms.",
        href: "https://www.oge.gov/",
        official: true,
      },
    ],
  },
  {
    id: "federal-spending",
    title: "Where federal tax dollars go",
    summary: "Every federal grant, contract, and loan award — searchable by state, zip, agency, and recipient.",
    links: [
      {
        title: "USAspending.gov",
        description: "Official open data on all federal spending — grants, contracts, direct payments.",
        href: "https://www.usaspending.gov/",
        official: true,
      },
      {
        title: "Treasury Fiscal Data",
        description: "National debt, revenue, outlays, and federal account balances.",
        href: "https://fiscaldata.treasury.gov/",
        official: true,
      },
      {
        title: "GAO — Government Accountability Office",
        description: "Audits, waste/fraud reports, and program evaluations.",
        href: "https://www.gao.gov/",
        official: true,
      },
      {
        title: "Federal Register",
        description: "Every proposed and final federal regulation — comment before rules take effect.",
        href: "https://www.federalregister.gov/",
        official: true,
      },
    ],
  },
  {
    id: "report-fraud",
    title: "Report fraud & waste (official channels)",
    summary:
      "There is no single national fraud database yet. These are the correct official reporting paths — use them, do not post unverified accusations online.",
    links: [
      {
        title: "HHS OIG — Medicaid & Medicare fraud",
        description: "Report healthcare fraud to the Department of Health and Human Services Inspector General.",
        href: "https://oig.hhs.gov/fraud/report-fraud/",
        official: true,
      },
      {
        title: "Medicaid Fraud Control Units (by state)",
        description: "NAAG directory — each state has an MFCU for Medicaid fraud investigations.",
        href: "https://www.naag.org/attorneys-general/medicaid-fraud-control-units-mfcus/",
        official: true,
      },
      {
        title: "IRS — Tax fraud & abuse",
        description: "Report tax evasion, abusive tax schemes, and identity theft.",
        href: "https://www.irs.gov/individuals/how-do-you-report-suspected-tax-fraud-activity",
        official: true,
      },
      {
        title: "FBI IC3 — Internet crime",
        description: "Cybercrime, scams, and online fraud affecting individuals or government programs.",
        href: "https://www.ic3.gov/",
        official: true,
      },
      {
        title: "GAO FraudNet",
        description: "Report federal waste, fraud, or abuse of taxpayer dollars.",
        href: "https://www.gao.gov/about/contact-us/fraudnet",
        official: true,
      },
      {
        title: "Child Welfare Gateway — state contacts",
        description: "Find your state agency to report child abuse or neglect.",
        href: "https://www.childwelfare.gov/organizations/",
        official: true,
      },
    ],
  },
  {
    id: "tax-policy",
    title: "Tax breaks & policy (where to learn more)",
    summary:
      "Tax expenditures (loopholes, credits, deductions) are published by Congress and Treasury — not per-politician, but essential context.",
    links: [
      {
        title: "JCT — Joint Committee on Taxation",
        description: "Official congressional tax estimates and expenditure reports.",
        href: "https://www.jct.gov/",
        official: true,
      },
      {
        title: "Treasury — Tax Expenditures",
        description: "Annual report quantifying federal tax breaks by category.",
        href: "https://home.treasury.gov/policy-issues/tax-policy/tax-expenditures",
        official: true,
      },
      {
        title: "Congress.gov — Tax legislation",
        description: "Search bills and see who sponsors tax code changes.",
        href: "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22taxation%22%3A%5B%22Taxation%22%5D%7D",
        official: true,
      },
    ],
  },
  {
    id: "foreign-influence",
    title: "Foreign lobbying & influence",
    summary: "Complements TrackBack's domestic LDA data with foreign-agent registrations.",
    links: [
      {
        title: "DOJ FARA eFile",
        description: "Foreign Agents Registration Act — foreign governments and entities lobbying the U.S.",
        href: "https://efile.fara.gov/",
        official: true,
      },
      {
        title: "OpenSecrets — Foreign lobby watch",
        description: "Supplemental research on foreign influence spending (external site).",
        href: "https://www.opensecrets.org/fara",
        official: false,
      },
    ],
  },
];