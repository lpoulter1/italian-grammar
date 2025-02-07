import { Score } from "@/types/scores";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ScoreboardProps = {
  scores: Score[];
  isLoading?: boolean;
};

export function Scoreboard({ scores, isLoading }: ScoreboardProps) {
  if (isLoading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading scores...
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800">
      <Table>
        <TableCaption>Top scores from all players</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
            <TableHead>Player</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Verb Type</TableHead>
            <TableHead>Attempts</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map((score) => (
            <TableRow
              key={score.id}
              className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            >
              <TableCell className="font-medium">{score.username}</TableCell>
              <TableCell>{score.score}</TableCell>
              <TableCell>{score.accuracy}%</TableCell>
              <TableCell>{score.verb_type}</TableCell>
              <TableCell>{score.total_attempts}</TableCell>
              <TableCell>
                {new Date(score.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
