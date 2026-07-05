export type Party = "Democrat" | "Republican" | "Independent";
export type Chamber = "Senate" | "House";

export interface Donor {
  name: string;
  industry: string;
  amount: number;
  type: "PAC" | "Corporate" | "Lobbyist" | "Individual";
  employer?: string;
}

export interface IndustryBreakdownItem {
  id: string;
  label: string;
  amount: number;
  percent: number;
  sourceCount: number;
}

export interface OutsideSpending {
  spender: string;
  amount: number;
  position: "support" | "oppose";
  isProIsraelAdvocacy?: boolean;
}

export type LobbyingConnection =
  | "fec_donor"
  | "lda_activity"
  | "fec_and_lobbying"
  | "sector_exposure"
  | "lda_and_sector";

export interface LobbyingOrganization {
  id: string;
  name: string;
  sector: string;
  connection: LobbyingConnection;
  lobbyingSpend2024: number;
  filingCount: number;
  issues: string[];
  detail: string;
  fecAmount: number;
}

export interface VoteAgainstDonor {
  billName: string;
  billNumber: string;
  date: string;
  donorAffected: string;
  vote: "Yea" | "Nay" | "Present";
  description: string;
}

export interface LobbyistContributionEvent {
  honoreeName: string;
  payeeName: string;
  lobbyistName: string;
  registrantName: string;
  amount: number;
  date: string;
  contributionType: string;
  filingPeriod: string;
}

export interface LobbyistContributions {
  total2024: number;
  eventCount: number;
  events: LobbyistContributionEvent[];
}

export interface StockTrade {
  transactionDate: string;
  disclosureDate: string;
  ticker: string | null;
  assetDescription: string;
  assetType: string;
  type: string;
  amount: string;
  owner: string;
  sourceUrl: string;
}

export interface StockTrades {
  tradeCount: number;
  lastDisclosureDate: string;
  recentTrades: StockTrade[];
}

export interface ScoreBreakdown {
  baseScore: number;
  outsideMoneyPercent: number;
  votingBonus: number;
  lobbyistMeetingPenalty: number;
  controversialIndustryPenalty: number;
  lobbyingExposurePenalty?: number;
  ld203Penalty?: number;
  outsideSpendingPenalty?: number;
  smallDonorBonus?: number;
  finalScore: number;
}

export interface ScoreHistoryPoint {
  month: string;
  score: number;
}

export interface Politician {
  id: string;
  bioguideId: string;
  name: string;
  party: Party;
  chamber: Chamber;
  state: string;
  district?: string;
  bio?: string;
  birthday?: string;
  photoUrl: string;
  openSecretsUrl: string | null;
  fecUrl: string | null;
  purityScore: number;
  nationalRank: number;
  scoreChange: number;
  totalOutsideMoney: number;
  totalDonations: number;
  /** PAC dependence percentage from FEC — used for penalty calculation */
  lobbyistMeetings: number;
  topDonors: Donor[];
  industryBreakdown?: IndustryBreakdownItem[];
  individualContributionTotal?: number;
  outsideSpending?: OutsideSpending[];
  totalOutsideSpending?: number;
  proIsraelOutsideSpending?: number;
  recentVotesAgainstDonors: VoteAgainstDonor[];
  scoreBreakdown: ScoreBreakdown;
  scoreHistory: ScoreHistoryPoint[];
  controversialIndustries: string[];
  dataCycle?: number;
  hasFinancialData?: boolean;
  dataCompletenessPercent?: number;
  dataCompletenessTier?: "high" | "medium" | "low" | "insufficient";
  lobbyingOrganizations?: LobbyingOrganization[];
  totalLobbyingExposure?: number;
  lobbyistContributions?: LobbyistContributions | null;
  stockTrades?: StockTrades | null;
  stockDisclosureUrl?: string;
  smallDonorPercent?: number;
  outsideSpendingPercent?: number;
  lastSynced?: string;
}