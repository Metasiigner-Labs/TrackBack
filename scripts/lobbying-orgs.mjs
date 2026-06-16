/** Lobbying org helpers — data in lobbying-orgs-data.mjs */
export { KNOWN_LOBBYING_ORGS } from "./lobbying-orgs-data.mjs";

export function normalizeForMatch(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function fecTextMatchesOrg(text, org) {
  const norm = normalizeForMatch(text);
  return org.fecPatterns.some((p) => norm.includes(p));
}