"use client";

import { useEffect, useMemo, useState } from "react";

const agents = [
  { id: "health", name: "Health Agent", note: "Daily wellness", x: 22, y: 22, icon: "✦", labelSide: "right", points: [[5, 10], [4, 36]] },
  { id: "roommate", name: "Roommate Agent", note: "Shared living", x: 18, y: 76, icon: "✦", labelSide: "right", points: [[5, 62], [6, 91], [50, 94]] },
  { id: "coffee", name: "Coffee Agent", note: "Coffee routine", x: 87, y: 18, icon: "✦", labelSide: "left", points: [[76, 7], [96, 34]] },
  { id: "baby", name: "Baby Care", note: "Gentle routines", x: 88, y: 54, icon: "✦", labelSide: "bottom", points: [[77, 42], [97, 40]] },
  { id: "music", name: "Music Agent", note: "Mood & sound", x: 79, y: 82, icon: "✦", labelSide: "left", points: [[93, 94]] },
];

const agentTopics = {
  health: ["Air Conditioner", "Air Purifier", "Smart Scale", "Sleep Sensor", "Humidifier", "Smart Lighting"],
  roommate: ["Smart TV", "Smart Lock", "Robot Vacuum", "Washing Machine", "Energy Monitor", "Shared Lighting"],
  coffee: ["Coffee Machine", "Smart Plug", "Water Purifier", "Kitchen Light", "Smart Speaker", "Routine Button"],
  baby: ["Baby Monitor", "Night Light", "Air Purifier", "Humidifier", "Smart Camera", "White Noise"],
  music: ["Smart TV", "Smart Speaker", "Soundbar", "Mood Lighting", "Multi-room Audio", "Voice Assistant"],
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
  const [motionTime, setMotionTime] = useState(0);
  const matches = useMemo(
    () => agents.filter((agent) => `${agent.name} ${agent.note}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

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

  const movingAgents = useMemo(() => agents.map((agent, agentIndex) => {
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
  }), [motionTime]);

  const movingDots = movingAgents.flatMap((agent) => agent.movingPoints.map(([x, y], pointIndex) => ({
    key: `${agent.id}-${pointIndex}`,
    x,
    y,
  })));

  return (
    <div className="network" aria-label="Agent network">
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
        <form className="search" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="agent-search">Search agents</label>
          <input id="agent-search" value={query} onChange={(event) => onPick(event.target.value)} placeholder="What do you need help with?" />
          <button type="submit" aria-label="Search"><SearchIcon /></button>
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

function AgentDetail({ agent, onBack }) {
  const topics = agentTopics[agent.id].map((label, index) => ({ label, x: topicPositions[index][0], y: topicPositions[index][1] }));

  return (
    <main className="agent-detail">
      <div cl