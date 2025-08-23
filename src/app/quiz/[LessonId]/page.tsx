"use client";
import { useEffect, useState } from "react";

type Q = { id: string; prompt: string; options: { id: string; text: string }[] };

export default function QuizPage({ params }: { params: { lessonId: string } }) {
  const [q, setQ] = useState<Q | null>(null);
  const [chosen, setChosen] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");

  async function submit() {
    if (!q) return;
    const r = await fetch("/api/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: params.lessonId, questionId: q.id, chosenOptionIds: chosen })
    });
    const d = await r.json();
    setResult(d.isCorrect ? "Goed!" : "Helaas, fout");
  }

  if (!q) return <div>Quiz laden…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{q.prompt}</h1>
      <div className="space-y-2">
        {q.options.map(o => (
          <label key={o.id} className="flex items-center gap-2">
            <input type="checkbox" onChange={(e)=> {
              setChosen(prev => e.target.checked ? [...prev, o.id] : prev.filter(x=>x!==o.id));
            }}/>
            <span>{o.text}</span>
          </label>
        ))}
      </div>
      <button onClick={submit} className="bg-green-500 text-white rounded-2xl px-4 py-2">Bevestig</button>
      {result && <p className="text-lg">{result}</p>}
    </div>
  );
}
