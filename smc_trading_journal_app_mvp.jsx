import React, { useState, useMemo } from "react";

export default function TradingJournalApp() {
  const [entries, setEntries] = useState([]);
  const [dailyLock, setDailyLock] = useState(false);
  const [lossCount, setLossCount] = useState(0);

  const [form, setForm] = useState({
    date: "",
    pair: "EURUSD",
    session: "London",
    structure: "",
    liquidity: "",
    inducement: false,
    rr: "",
    result: "",
    emotion: "",
    lesson: "",
  });

  const addEntry = () => {
    if (dailyLock) return alert("🚫 Trading locked for today. Discipline first, king 👑");

    const newEntries = [...entries, form];
    setEntries(newEntries);

    if (form.result === "Loss") {
      const newLoss = lossCount + 1;
      setLossCount(newLoss);
      if (newLoss >= 2) setDailyLock(true);
    }

    setForm({ ...form, rr: "", result: "", emotion: "", lesson: "" });
  };

  const stats = useMemo(() => {
    const total = entries.length;
    const wins = entries.filter(e => e.result === "Win").length;
    const losses = entries.filter(e => e.result === "Loss").length;
    const winRate = total ? Math.round((wins / total) * 100) : 0;

    const rTotal = entries.reduce((sum, e) => {
      const r = parseFloat(e.rr);
      if (e.result === "Win") return sum + r;
      if (e.result === "Loss") return sum - 1;
      return sum;
    }, 0);

    const psychologyScore = entries.length
      ? Math.round(
          (entries.filter(e => ["Calm", "Confident"].includes(e.emotion)).length /
            entries.length) *
            100
        )
      : 0;

    return { total, wins, losses, winRate, rTotal, psychologyScore };
  }, [entries]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">👑 SMC Trading Journal</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat title="Trades" value={stats.total} />
        <Stat title="Win Rate" value={`${stats.winRate}%`} />
        <Stat title="R Multiple" value={stats.rTotal.toFixed(1)} />
        <Stat title="Psychology" value={`${stats.psychologyScore}%`} />
      </div>

      {dailyLock && (
        <div className="bg-red-600 text-white p-3 rounded mb-4 font-semibold">
          🚫 Daily loss limit hit. Trading locked.
        </div>
      )}

      <div className="bg-purple-950 p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-2">New Trade</h2>

        <input className="input" placeholder="Date" onChange={e => setForm({ ...form, date: e.target.value })} />

        <select className="input" onChange={e => setForm({ ...form, pair: e.target.value })}>
          <option>EURUSD</option>
          <option>GBPUSD</option>
          <option>USDJPY</option>
        </select>

        <select className="input" onChange={e => setForm({ ...form, session: e.target.value })}>
          <option>London</option>
          <option>New York</option>
        </select>

        <input className="input" placeholder="Risk:Reward (e.g. 2)" onChange={e => setForm({ ...form, rr: e.target.value })} />

        <select className="input" onChange={e => setForm({ ...form, result: e.target.value })}>
          <option value="">Result</option>
          <option>Win</option>
          <option>Loss</option>
          <option>BE</option>
        </select>

        <select className="input" onChange={e => setForm({ ...form, emotion: e.target.value })}>
          <option value="">Emotion</option>
          <option>Calm</option>
          <option>Confident</option>
          <option>Fear</option>
          <option>FOMO</option>
          <option>Revenge</option>
        </select>

        <textarea className="input" placeholder="Lesson" onChange={e => setForm({ ...form, lesson: e.target.value })} />

        <button onClick={addEntry} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold">
          Save Trade
        </button>
      </div>

      <div className="bg-purple-950 p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Journal History</h2>
        {entries.map((e, i) => (
          <div key={i} className="border-b border-purple-700 py-2 text-sm">
            <strong>{e.date}</strong> | {e.pair} | {e.session} | {e.result} | RR {e.rr}
            <div className="text-purple-300">Lesson: {e.lesson}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-purple-950 p-4 rounded-xl text-center shadow">
      <div className="text-sm text-purple-300">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
