"use client";
import { useEffect, useState } from "react";

type Q = { id: string; prompt: string; options: { id: string; text: string; isCorrect?: boolean }[] };

export default function QuizPage({ params }: { params: { lessonId: string } }) {
  const [q, setQ] = useState<Q | null>(null);
  const [chosen, setChosen] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Haal de eerste vraag op + totaal aantal
  useEffect(() => {
    (async () => {
      const r = await fetch(`/quiz/first/${params.lessonId}`);
      const d = await r.json();
      setQ(d.question);
      setTotalQuestions(d.total ?? 0);
      setTotalCount(0);
      setCorrectCount(0);
      setFinished(false);
    })();
  }, [params.lessonId]);

  async function submit() {
    if (!q) return;
    const r = await fetch("/api/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: params.lessonId, questionId: q.id, chosenOptionIds: chosen })
    });
    const d = await r.json();
    setResult(d.isCorrect ? "Goed!" : "Helaas, fout");
    setTotalCount(t => t + 1);
    if (d.isCorrect) setCorrectCount(c => c + 1);
    setShowAnswer(false);

    // volgende vraag ophalen
    const nr = await fetch(`/quiz/next/${params.lessonId}/${q.id}`);
    const nd = await nr.json();
    if (nd.question) {
      setQ(nd.question);
      setChosen([]);
      setResult("");
      setShowAnswer(false);
    } else {
      setFinished(true);
      setQ(null);
    }
  }
  const progress = totalQuestions ? (totalCount / totalQuestions) * 100 : 0;

  if (finished) {
    return (
      <div className="space-y-4">
        <div className="h-2 w-full rounded bg-gray-200">
          <div className="h-2 rounded bg-green-500" style={{ width: `${progress}%` }} />
        </div>
        <div>Quiz voltooid! Je scoorde {correctCount} van de {totalCount} vragen.</div>
      </div>
    );
  }

  if (!q) return <div>Quiz laden…</div>;

  return (
    <div className="space-y-4">
      <div className="h-2 w-full rounded bg-gray-200">
        <div className="h-2 rounded bg-green-500" style={{ width: `${progress}%` }} />
      </div>
      <h1 className="text-2xl font-bold">{q.prompt}</h1>
      <div className="space-y-2">
        {q.options.map(o => (
          <label key={o.id} className="flex items-center gap-2">            <input
              type="checkbox"
              onChange={e => {
                setChosen(prev =>
                  e.target.checked ? [...prev, o.id] : prev.filter(x => x !== o.id)
                );
              }}
            />
            <span>{o.text}</span>
          </label>
        ))}
      </div>      <button onClick={submit} className="bg-green-500 text-white rounded-2xl px-4 py-2">
        Bevestig
      </button>
      {result && <p className="text-lg">{result}</p>}
            {result && !showAnswer && (
        <button
          onClick={() => setShowAnswer(true)}
          className="bg-blue-500 text-white rounded-2xl px-4 py-2"
        >
          Toon antwoord
        </button>
      )}
      {showAnswer && (
        <ul className="text-sm text-gray-700">
          {q.options
            .filter((o) => o.isCorrect)
            .map((o) => (
              <li key={o.id}>{o.text}</li>
            ))}
        </ul>
      )}
    </div>
  );
}

