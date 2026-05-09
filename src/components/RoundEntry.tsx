import { useState } from "react";
import type { Player } from "@/lib/flip7";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, Flame } from "lucide-react";

const NUMBER_CARDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MODIFIERS = [2, 4, 6, 8, 10, "x2"] as const;

type Props = {
  open: boolean;
  player: Player | null;
  onClose: () => void;
  onSubmit: (score: number) => void;
};

export function RoundEntry({ open, player, onClose, onSubmit }: Props) {
  const [picks, setPicks] = useState<number[]>([]);
  const [mods, setMods] = useState<(number | "x2")[]>([]);
  const [busted, setBusted] = useState(false);
  const [manual, setManual] = useState("");

  function reset() {
    setPicks([]); setMods([]); setBusted(false); setManual("");
  }

  function toggleNum(n: number) {
    setPicks((p) => p.includes(n) ? p.filter((x) => x !== n) : [...p, n]);
  }
  function toggleMod(m: number | "x2") {
    setMods((p) => {
      if (m === "x2") return p.includes("x2") ? p.filter((x) => x !== "x2") : [...p, "x2"];
      return p.includes(m) ? p.filter((x) => x !== m) : [...p, m];
    });
  }

  const numSum = picks.reduce((a, b) => a + b, 0);
  const flip7Bonus = picks.length === 7 ? 15 : 0;
  const x2 = mods.includes("x2");
  const flatMods = mods.filter((m): m is number => m !== "x2").reduce((a, b) => a + b, 0);
  const computed = busted ? 0 : (x2 ? numSum * 2 : numSum) + flatMods + flip7Bonus;
  const finalScore = manual.trim() !== "" ? Number(manual) || 0 : computed;

  function handleSubmit() {
    onSubmit(finalScore);
    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  if (!player) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Round score — {player.name}</DialogTitle>
          <DialogDescription>Tap the cards drawn this round, or enter a score manually.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Number cards</Label>
            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {NUMBER_CARDS.map((n) => {
                const active = picks.includes(n);
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={busted}
                    onClick={() => toggleNum(n)}
                    className={`aspect-[3/4] rounded-md border text-sm font-bold transition ${
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
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Modifiers</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {MODIFIERS.map((m) => {
                const active = mods.includes(m);
                return (
                  <button
                    key={String(m)}
                    type="button"
                    disabled={busted}
                    onClick={() => toggleMod(m)}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-secondary text-secondary-foreground border-border hover:border-accent/50"
                    } disabled:opacity-40`}
                  >
                    {m === "x2" ? "×2" : `+${m}`}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBusted((b) => !b)}
            className={`flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition ${
              busted
                ? "bg-destructive text-destructive-foreground border-destructive"
                : "bg-secondary text-secondary-foreground border-border hover:border-destructive/50"
            }`}
          >
            <Flame className="h-4 w-4" />
            {busted ? "Busted (0 points)" : "Mark as busted"}
          </button>

          <div className="rounded-lg border border-border bg-secondary/40 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Calculated score</span>
              <span className="text-2xl font-bold tabular-nums">{computed}</span>
            </div>
            {flip7Bonus > 0 && !busted && (
              <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                <Sparkles className="h-3 w-3" /> Flip 7! +15 bonus
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="manual" className="text-xs uppercase tracking-wider text-muted-foreground">
              Or enter manually
            </Label>
            <Input
              id="manual"
              type="number"
              placeholder="Override score"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add {finalScore} pts</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
