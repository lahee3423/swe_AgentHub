"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const agents = [
  { id: "health", name: "Hospital Agent", note: "Daily wellness", x: 22, y: 22, icon: "✦", labelSide: "right", points: [[5, 10], [4, 36]] },
  { id: "roommate", name: "Roommate Agent", note: "Shared living", x: 18, y: 76, icon: "✦", labelSide: "right", points: [[5, 62], [6, 91], [50, 94]] },
  { id: "coffee", name: "Coffee Agent", note: "Coffee routine", x: 87, y: 18, icon: "✦", labelSide: "left", points: [[76, 7], [96, 34]] },
  { id: "baby", name: "Baby Care", note: "Gentle routines", x: 88, y: 54, icon: "✦", labelSide: "bottom", points: [[77, 42], [97, 40]] },
  { id: "music", name: "Music Agent", note: "Mood & sound", x: 79, y: 82, icon: "✦", labelSide: "left", points: [[93, 94]] },
];

const agentTopics = {
  health: ["Cardiology Agent", "Orthopedics Agent", "Room Agents"],
  roommate: ["Smart TV", "Smart Lock", "Robot Vacuum", "Washing Machine", "Energy Monitor", "Shared Lighting"],
  coffee: ["Coffee Machine", "Smart Plug", "Water Purifier", "Kitchen Light", "Smart Speaker", "Routine Button"],
  baby: ["Baby Monitor", "Night Light", "Air Purifier", "Humidifier", "Smart Camera", "White Noise"],
  music: ["Smart TV", "Smart Speaker", "Soundbar", "Mood Lighting", "Multi-room Audio", "Voice Assistant"],
};

const topicPositions = [
  [16, 28], [27, 72], [67, 69], [14, 83], [86, 78], [84, 29],
];

const hospitalTopicPositions = [
  [24, 22], [76, 22], [50, 84],
];

const tabs = ["Agent Hub", "My Agent", "Agent Studio"];

const babyResults = [
  { name: "Baby Care Agent", note: "A calm routine for everyday care.", features: ["Baby Monitor", "Air Purifier", "Night Light", "Bottle Warmer", "Smart Thermometer", "Diaper Sensor"] },
  { name: "Baby Sleep Agent", note: "A gentler setup for better sleep.", features: ["White Noise Machine", "Room Thermostat", "Sleep Sensor", "Smart Crib", "Blackout Blinds", "Humidifier"] },
  { name: "Baby Watch Agent", note: "Keep important moments within reach.", features: ["Smart Camera", "Motion Sensor", "Two-way Audio", "Door Sensor", "Cry Detector", "Wearable Monitor"] },
  { name: "Growth Agent", note: "Follow changing needs as your baby grows.", features: ["Smart Scale", "Height Sensor", "Feeding Tracker", "Activity Mat", "Health Monitor", "Daily Report"] },
  { name: "Baby Feeding Agent", note: "Make every feeding routine easier to follow.", features: ["Bottle Warmer", "Formula Maker", "Feeding Tracker", "Smart Kettle", "Milk Monitor", "Kitchen Light"] },
  { name: "Baby Safety Agent", note: "Watch over the spaces your baby explores.", features: ["Smart Gate", "Window Sensor", "Outlet Monitor", "Air Quality Sensor", "Room Camera", "Emergency Button"] },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5z" />
    </svg>
  );
}

