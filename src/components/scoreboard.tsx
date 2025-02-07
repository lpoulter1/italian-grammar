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
    return <div className="text-center py-4">Loading scores...</div>;
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Top scores from all players</TableCaption>
        <TableHeader>
          <TableRow>
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
            <TableRow key={score.id}>
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
