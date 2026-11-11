"use client";

import { useMemo, useState } from "react";

const agents = [
  { id: "health", name: "Health Agent", note: "Daily wellness", x: 13, y: 29, icon: "✦" },
  { id: "roommate", name: "Roommate Agent", note: "Shared living", x: 10, y: 72, icon: "✳" },
  { id: "babysitter", name: "Babysitter Agent", note: "Family care", x: 84, y: 19, icon: "✦" },
  { id: "baby", name: "Baby Care", note: "Gentle routines", x: 86, y: 47, icon: "✳" },
  { id: "music", name: "Music Agent", note: "Mood & sound", x: 74, y: 72, icon: "✦" },
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
        <g className="connection-dots">
          <circle cx="130" cy="180" r="5"/><circle cx="82" cy="85" r="4"/><circle cx="195" cy="75" r="4"/>
          <circle cx="92" cy="370" r="5"/><circle cx="70" cy="510" r="4"/><circle cx="188" cy="286" r="4"/>
          <circle cx="842" cy="120" r="5"/><circle cx="932" cy="62" r="4"/><circle cx="874" cy="298" r="5"/>
          <circle cx="928" cy="405" r="4"/><circle cx="780" cy="376" r="4"/><circle cx="738" cy="486" r="5"/><circle cx="900" cy="526" r="4"/><circle cx="655" cy="570" r="4"/>
        </g>
      </svg>

      <div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="orbital orbital-three" />

      <div className="hub-core">
        <span className="eyebrow">THE AGENT NETWORK</span>
        <h1>Find your<br /><em>perfect agent.</em></h1>
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
