import { app } from '../../main/app';
import * as taskService from '../../main/services/taskService';
import { CreateTaskRequest } from '../../main/types/createTaskRequest';
import { Task } from '../../main/types/task';
import { TaskStatus } from '../../main/types/taskStatus';

import request from 'supertest';

jest.mock('../../main/services/taskService');

describe('Tasks Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('GET /tasks', () => {
    test('should return all tasks from taskService', async () => {
      const expectedTasks: Task[] = [
        {
          id: 2,
          title: 'Test Task 2',
          description: 'This is my second test task',
          status: TaskStatus.PENDING,
          dueDateTime: '2026-12-31T14:59:18.081',
          createdDate: '2026-11-03T20:07:21.5001',
        },
      ];
      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.getAllTasks.mockResolvedValue(expectedTasks);

      const response = await request(app).get('/tasks').expect(200);

      expect(response.text).toContain('Test Task 2');
      expect(response.text).toContain('PENDING');
    });
    test('should show no tasks message when task list is empty', async () => {
      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.getAllTasks.mockResolvedValue([]);

      const response = await request(app).get('/tasks').expect(200);

      expect(response.text).toContain('No tasks found');
    });
  });
  describe('GET /tasks/:id', () => {
    test('should return task details', async () => {
      const expectedTask: Task = {
        id: 2,
        title: 'Test Task 2',
        description: 'This is my second test task',
        status: TaskStatus.PENDING,
        dueDateTime: '2026-12-31T14:59:18.081',
        createdDate: '2026-11-03T20:07:21.5001',
      };
      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.getTask.mockResolvedValue(expectedTask);

      const response = await request(app).get(`/tasks/${expectedTask.id}`).expect(200);

      expect(response.text).toContain('Test Task 2');
      expect(response.text).toContain('This is my second test task');
      expect(response.text).toContain('PENDING');
      expect(response.text).toContain('2026-12-31');
      expect(response.text).toContain('2026-11-03');
    });

    test('should show not found page if task not found', async () => {
      const taskId: number = 2;
      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.getTask.mockRejectedValue(new Error('Task not found'));

      const response = await request(app).get(`/tasks/${taskId}`).expect(404);

      expect(response.text).toContain('Task not found');
      expect(response.text).toContain('The task you are looking for could not be found.');
    });
  });
  describe('GET /tasks/create', () => {
    test('should return create task form', async () => {
      const response = await request(app).get('/tasks/create').expect(200);
      expect(response.text).toContain('Create task');
    });
  });
  describe('POST /tasks', () => {
    test('should create task and redirect', async () => {
      const requestBody: CreateTaskRequest = {
        title: 'Test Task 3',
        description: 'This is my third test task 3',
        dueDateTime: '2025-12-31T00:00:00.000',
      };

      const createdTask: Task = {
        id: 3,
        ...requestBody,
        status: TaskStatus.PENDING,
        createdDate: '2026-11-03T00:00:00.000',
      };
      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.createTask.mockResolvedValue(createdTask);

      const response = await request(app).post('/tasks').send(requestBody).expect(302);

      expect(mockedTaskService.createTask).toHaveBeenCalledWith(requestBody);
      expect(response.headers.location).toBe('/tasks');
    });
    test('should show an error when task creation fails', async () => {
      const requestBody: CreateTaskRequest = {
        title: 'Test Task 3',
        description: 'This is my third test task 3',
        dueDateTime: '2025-12-31T00:00:00.000',
      };

      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.createTask.mockRejectedValue(new Error('Backend error'));

      const response = await request(app).post('/tasks').send(requestBody).expect(400);

      expect(response.text).toContain('There is a problem');
      expect(response.text).toContain('Unable to create task. Check the details and try again.');
      expect(response.text).toContain('Test Task 3');
    });
  });
  describe('POST /tasks/:id/assign', () => {
    test('should assign task and redirect', async () => {
      const taskId: number = 3;

      const assignedTask: Task = {
        id: 3,
        title: 'Test Task 3',
        description: 'This is my third test task 3',
        status: TaskStatus.ASSIGNED,
        createdDate: '2026-11-03T00:00:00.000',
        dueDateTime: '2025-12-31T00:00:00.000',
      };

      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.assignTask.mockResolvedValue(assignedTask);

      const response = await request(app).post(`/tasks/${taskId}/assign`).expect(302);

      expect(mockedTaskService.assignTask).toHaveBeenCalledWith(taskId);
      expect(response.headers.location).toBe('/tasks');
    });
  });
  describe('POST /tasks/:id/unassign', () => {
    test('should unassign task and redirect', async () => {
      const taskId: number = 3;

      const unassignedTask: Task = {
        id: 3,
        title: 'Test Task 3',
        description: 'This is my third test task 3',
        status: TaskStatus.PENDING,
        createdDate: '2026-11-03T00:00:00.000',
        dueDateTime: '2025-12-31T00:00:00.000',
      };

      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.unassignTask.mockResolvedValue(unassignedTask);

      const response = await request(app).post(`/tasks/${taskId}/unassign`).expect(302);

      expect(mockedTaskService.unassignTask).toHaveBeenCalledWith(taskId);
      expect(response.headers.location).toBe('/tasks');
    });
  });
  describe('POST /tasks/:id/complete', () => {
    test('should complete task and redirect', async () => {
      const taskId: number = 3;

      const completedTask: Task = {
        id: 3,
        title: 'Test Task 3',
        description: 'This is my third test task 3',
        status: TaskStatus.COMPLETED,
        createdDate: '2026-11-03T00:00:00.000',
        dueDateTime: '2025-12-31T00:00:00.000',
      };

      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.completeTask.mockResolvedValue(completedTask);

      const response = await request(app).post(`/tasks/${taskId}/complete`).expect(302);

      expect(mockedTaskService.completeTask).toHaveBeenCalledWith(taskId);
      expect(response.headers.location).toBe('/tasks');
    });
  });
  describe('POST /tasks/:id/delete', () => {
    test('should delete task and redirect', async () => {
      const taskId: number = 3;

      const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
      mockedTaskService.deleteTask.mockResolvedValue();

      const response = await request(app).post(`/tasks/${taskId}/delete`).expect(302);

      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith(taskId);
      expect(response.headers.location).toBe('/tasks');
    });
  });
});
