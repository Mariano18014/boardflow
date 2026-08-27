import type { BacklogTask } from "./list-backlog.api";
import { BacklogTaskRow } from "./BacklogTaskRow";

type BacklogListProps = {
  tasks: BacklogTask[];
};

export function BacklogList({ tasks }: BacklogListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay tareas en el backlog. Cuando puedas crear tareas, van a aparecer acá.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <BacklogTaskRow key={task.id} task={task} />
      ))}
    </div>
  );
}
