import PoliticianCard from "@/components/PoliticianCard";
import ZipSearchBar from "@/components/ZipSearchBar";
import { politicians } from "@/data/politicians";
import { lookupByZip } from "@/lib/zip-lookup";

interface FindPageProps {
  searchParams: { zip?: string };
}

export default async function FindPage({ searchParams }: FindPageProps) {
  const zip = searchParams.zip?.trim() ?? "";
  const result = zip.length >= 5 ? await lookupByZip(zip, politicians) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Find Your Representatives
        </h1>
        <p className="mt-3 text-slate-400">
          Enter your zip code to see your two Senators and House Representative
          with real FEC campaign finance data and Purity Scores.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-lg">
        <ZipSearchBar defaultValue={zip} size="large" />
      </div>

      {zip.length >= 5 && !result && (
        <div className="mt-10 rounded-lg border border-amber-500/30 bg-amber-950/20 p-6 text-center">
          <p className="font-medium text-amber-300">Zip code not found</p>
          <p className="mt-2 text-sm text-slate-400">
            We couldn&apos;t locate {zip}. Please enter a valid U.S. zip code.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-12">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-white">
              {result.city}, {result.stateAbbr}{" "}
              <span className="text-slate-500">({result.zip})</span>
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {result.congressionalDistrict
                ? `Congressional District ${result.congressionalDistrict} · `
                : ""}
              Located via U.S. Census geocoder
            </p>
          </div>

          {result.senators.length === 0 && !result.representative && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-400">
              No representatives matched this district in our dataset.
            </div>
          )}

          <div className="space-y-8">
            {result.senators.length > 0 && (
              <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">
                  U.S. Senate
                </h3>
                <div className="space-y-4">
                  {result.senators.map((senator) => (
                    <PoliticianCard key={senator.id} politician={senator} />
                  ))}
                </div>
              </section>
            )}

            {result.representative && (
              <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-400">
                  U.S. House
                </h3>
                <PoliticianCard politician={result.representative} />
              </section>
            )}
          </div>
        </div>
      )}

      {!zip && (
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {[
            { zip: "10001", city: "New York, NY" },
            { zip: "90210", city: "Beverly Hills, CA" },
            { zip: "60601", city: "Chicago, IL" },
            { zip: "77001", city: "Houston, TX" },
          ].map((example) => (
            <a
              key={example.zip}
              href={`/find?zip=${example.zip}`}
              className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-center transition hover:border-slate-600"
            >
              <span className="font-mono text-white">{example.zip}</span>
              <span className="mt-1 block text-sm text-slate-400">
                {example.city}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}