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

export interface VoteAgainstDonor {
  billName: string;
  billNumber: string;
  date: string;
  donorAffected: string;
  vote: "Yea" | "Nay" | "Present";
  description: string;
}

export interface ScoreBreakdown {
  baseScore: number;
  outsideMoneyPercent: number;
  votingBonus: number;
  lobbyistMeetingPenalty: number;
  controversialIndustryPenalty: number;
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
  lastSynced?: string;
}