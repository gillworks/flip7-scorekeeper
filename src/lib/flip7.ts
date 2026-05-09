export type Player = {
  id: string;
  name: string;
  total: number;
  rounds: number[];
};

export type GameState = {
  players: Player[];
  targetScore: number;
  round: number;
};

const KEY = "flip7-state-v1";

export function loadState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function saveState(state: GameState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
