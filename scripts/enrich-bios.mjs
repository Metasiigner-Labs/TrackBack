/** Add bio snippets from unitedstates/congress-legislators + GovTrack roles */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = join(__dirname, "..", "src", "data", "politicians.json");

function buildBioSnippet(leg, politician) {
  const parts = [];
  const terms = leg.terms || [];
  const firstStart = terms[0]?.start;
  if (firstStart) {
    const since = firstStart.slice(0, 4);
    const years = new Date().getFullYear() - parseInt(since, 10);
    parts.push(`In Congress since ${since} (${years}+ years)`);
  }

  const activeLeadership = (leg.leadership_roles || []).find(
    (r) => !r.end || r.end >= "2025-01-01"
  );
  if (activeLeadership?.title) parts.push(activeLeadership.title);

  if (politician.chamber === "Senate") {
    parts.push(`U.S. Senator for ${politician.state}`);
  } else {
    const dist =
      politician.district === "At-Large" ? "at-large" : `District ${politician.district}`;
    parts.push(`U.S. Representative for ${politician.state} (${dist})`);
  }

  const currentTerm = terms.filter((t) => !t.end || t.end >= "2025-01-01").at(-1);
  if (
    currentTerm?.caucus &&
    currentTerm.caucus !== currentTerm.party &&
    currentTerm.caucus !== politician.party
  ) {
    parts.push(`Caucuses with ${currentTerm.caucus}`);
  }

  return parts.join(" · ");
}

const legislators = await fetch(
  "https://raw.githubusercontent.com/unitedstates/congress-legislators/gh-pages/legislators-current.json"
).then((r) => r.json());

const byBio = new Map(
  legislators.map((leg) => [leg.id?.bioguide?.toLowerCase(), leg])
);

const data = JSON.parse(readFileSync(OUT_FILE, "utf8"));
let enriched = 0;

for (const p of data.politicians) {
  const leg = byBio.get(p.bioguideId?.toLowerCase()) || byBio.get(p.id);
  if (!leg) continue;
  p.bio = buildBioSnippet(leg, p);
  if (leg.bio?.birthday) p.birthday = leg.bio.birthday;
  enriched++;
}

data.meta.syncedAt = new Date().toISOString();
writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
console.log(`Added bios for ${enriched} politicians.`);