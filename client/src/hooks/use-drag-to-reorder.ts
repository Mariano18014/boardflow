import { useEffect, useState } from "react";
import { PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

type UseDragToReorderOptions<T> = {
  items: T[];
  getItemId: (item: T) => string;
  onReorder: (orderedIds: string[], previousItems: T[]) => void;
};

// Shared drag-and-drop orchestration for any sortable list (boards, backlog
// tasks, ...): keeps the visual order in local state, computes the new order
// on drop, and hands the result to the caller so it can persist it however it
// needs to (its own mutation, its own error message).
export function useDragToReorder<T>({ items, getItemId, onReorder }: UseDragToReorderOptions<T>) {
  const [orderedItems, setOrderedItems] = useState(items);
  // A small activation distance lets a plain click (e.g. opening a task's
  // detail panel) pass through untouched, while any real drag still starts
  // reliably — without it, dnd-kit can swallow the click event that would
  // otherwise fire right after a completed drag.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = orderedItems.findIndex((item) => getItemId(item) === active.id);
    const newIndex = orderedItems.findIndex((item) => getItemId(item) === over.id);
    const previousOrder = orderedItems;
    const newOrder = arrayMove(orderedItems, oldIndex, newIndex);
    applyOptimisticOrder(newOrder);
    onReorder(newOrder.map(getItemId), previousOrder);
  }

  function applyOptimisticOrder(newOrder: T[]) {
    setOrderedItems(newOrder);
  }

  return { orderedItems, sensors, handleDragEnd, applyOptimisticOrder };
}