function Network({ query, onPick, onSearch, onSelect }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [motionTime, setMotionTime] = useState(0);
  const searchTimer = useRef(null);
  const matches = useMemo(
    () => agents.filter((agent) => `${agent.name} ${agent.note}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    setIsMounted(true);

    let animationFrame;
    let lastUpdate = 0;
    const startedAt = performance.now();

    const animate = (now) => {
      if (now - lastUpdate >= 33) {
        setMotionTime((now - startedAt) / 1000);
        lastUpdate = now;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => () => {
    if (searchTimer.current) window.clearTimeout(searchTimer.current);
  }, []);

  const startSearch = () => {
    if (isSearching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onSearch();
      return;
    }

    setIsSearching(true);
    searchTimer.current = window.setTimeout(onSearch, 820);
  };

  const movingAgents = useMemo(() => agents.map((agent, agentIndex) => {
    if (!isMounted) {
      return { ...agent, movingX: agent.x, movingY: agent.y, movingPoints: agent.points };
    }

    const agentPhase = motionTime * .48 + agentIndex * 1.37;
    return {
      ...agent,
      movingX: agent.x + Math.sin(agentPhase) * .28,
      movingY: agent.y + Math.cos(agentPhase * .86) * .22,
      movingPoints: agent.points.map(([x, y], pointIndex) => {
        const pointPhase = motionTime * (.5 + pointIndex * .07) + agentIndex * 1.61 + pointIndex * .83;
        return [x + Math.sin(pointPhase) * .9, y + Math.cos(pointPhase * .91) * .7];
      }),
    };
  }), [isMounted, motionTime]);

  const movingDots = movingAgents.flatMap((agent) => agent.movingPoints.map(([x, y], pointIndex) => ({
    key: `${agent.id}-${pointIndex}`,
    x,
    y,
  })));

  return (
    <div className={`network ${isSearching ? "is-searching" : ""}`} aria-label="Agent network">
      <svg className="connections" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
        {movingAgents.map((agent) => (
          <line key={`${agent.id}-hub`} className="hub-connection" x1={agent.movingX} y1={agent.movingY} x2="50" y2="53" />
        ))}
        {movingAgents.flatMap((agent) => agent.movingPoints.map(([x, y], pointIndex) => (
          <line key={`${agent.id}-${pointIndex}`} x1={agent.movingX} y1={agent.movingY} x2={x} y2={y} />
        )))}
      </svg>

      {movingDots.map((dot, index) => (
        <span
          key={dot.key}
          className={`connection-dot ${index % 3 === 0 ? "connection-dot-large" : ""}`}
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          aria-hidden="true"
        />
      ))}

      <div className="hub-core">
        <span className="eyebrow">FIND YOUR PERFECT AGENT</span>
        <h1>Agent Hubs</h1>
        <form className="search" onSubmit={(event) => { event.preventDefault(); startSearch(); }}>
          <label className="sr-only" htmlFor="agent-search">Search agents</label>
          <input id="agent-search" value={query} onFocus={() => { if (!query) onPick("baby"); }} onChange={(event) => onPick(event.target.value)} placeholder="What do you need help with?" />
          <button type="submit" aria-label="Search" disabled={isSearching}><SearchIcon /></button>
        </form>
        <p>{query ? `${matches.length} agent${matches.length === 1 ? "" : "s"} found in the network` : "Explore a network of agents built around your life."}</p>
      </div>

      {movingAgents.map((agent) => {
        const hidden = query && !matches.some((match) => match.id === agent.id);
        return (
          <button key={agent.id} className={`agent-node label-${agent.labelSide} ${hidden ? "is-muted" : ""}`} style={{ left: `${agent.movingX}%`, top: `${agent.movingY}%` }} onClick={() => onSelect(agent)}>
            <span className="agent-symbol">{agent.icon}</span>
            <span className="agent-copy"><strong>{agent.name}</strong><small>{agent.note}</small></span>
          </button>
        );
      })}

    </div>
  );
}

function SearchResults({ query, onPick, onSearch, onBack }) {
  const [carouselStep, setCarouselStep] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const visibleResults = Array.from({ length: 6 }, (_, index) => babyResults[(carouselStep + index) % babyResults.length]);

  const showNextResult = () => {
    if (!isSliding) setIsSliding(true);
  };

  const finishSlide = (event) => {
    if (event.target !== event.currentTarget) return;
    if (!isSliding) return;
    setCarouselStep((current) => current + 1);
    setIsSliding(false);
  };

  return (
    <main className="search-results">
      <div className="results-toolbar">
        <button className="results-back" type="button" onClick={onBack} aria-label="Back to Agent Hub">←</button>
        <form className="results-search" onSubmit={(event) => { event.preventDefault(); onSearch(); }}>
          <label className="sr-only" htmlFor="results-agent-search">Search agents</label>
          <input id="results-agent-search" value={query} onChange={(event) => onPick(event.target.value)} />
          <button type="submit" aria-label="Search"><SearchIcon /></button>
        </form>
      </div>

      <div className="results-heading">
        <span className="eyebrow">SEARCH RESULTS</span>
        <h1>Agents for “{query || "baby"}”</h1>
      </div>

      <section className="result-carousel" aria-label="Baby agent search results" aria-roledescription="carousel">
        <div className={`carousel-track ${isSliding ? "is-sliding" : ""}`} onTransitionEnd={finishSlide}>
          {visibleResults.map((result, index) => (
            <div key={`${carouselStep}-${index}-${result.name}`} className="carousel-card" aria-hidden={index === 5}>
              <article className="result-card">
                <span className="result-symbol" aria-hidden="true">✦</span>
                <h2>{result.name}</h2>
                <p>{result.note}</p>
                <ul>
                  {result.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </article>
            </div>
          ))}
        </div>
      </section>

      <button className="results-next" type="button" onClick={showNextResult} disabled={isSliding} aria-label="Show next agent cards">→</button>
    </main>
  );
}

function AgentDetail({ agent, onBack }) {
  const positions = agent.id === "health" ? hospitalTopicPositions : topicPositions;
  const topics = agentTopics[agent.id].map((label, index) => ({ label, x: positions[index][0], y: positions[index][1] }));

  return (
    <main className="agent-detail">
      <div className="detail-bar">
        <button className="detail-back" onClick={onBack}><span>←</span> Agent Hub</button>
        <span className="detail-title" aria-hidden="true" />
        <button className="detail-launch" aria-label={`${agent.id === "health" ? "Play" : "Open"} ${agent.name}`}>
          {agent.id === "health" ? <PlayIcon /> : "↗"}
        </button>
      </div>

      <div className="detail-network" aria-label={`${agent.name} capabilities`}>
        <svg className="detail-connections" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
          {topics.map((topic) => <line key={topic.label} x1="50" y1="38" x2={topic.x} y2={topic.y} />)}
        </svg>

        <div className={`detail-center ${agent.id === "health" ? "hospital-detail-center" : ""}`}>
          <span className="detail-star">✦</span>
          <strong>{agent.name}</strong>
          <small>{agent.note}</small>
        </div>

        {topics.map((topic) => (
          <div key={topic.label} className={`detail-node ${topic.x > 50 ? "detail-node-left" : "detail-node-right"} ${agent.id === "health" ? "hospital-detail-node" : ""}`} style={{ left: `${topic.x}%`, top: `${topic.y}%` }}>
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
  const [showResults, setShowResults] = useState(false);

  const changeTab = (tab) => {
    setActiveTab(tab);
    if (tab === "Agent Hub") {
      setSelectedAgent(null);
      setShowResults(false);
    }
  };

  return (
    <div className="site-shell">
      <header className="header">
        <nav aria-label="Main navigation">
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => changeTab(tab)}>
              {tab === "Agent Hub" && selectedAgent
                ? <span className="tab-breadcrumb"><span>Agent Hub</span><span aria-hidden="true">&gt;</span><span>{selectedAgent.name}</span></span>
                : tab}
            </button>
          ))}
        </nav>
      </header>
      {activeTab === "Agent Hub"
        ? selectedAgent
          ? <AgentDetail agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
          : showResults
            ? <SearchResults query={query} onPick={setQuery} onSearch={() => setShowResults(true)} onBack={() => setShowResults(false)} />
            : <Network query={query} onPick={setQuery} onSearch={() => setShowResults(true)} onSelect={setSelectedAgent} />
        : <SecondaryPage type={activeTab} onBack={() => changeTab("Agent Hub")} />}
      <footer><span>AGENT HUB / 2026</span><span>Human needs, intelligent connections.</span></footer>
    </div>
  );
}
