import { TaskStatus } from './taskStatus';

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDateTime: string;
  createdDate: string;
}
