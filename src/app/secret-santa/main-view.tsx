"use client";

import { useState } from "react";
import type { Participant, Assignment } from "./types";
import SetupView from "./components/setup-view";
import AssignmentsView from "./components/assignments-view";

export default function MainView() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [guidelines, setGuidelines] = useState<string>("");
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);

  const addParticipant = (participant: Participant) => {
    setParticipants((prev) => [...prev, participant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReset = () => {
    setAssignments(null);
  };
  
  const handleStartOver = () => {
    setParticipants([]);
    setGuidelines("");
    setAssignments(null);
  }

  if (assignments) {
    return (
      <AssignmentsView
        assignments={assignments}
        participants={participants}
        guidelines={guidelines}
        onReset={handleReset}
        onStartOver={handleStartOver}
      />
    );
  }

  return (
    <SetupView
      participants={participants}
      guidelines={guidelines}
      addParticipant={addParticipant}
      removeParticipant={removeParticipant}
      setGuidelines={setGuidelines}
      setAssignments={setAssignments}
    />
  );
}
