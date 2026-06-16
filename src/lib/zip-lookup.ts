import type { Politician } from "./types";

export interface ZipLookupResult {
  zip: string;
  city: string;
  state: string;
  stateAbbr: string;
  congressionalDistrict: string | null;
  senators: Politician[];
  representative: Politician | null;
}

interface ZippopotamResponse {
  "post code": string;
  places: Array<{
    "place name": string;
    "state abbreviation": string;
    latitude: string;
    longitude: string;
  }>;
}

interface CensusGeoResponse {
  result?: {
    geographies?: {
      "119th Congressional Districts"?: Array<{
        CD119?: string;
        NAME?: string;
      }>;
    };
    addressMatches?: Array<{
      geographies?: {
        "119th Congressional Districts"?: Array<{
          CD119?: string;
          NAME?: string;
        }>;
      };
    }>;
  };
}

export async function lookupByZip(
  zip: string,
  politicians: Politician[]
): Promise<ZipLookupResult | null> {
  const normalized = zip.trim().slice(0, 5);
  if (!/^\d{5}$/.test(normalized)) return null;

  const zipRes = await fetch(`https://api.zippopotam.us/us/${normalized}`, {
    next: { revalidate: 86400 },
  });
  if (!zipRes.ok) return null;

  const zipData = (await zipRes.json()) as ZippopotamResponse;
  const place = zipData.places?.[0];
  if (!place) return null;

  const lat = place.latitude;
  const lng = place.longitude;
  const stateAbbr = place["state abbreviation"];

  const censusUrl = new URL(
    "https://geocoding.geo.census.gov/geocoder/geographies/coordinates"
  );
  censusUrl.searchParams.set("x", lng);
  censusUrl.searchParams.set("y", lat);
  censusUrl.searchParams.set("benchmark", "Public_AR_Current");
  censusUrl.searchParams.set("vintage", "Current_Current");
  censusUrl.searchParams.set("format", "json");

  const censusRes = await fetch(censusUrl.toString(), {
    next: { revalidate: 86400 },
  });
  const censusData = (await censusRes.json()) as CensusGeoResponse;

  const districtGeo =
    censusData.result?.geographies?.["119th Congressional Districts"]?.[0] ||
    censusData.result?.addressMatches?.[0]?.geographies?.[
      "119th Congressional Districts"
    ]?.[0];
  const districtNum = districtGeo?.CD119 || null;

  const senators = politicians
    .filter((p) => p.chamber === "Senate" && p.state === stateAbbr)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 2);

  let representative: Politician | null = null;
  if (districtNum) {
    const isAtLarge = districtNum === "0" || districtNum === "00";
    representative =
      politicians.find(
        (p) =>
          p.chamber === "House" &&
          p.state === stateAbbr &&
          (isAtLarge
            ? p.district === "At-Large"
            : p.district === districtNum ||
              p.district === String(parseInt(districtNum, 10)))
      ) || null;
  }

  return {
    zip: normalized,
    city: place["place name"],
    state: place["state abbreviation"],
    stateAbbr,
    congressionalDistrict: districtNum,
    senators,
    representative,
  };
}