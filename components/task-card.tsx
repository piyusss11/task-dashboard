"use client";

import type { Task } from "@/store/slices/task-slice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/store/hooks";
import { deleteTask } from "@/store/slices/task-slice";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const dispatch = useAppDispatch();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    toast.success("Task deleted successfully");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:cursor-default transition-shadow box-border">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">#{task.id}</span>
            <span className="text-xs text-gray-500">
              {new Date(task.createdAt).toLocaleDateString()}{" "}
              {new Date(task.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h4 className="font-medium text-gray-900 text-sm leading-tight mb-2">
            {task.title}
          </h4>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:cursor"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between mb-3 w-full gap-1 box-border">
        <div className="flex items-center gap-2 w-[90%]">
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          {task.labels.map((label) =>
            task.labels.length > 1 ? (
              <Badge key={label} variant="outline" className="text-xs">
                {label.length > 6 ? `${label.slice(0, 6)}...` : label}
              </Badge>
            ) : (
              <Badge variant={"outline"} key={label} className="text-xs">
                {label}
              </Badge>
            )
          )}
        </div>

        {task.score && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">⭐</span>
            <span className="text-xs font-medium">{task.score}</span>
          </div>
        )}
      </div>

      {task.assignee && (
        <div className="text-xs text-gray-600">
          Assigned to: {task.assignee}
        </div>
      )}
    </div>
  );
}
