import { normalizeForMatch } from "./lobbying-orgs.mjs";

export function buildMemberMatchers(politicians) {
  return politicians.map((p) => {
    const parts = (p.name || "").split(/\s+/).filter(Boolean);
    const lastName = parts.at(-1) || "";
    const firstName = parts[0] || "";
    const lastLower = lastName.toLowerCase();
    const firstLower = firstName.toLowerCase();
    const patterns = [
      `sen. ${lastLower}`,
      `senator ${lastLower}`,
      `rep. ${lastLower}`,
      `representative ${lastLower}`,
      `congressman ${lastLower}`,
      `congresswoman ${lastLower}`,
      `${firstLower} ${lastLower}`,
      p.name.toLowerCase(),
    ].filter((pat) => pat.length > 4);

    return {
      id: p.id,
      name: p.name,
      chamber: p.chamber,
      lastName,
      patterns,
    };
  });
}

export function matchHonoreeToMember(honoreeName, matchers) {
  if (!honoreeName?.trim()) return null;
  const norm = normalizeForMatch(honoreeName);
  if (!norm) return null;

  const wantsSenate = /\bsen\b|\bsenator\b/.test(norm);
  const wantsHouse = /\brep\b|\brepresentative\b|\bcongressman\b|\bcongresswoman\b/.test(norm);

  for (const matcher of matchers) {
    if (wantsSenate && matcher.chamber !== "Senate") continue;
    if (wantsHouse && matcher.chamber !== "House") continue;

    if (matcher.lastName.length < 5) {
      if (matcher.patterns.some((p) => norm.includes(p))) return matcher;
      continue;
    }

    if (matcher.patterns.some((p) => norm.includes(p))) return matcher;
    if (norm.includes(matcher.lastName.toLowerCase()) && norm.includes(matcher.name.split(" ")[0].toLowerCase())) {
      return matcher;
    }
  }

  for (const matcher of matchers) {
    if (matcher.patterns.some((p) => norm.includes(p))) return matcher;
  }

  return null;
}