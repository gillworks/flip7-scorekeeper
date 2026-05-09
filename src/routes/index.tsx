import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, RotateCcw, Trophy, Crown, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearState, loadState, saveState, uid, type GameState, type Player } from "@/lib/flip7";
import { RoundEntry } from "@/components/RoundEntry";
import { ScorePicker } from "@/components/ScorePicker";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Flip 7 Scorekeeper" },
      { name: "description", content: "Track scores for the Flip 7 card game. Add players, log rounds, and race to 200." },
    ],
  }),
});

const DEFAULT_TARGET = 200;

function Index() {
  const [state, setState] = useState<GameState>({ players: [], targetScore: DEFAULT_TARGET, round: 1 });
  const [hydrated, setHydrated] = useState(false);
  const [newName, setNewName] = useState("");
  const [entryFor, setEntryFor] = useState<Player | null>(null);
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [roundKey, setRoundKey] = useState(0);

  useEffect(() => {
    const s = loadState();
    if (s) setState(s);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const sorted = useMemo(
    () => [...state.players].sort((a, b) => b.total - a.total),
    [state.players],
  );
  const leader = sorted[0];
  const allRoundsEqual = state.players.length > 0 &&
    state.players.every((p) => p.rounds.length === state.players[0].rounds.length);
  const someoneOverTarget = state.players.some((p) => p.total >= state.targetScore);
  const winner = allRoundsEqual && state.players[0]?.rounds.length > 0 && leader && leader.total >= state.targetScore ? leader : null;

  function addPlayer() {
    const name = newName.trim();
    if (!name) return;
    setState((s) => ({
      ...s,
      players: [...s.players, { id: uid(), name, total: 0, rounds: [] }],
    }));
    setNewName("");
  }

  function removePlayer(id: string) {
    setState((s) => ({ ...s, players: s.players.filter((p) => p.id !== id) }));
    setDrafts((d) => { const n = { ...d }; delete n[id]; return n; });
  }

  function setDraft(id: string, score: number) {
    setDrafts((d) => ({ ...d, [id]: score }));
  }

  function commitRound() {
    setState((s) => ({
      ...s,
      players: s.players.map((p) => {
        const score = drafts[p.id] ?? 0;
        return { ...p, rounds: [...p.rounds, score], total: p.total + score };
      }),
      round: s.round + 1,
    }));
    setDrafts({});
    setRoundKey((k) => k + 1);
  }

  function undoLast(id: string) {
    setState((s) => ({
      ...s,
      players: s.players.map((p) => {
        if (p.id !== id || p.rounds.length === 0) return p;
        const last = p.rounds[p.rounds.length - 1];
        return { ...p, rounds: p.rounds.slice(0, -1), total: p.total - last };
      }),
    }));
  }

  function resetGame() {
    if (!confirm("Reset the game? All scores will be cleared.")) return;
    clearState();
    setState({ players: [], targetScore: DEFAULT_TARGET, round: 1 });
    setDrafts({});
    setRoundKey((k) => k + 1);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="bg-[var(--gradient-primary)] bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
            Flip 7
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Scorekeeper · Round {state.round} · First to {state.targetScore}
          </p>
        </div>
        {state.players.length > 0 && (
          <Button variant="ghost" size="sm" onClick={resetGame}>
            <RotateCcw className="mr-1 h-4 w-4" /> Reset
          </Button>
        )}
      </header>

      {winner && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/40 bg-[var(--gradient-card)] p-4 shadow-[var(--shadow-glow)]">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Winner</div>
            <div className="text-xl font-bold">{winner.name} · {winner.total} pts</div>
          </div>
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <Input
          placeholder="Add player name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
        />
        <Button onClick={addPlayer}>
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>

      {state.players.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Add players to start scoring.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((p, i) => {
            const isLeader = i === 0 && p.total > 0;
            return (
              <div
                key={p.id}
                className="rounded-xl border border-border bg-[var(--gradient-card)] p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold tabular-nums">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold">{p.name}</span>
                        {isLeader && <Crown className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.rounds.length} round{p.rounds.length === 1 ? "" : "s"}
                        {p.rounds.length > 0 && ` · last ${p.rounds[p.rounds.length - 1]}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black tabular-nums">{p.total}</div>
                    {(drafts[p.id] ?? 0) > 0 && (
                      <div className="text-xs text-primary tabular-nums">+{drafts[p.id]} pending</div>
                    )}
                  </div>
                </div>

                <ScorePicker
                  key={`${p.id}-${roundKey}`}
                  disabled={!!winner}
                  canUndo={p.rounds.length > 0}
                  onChange={(score) => setDraft(p.id, score)}
                  onOpenManual={() => setEntryFor(p)}
                  onUndo={() => undoLast(p.id)}
                  onDelete={() => removePlayer(p.id)}
                />

                {p.rounds.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.rounds.map((r, idx) => (
                      <span
                        key={idx}
                        className={`rounded-md px-2 py-0.5 text-xs font-medium tabular-nums ${
                          r === 0 ? "bg-destructive/20 text-destructive" : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        R{idx + 1}: {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {!winner && state.players.length > 0 && (
            <Button variant="secondary" className="w-full" onClick={commitRound}>
              {someoneOverTarget ? `Finish round ${state.round}` : `End round ${state.round}`}
            </Button>
          )}
        </div>
      )}

      <RoundEntry
        open={!!entryFor}
        player={entryFor}
        onClose={() => setEntryFor(null)}
        onSubmit={(score) => entryFor && setDraft(entryFor.id, score)}
      />

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        Scores save automatically to this device.
      </footer>
    </main>
  );
}
