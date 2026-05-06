export type TaskStatus = 'pending' | 'working' | 'completed' | 'on_hold';

export interface Project {
  id: string;
  name: string;
  totalTasks: number;
  progress: number;
  dueDate: string | null;
  color: string;
  members: number;
  comments: number;
  attachments: number;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  status: TaskStatus;
  startsAt: number;
  endsAt: number;
  members: number;
  notes: string | null;
  createdAt: number;
}
