import { backendUrl } from '../config';
import { CreateTaskRequest } from '../types/createTaskRequest';
import { Task } from '../types/task';

import axios from 'axios';

export async function getAllTasks(): Promise<Task[]> {
  const response = await axios.get<Task[]>(`${backendUrl}/tasks`);
  return response.data;
}

export async function getTask(id: number): Promise<Task> {
  const response = await axios.get<Task>(`${backendUrl}/tasks/${id}`);
  return response.data;
}

export async function createTask(request: CreateTaskRequest): Promise<Task> {
  const response = await axios.post<Task>(`${backendUrl}/tasks`, request);
  return response.data;
}

export async function assignTask(id: number): Promise<Task> {
  const response = await axios.patch<Task>(`${backendUrl}/tasks/${id}/assign`);
  return response.data;
}

export async function unassignTask(id: number): Promise<Task> {
  const response = await axios.patch<Task>(`${backendUrl}/tasks/${id}/unassign`);
  return response.data;
}

export async function completeTask(id: number): Promise<Task> {
  const response = await axios.patch<Task>(`${backendUrl}/tasks/${id}/complete`);
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await axios.delete(`${backendUrl}/tasks/${id}`);
}
