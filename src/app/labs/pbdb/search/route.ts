import { NextResponse } from "next/server";
import { pbdbSearch } from "@/lib/pbdb";

interface Body {
  taxon: string;
  interval?: string;
}

export async function POST(req: Request) {
  try {
    const { taxon, interval }: Body = await req.json();
    if (!taxon) {
      return NextResponse.json({ error: "Missing taxon" }, { status: 400 });
    }

    const data = await pbdbSearch({ taxon, interval });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[pbdb/search] error:", err);
    return NextResponse.json(
      { error: "PBDB search failed" },
      { status: 500 }
    );
  }
}