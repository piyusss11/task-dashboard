"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { Task } from "@/store/slices/task-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addTask, updateTask } from "@/store/slices/task-slice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onClose: () => void;
}

export default function TaskDialog({
  open,
  onOpenChange,
  task,
  onClose,
}: TaskDialogProps) {
  const dispatch = useAppDispatch();
  const { columns } = useAppSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    priority: "medium" as Task["priority"],
    assignee: "",
    score: "",
  });
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        assignee: task.assignee || "",
        score: task.score?.toString() || "",
      });
      setLabels(task.labels);
    } else {
      setFormData({
        title: "",
        description: "",
        status: "draft",
        priority: "medium",
        assignee: "",
        score: "",
      });
      setLabels([]);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    const taskData = {
      title: formData.title,
      description: formData.description,
      status: formData.status as Task["status"],
      priority: formData.priority,
      labels,
      assignee: formData.assignee,
      score: formData.score ? Number.parseFloat(formData.score) : undefined,
    };

    if (task) {
      dispatch(updateTask({ id: task.id, updates: taskData }));
      toast.success("Task updated successfully");
    } else {
      dispatch(addTask(taskData));
      toast.success("Task created successfully");
    }

    onClose();
  };

  const addLabel = () => {
    if (labels.length >= 2) {
      return toast.error("You can't add more than 2 labels");
    }
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel("");
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter((label) => label !== labelToRemove));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Textarea
              placeholder="Task description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={formData.priority}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Input
              placeholder="Assignee (optional)"
              value={formData.assignee}
              onChange={(e) =>
                setFormData({ ...formData, assignee: e.target.value })
              }
            />
          </div>

          <div>
            <Input
              type="number"
              step="0.1"
              placeholder="Score (optional)"
              value={formData.score}
              onChange={(e) =>
                setFormData({ ...formData, score: e.target.value })
              }
            />
          </div>

          <div>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addLabel())
                }
              />
              <Button
                disabled={labels.length >= 2}
                type="button"
                onClick={addLabel}
                variant="outline"
              >
                Add
              </Button>
            </div>
            <div className="flex gap-1 flex-wrap">
              {labels.map((label) => (
                <Badge
                  key={label}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeLabel(label)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {task ? "Update Task" : "Create Task"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
