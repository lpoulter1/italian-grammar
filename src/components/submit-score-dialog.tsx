import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewScore } from "@/types/scores";

type SubmitScoreDialogProps = {
  onSubmit: (score: NewScore) => Promise<void>;
  score: number;
  accuracy: number;
  verbType: string;
  totalAttempts: number;
};

export function SubmitScoreDialog({
  onSubmit,
  score,
  accuracy,
  verbType,
  totalAttempts,
}: SubmitScoreDialogProps) {
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        username: username.trim(),
        score,
        accuracy,
        verb_type: verbType,
        total_attempts: totalAttempts,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit score:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Submit Score</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Your Score</DialogTitle>
          <DialogDescription>
            Enter your name to submit your score to the leaderboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Name
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
              placeholder="Enter your name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Score</Label>
            <div className="col-span-3">{score}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Accuracy</Label>
            <div className="col-span-3">{accuracy}%</div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!username.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
