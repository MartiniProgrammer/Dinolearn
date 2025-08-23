"use client";
import { useState } from "react";

export default function PBDBLab() {
  const [taxon, setTaxon] = useState("Theropoda");
  const [data, setData] = useState<any>(null);

  async function search() {
    const r = await fetch("/api/pbdb/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taxon, interval: "Cretaceous" })
    });
    const d = await r.json();
    setData(d.data);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-green-600">PBDB Lab</h1>
      <div className="flex gap-2">
        <input className="border p-2 rounded" value={taxon} onChange={(e)=>setTaxon(e.target.value)} />
        <button className="bg-green-500 text-white rounded-2xl px-4" onClick={search}>Zoek</button>
      </div>
      {data && <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto max-h-96">{JSON.stringify(data.records?.slice(0,10), null, 2)}</pre>}
    </div>
  );
}
