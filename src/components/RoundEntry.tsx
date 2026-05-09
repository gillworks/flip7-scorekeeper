import { useState, useEffect } from "react";
import type { Player } from "@/lib/flip7";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  player: Player | null;
  onClose: () => void;
  onSubmit: (score: number) => void;
};

export function RoundEntry({ open, player, onClose, onSubmit }: Props) {
  const [manual, setManual] = useState("");

  useEffect(() => {
    if (open) setManual("");
  }, [open]);

  if (!player) return null;

  const score = Number(manual) || 0;

  function handleSubmit() {
    onSubmit(score);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Manual score — {player.name}</DialogTitle>
          <DialogDescription>Enter the round total directly.</DialogDescription>
        </DialogHeader>

        <div>
          <Label htmlFor="manual" className="text-xs uppercase tracking-wider text-muted-foreground">
            Round score
          </Label>
          <Input
            id="manual"
            type="number"
            autoFocus
            placeholder="0"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="mt-2"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add {score} pts</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
