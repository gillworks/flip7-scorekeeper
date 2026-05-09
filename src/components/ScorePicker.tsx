import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Flame, Pencil, Plus, Undo2, Trash2, Check } from "lucide-react";

const NUMBER_CARDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MODIFIERS = [2, 4, 6, 8, 10, "x2"] as const;

type Props = {
  disabled?: boolean;
  canUndo?: boolean;
  onSubmit: (score: number) => void;
  onOpenManual: () => void;
  onUndo: () => void;
  onDelete: () => void;
};

export function ScorePicker({ disabled, canUndo, onSubmit, onOpenManual, onUndo, onDelete }: Props) {
  const [picks, setPicks] = useState<number[]>([]);
  const [mods, setMods] = useState<(number | "x2")[]>([]);
  const [busted, setBusted] = useState(false);

  function reset() {
    setPicks([]); setMods([]); setBusted(false);
  }
  function toggleNum(n: number) {
    setPicks((p) => p.includes(n) ? p.filter((x) => x !== n) : [...p, n]);
  }
  function toggleMod(m: number | "x2") {
    setMods((p) => p.includes(m) ? p.filter((x) => x !== m) : [...p, m]);
  }

  const numSum = picks.reduce((a, b) => a + b, 0);
  const flip7Bonus = picks.length === 7 ? 15 : 0;
  const x2 = mods.includes("x2");
  const flatMods = mods.filter((m): m is number => m !== "x2").reduce((a, b) => a + b, 0);
  const computed = busted ? 0 : (x2 ? numSum * 2 : numSum) + flatMods + flip7Bonus;

  function handleAdd() {
    onSubmit(computed);
    reset();
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleAdd} disabled={disabled}>
          <Plus className="h-4 w-4" /> Add {computed > 0 || busted ? computed : ""}
        </Button>

        <div className="flex flex-wrap gap-1">
          {NUMBER_CARDS.map((n) => {
            const active = picks.includes(n);
            return (
              <button
                key={n}
                type="button"
                disabled={disabled || busted}
                onClick={() => toggleNum(n)}
                className={`h-8 w-8 rounded-md border text-xs font-bold transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                } disabled:opacity-40`}
              >
                {n}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1">
          {MODIFIERS.map((m) => {
            const active = mods.includes(m);
            return (
              <button
                key={String(m)}
                type="button"
                disabled={disabled || busted}
                onClick={() => toggleMod(m)}
                className={`h-8 rounded-md border px-2 text-xs font-semibold transition ${
                  active
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-secondary text-secondary-foreground border-border hover:border-accent/50"
                } disabled:opacity-40`}
              >
                {m === "x2" ? "×2" : `+${m}`}
              </button>
            );
          })}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setBusted((b) => !b)}
            className={`h-8 rounded-md border px-2 text-xs font-semibold transition inline-flex items-center gap-1 ${
              busted
                ? "bg-destructive text-destructive-foreground border-destructive"
                : "bg-secondary text-secondary-foreground border-border hover:border-destructive/50"
            } disabled:opacity-40`}
          >
            <Flame className="h-3 w-3" /> Bust
          </button>
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo last round"
            className="h-8 rounded-md border border-border bg-secondary px-2 text-xs font-semibold text-secondary-foreground transition hover:border-primary/50 disabled:opacity-40 inline-flex items-center gap-1"
          >
            <Undo2 className="h-3 w-3" /> Undo
          </button>
        </div>

        {flip7Bonus > 0 && !busted && (
          <span className="inline-flex items-center gap-1 text-xs text-primary">
            <Sparkles className="h-3 w-3" /> +15
          </span>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={onOpenManual} disabled={disabled} title="Enter score manually">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} title="Remove player" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
