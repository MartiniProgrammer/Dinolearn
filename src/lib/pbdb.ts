export async function pbdbSearch({ taxon, interval }: { taxon: string; interval?: string }) {
  const base = "https://paleobiodb.org/data1.2/occs/list.json";
  const params = new URLSearchParams({ base_name: taxon, show: "coords", limit: "20" });
  if (interval) params.set("interval", interval);
  const r = await fetch(`${base}?${params.toString()}`);
  if (!r.ok) throw new Error("PBDB error");
  return r.json();
}
