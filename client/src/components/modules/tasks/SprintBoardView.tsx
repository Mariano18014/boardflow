import type { SprintBoard } from "./get-sprint-board.api";
import { BoardStatusColumn } from "./BoardStatusColumn";

type SprintBoardViewProps = {
  board: SprintBoard;
};

export function SprintBoardView({ board }: SprintBoardViewProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold mb-1">{board.sprint.name}</h1>
        <p className="text-sm text-muted-foreground">{formatSprintDateRange(board.sprint)}</p>
        {board.sprint.goal && <p className="mt-1 text-sm text-muted-foreground">{board.sprint.goal}</p>}
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {board.columns.map((column) => (
          <BoardStatusColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}

function formatSprintDateRange(sprint: SprintBoard["sprint"]): string {
  const startDate = new Date(sprint.startDate).toLocaleDateString();
  const endDate = new Date(sprint.endDate).toLocaleDateString();
  return `${startDate} - ${endDate}`;
}
