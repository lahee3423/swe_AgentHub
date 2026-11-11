"use client";

import { useMemo, useState } from "react";

const agents = [
  { id: "health", name: "Health Agent", note: "Daily wellness", x: 13, y: 29, icon: "✦" },
  { id: "roommate", name: "Roommate Agent", note: "Shared living", x: 10, y: 72, icon: "✦" },
  { id: "coffee", name: "Coffee Agent", note: "Coffee routine", x: 84, y: 19, icon: "✦" },
  { id: "baby", name: "Baby Care", note: "Gentle routines", x: 86, y: 47, icon: "✦" },
  { id: "music", name: "Music Agent", note: "Mood & sound", x: 74, y: 72, icon: "✦" },
];

const connectionDots = [
  [13, 29], [8.2, 13.7], [19.5, 12.1], [9.2, 59.7], [7, 82.3], [18.8, 46.1],
  [84.2, 19.4], [93.2, 10], [87.4, 48.1], [92.8, 65.3], [78, 60.6], [73.8, 78.4],
  [90, 84.8], [65.5, 91.9],
];

const tabs = ["Agent Hub", "My Agent", "Agent Studio"];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function Network({ query, onPick }) {
  const matches = useMemo(
    () => agents.filter((agent) => `${agent.name} ${agent.note}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="network" aria-label="Agent network">
      <svg className="connections" viewBox="0 0 1000 620" aria-hidden="true" preserveAspectRatio="none">
        <path d="M498 305 L130 180 L82 85 M130 180 L195 75 M130 180 L92 370 L70 510 M92 370 L188 286" />
        <path d="M498 305 L842 120 L932 62 M842 120 L874 298 L928 405 M874 298 L780 376 M498 305 L738 486 L900 526 M738 486 L655 570" />
      </svg>

      {connectionDots.map(([x, y], index) => (
        <span key={`${x}-${y}`} className={`connection-dot ${index === 0 || index === 3 || index === 6 || index === 8 || index === 11 ? "connection-dot-large" : ""}`} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
      ))}

      <div className="hub-core">
        <span className="eyebrow">FIND YOUR PERFECT AGENT</span>
        <h1>Agent Hubs</h1>
        <form className="search" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="agent-search">Search agents</label>
          <input id="agent-search" value={query} onChange={(event) => onPick(event.target.value)} placeholder="What do you need help with?" />
          <button type="submit" aria-label="Search"><SearchIcon /></button>
        </form>
        <p>{query ? `${matches.length} agent${matches.length === 1 ? "" : "s"} found in the network` : "Explore a network of agents built around your life."}</p>
      </div>

      {agents.map((agent) => {
        const hidden = query && !matches.some((match) => match.id === agent.id);
        return (
          <button key={agent.id} className={`agent-node ${hidden ? "is-muted" : ""}`} style={{ left: `${agent.x}%`, top: `${agent.y}%` }} onClick={() => onPick(agent.name)}>
            <span className="agent-symbol">{agent.icon}</span>
            <span className="agent-copy"><strong>{agent.name}</strong><small>{agent.note}</small></span>
          </button>
        );
      })}

      <span className="network-count">05 AGENTS ONLINE</span>
    </div>
  );
}

function SecondaryPage({ type, onBack }) {
  const studio = type === "Agent Studio";
  return (
    <main className="secondary">
      <div className="secondary-art" aria-hidden="true">
        <span className="big-asterisk">✳</span><span className="ring ring-a"/><span className="ring ring-b"/>
      </div>
      <span className="eyebrow">{studio ? "BUILD SOMETHING NEW" : "YOUR PERSONAL NETWORK"}</span>
      <h1>{studio ? <>Shape an agent<br/><em>from scratch.</em></> : <>Your agents,<br/><em>all in one place.</em></>}</h1>
      <p>{studio ? "Define a purpose, tune its personality, and connect the tools it needs." : "Agents you create and save will live here, ready whenever you need them."}</p>
      <button className="primary-button" onClick={onBack}>{studio ? "Start creating" : "Discover agents"}<span>↗</span></button>
    </main>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("Agent Hub");
  const [query, setQuery] = useState("");

  return (
    <div className="site-shell">
      <header className="header">
        <nav aria-label="Main navigation">
          {tabs.map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </nav>
      </header>
      {activeTab === "Agent Hub" ? <Network query={query} onPick={setQuery} /> : <SecondaryPage type={activeTab} onBack={() => setActiveTab("Agent Hub")} />}
      <footer><span>AGENT HUB / 2026</span><span>Human needs, intelligent connections.</span></footer>
    </div>
  );
}
