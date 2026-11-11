"use client";

import { useMemo, useState } from "react";

const agents = [
  { id: "health", name: "Health Agent", note: "Daily wellness", x: 8.2, y: 13.7, icon: "✦", labelSide: "right" },
  { id: "roommate", name: "Roommate Agent", note: "Shared living", x: 7, y: 82.3, icon: "✦", labelSide: "right" },
  { id: "coffee", name: "Coffee Agent", note: "Coffee routine", x: 93.2, y: 10, icon: "✦", labelSide: "left" },
  { id: "baby", name: "Baby Care", note: "Gentle routines", x: 92.8, y: 65.3, icon: "✦", labelSide: "left" },
  { id: "music", name: "Music Agent", note: "Mood & sound", x: 90, y: 84.8, icon: "✦", labelSide: "left" },
];

const connectionDots = [
  [13, 29], [19.5, 12.1], [9.2, 59.7], [18.8, 46.1], [84.2, 19.4],
  [87.4, 48.1], [78, 60.6], [73.8, 78.4], [65.5, 91.9],
];

const agentTopics = {
  health: ["Cardiology", "Pulmonology", "Nephrology", "Orthopedics", "Patient Info", "Room Agent"],
  roommate: ["Shared Calendar", "House Rules", "Shopping List", "Bill Split", "Cleaning Plan", "Home Notes"],
  coffee: ["Espresso", "Brew Guide", "Bean Notes", "Café Finder", "Daily Routine", "Taste Profile"],
  baby: ["Sleep Routine", "Feeding Log", "Growth Notes", "Activity Plan", "Care Circle", "Daily Check-in"],
  music: ["Daily Mix", "Mood Radio", "New Releases", "Listening History", "Sound Profile", "Shared Playlist"],
};

const topicPositions = [
  [16, 28], [27, 72], [67, 69], [14, 83], [86, 78], [84, 29],
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

function Network({ query, onPick, onSelect }) {
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
          <button key={agent.id} className={`agent-node label-${agent.labelSide} ${hidden ? "is-muted" : ""}`} style={{ left: `${agent.x}%`, top: `${agent.y}%` }} onClick={() => onSelect(agent)}>
            <span className="agent-symbol">{agent.icon}</span>
            <span className="agent-copy"><strong>{agent.name}</strong><small>{agent.note}</small></span>
          </button>
        );
      })}

      <span className="network-count">05 AGENTS ONLINE</span>
    </div>
  );
}

function AgentDetail({ agent, onBack }) {
  const topics = agentTopics[agent.id].map((label, index) => ({ label, x: topicPositions[index][0], y: topicPositions[index][1] }));

  return (
    <main className="agent-detail">
      <div className="detail-bar">
        <button className="detail-back" onClick={onBack}><span>←</span> Agent Hub</button>
        <span className="detail-title">[ {agent.name} ]</span>
        <button className="detail-launch" aria-label={`Open ${agent.name}`}>↗</button>
      </div>

      <div className="detail-network" aria-label={`${agent.name} capabilities`}>
        <svg className="detail-connections" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
          {topics.map((topic) => <line key={topic.label} x1="50" y1="38" x2={topic.x} y2={topic.y} />)}
        </svg>

        <div className="detail-center">
          <span className="detail-star">✦</span>
          <strong>{agent.name}</strong>
          <small>{agent.note}</small>
        </div>

        {topics.map((topic) => (
          <div key={topic.label} className={`detail-node ${topic.x > 50 ? "detail-node-left" : "detail-node-right"}`} style={{ left: `${topic.x}%`, top: `${topic.y}%` }}>
            <span className="detail-dot" />
            <strong>{topic.label}</strong>
          </div>
        ))}
      </div>
    </main>
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
  const [selectedAgent, setSelectedAgent] = useState(null);

  const changeTab = (tab) => {
    setActiveTab(tab);
    if (tab === "Agent Hub") setSelectedAgent(null);
  };

  return (
    <div className="site-shell">
      <header className="header">
        <nav aria-label="Main navigation">
          {tabs.map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => changeTab(tab)}>{tab}</button>)}
        </nav>
      </header>
      {activeTab === "Agent Hub"
        ? selectedAgent
          ? <AgentDetail agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
          : <Network query={query} onPick={setQuery} onSelect={setSelectedAgent} />
        : <SecondaryPage type={activeTab} onBack={() => changeTab("Agent Hub")} />}
      <footer><span>AGENT HUB / 2026</span><span>Human needs, intelligent connections.</span></footer>
    </div>
  );
}
