export type Challenge = {
  id: string;
  title: string;
  question: string;
};

// Inline challenge data to avoid JSON import issues
const challengesData: Challenge[] = [
  {
    "id": "counter",
    "title": "Build a Counter",
    "question": "Make a click counter with +, -, and reset buttons. The value must never go below 0."
  },
  {
    "id": "todo",
    "title": "Todo List",
    "question": "Build a todo list with add and delete functionality."
  }
];

export function loadChallenge(id: string): Challenge | null {
  const challenge = challengesData.find((c) => c.id === id);
  return challenge || null;
}

export function getAllChallenges(): Challenge[] {
  return challengesData;
}