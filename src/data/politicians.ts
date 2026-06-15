import type { Politician } from "@/lib/types";
import politiciansData from "./politicians.json";

export interface PoliticiansDataset {
  meta: {
    syncedAt: string;
    cycle: number;
    count: number;
    sources: string[];
  };
  politicians: Politician[];
}

const dataset = politiciansData as PoliticiansDataset;

export const dataMeta = dataset.meta;
export const politicians: Politician[] = dataset.politicians;