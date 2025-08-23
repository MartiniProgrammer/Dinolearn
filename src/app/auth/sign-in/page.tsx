"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("demo@dinolearn.app");
  const [password, setPassword] = useState("demo1234");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) setErr("Inloggen mislukt");
    else window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-green-600">Inloggen</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
        <input className="w-full border p-2 rounded" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Wachtwoord"/>
        {err && <p className="text-red-600">{err}</p>}
        <button className="w-full bg-green-500 text-white rounded-2xl py-2">Log in</button>
      </form>
      <p className="text-sm text-gray-600">Demo: demo@dinolearn.app / demo1234</p>
    </div>
  );
}
