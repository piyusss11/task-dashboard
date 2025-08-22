"use client";

import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/auth-slice";
import {
  moveTask,
  setSearchTerm,
  setSelectedLabels,
  setSortBy,
  setViewMode,
} from "@/store/slices/task-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, LogOut, LayoutGrid, List } from "lucide-react";
import TaskCard from "@/components/task-card";
import TaskDialog from "@/components/task-dialog";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

export default function KanbanBoard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks, columns, searchTerm, selectedLabels, sortBy, viewMode } =
    useAppSelector((state) => state.tasks);

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesLabels =
        selectedLabels.length === 0 ||
        selectedLabels.some((label) => task.labels.includes(label));
      return matchesSearch && matchesLabels;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "title":
          return a.title.localeCompare(b.title);
        case "date":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  }, [tasks, searchTerm, selectedLabels, sortBy]);

  const allLabels = useMemo(() => {
    const labelSet = new Set<string>();
    tasks.forEach((task) =>
      task.labels.forEach((label) => labelSet.add(label))
    );
    return Array.from(labelSet);
  }, [tasks]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    dispatch(
      moveTask({
        taskId: draggableId,
        newStatus: destination.droppableId as any,
      })
    );
  };

  const getTasksForColumn = (columnId: string) => {
    return filteredTasks.filter((task) => task.status === columnId);
  };

  const handleLabelFilter = (label: string) => {
    if (selectedLabels.includes(label)) {
      dispatch(setSelectedLabels(selectedLabels.filter((l) => l !== label)));
    } else {
      dispatch(setSelectedLabels([...selectedLabels, label]));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(logout())}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by task name..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-10 w-64"
            />
          </div>

          <Select
            value={sortBy}
            onValueChange={(value: any) => dispatch(setSortBy(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Labels:</span>
            <div className="flex gap-1 flex-wrap">
              {allLabels.map((label) => (
                <Badge
                  key={label}
                  variant={
                    selectedLabels.includes(label) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleLabelFilter(label)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={viewMode === "board" ? "default" : "outline"}
              size="sm"
              onClick={() => dispatch(setViewMode("board"))}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => dispatch(setViewMode("list"))}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button onClick={() => setIsTaskDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 h-full">
        {viewMode === "board" ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto">
              {columns.map((column) => {
                const columnTasks = getTasksForColumn(column.id);
                return (
                  <div key={column.id} className="flex-shrink-0 w-80">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            {column.title}
                          </h3>
                          <Badge variant="secondary">
                            {columnTasks.length}
                          </Badge>
                        </div>
                      </div>

                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-4 min-h-[200px] ${
                              snapshot.isDraggingOver ? "bg-gray-50" : ""
                            }`}
                          >
                            {columnTasks.map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-3 ${
                                      snapshot.isDragging ? "rotate-2" : ""
                                    }`}
                                  >
                                    <TaskCard
                                      task={task}
                                      onEdit={(task) => {
                                        setEditingTask(task);
                                        setIsTaskDialogOpen(true);
                                      }}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">All Tasks</h3>
            </div>
            <div className="p-4 space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsTaskDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={editingTask}
        onClose={() => {
          setEditingTask(null);
          setIsTaskDialogOpen(false);
        }}
      />
    </div>
  );
}
