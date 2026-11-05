import {
  assignTask,
  completeTask,
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  unassignTask,
} from '../../main/services/taskService';
import { CreateTaskRequest } from '../../main/types/createTaskRequest';
import { Task } from '../../main/types/task';
import { TaskStatus } from '../../main/types/taskStatus';

import axios, { AxiosResponse } from 'axios';

jest.mock('axios');

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('getAllTasks returns tasks', async () => {
    const expectedTasks: Task[] = [
      {
        id: 2,
        title: 'Test Task 2',
        description: 'This is my second test task',
        status: TaskStatus.PENDING,
        dueDateTime: '2026-12-31T14:59:18.081',
        createdDate: '2026-11-03T20:07:21.5001',
      },
      {
        id: 3,
        title: 'Test Task 3',
        description: 'This is my third test task',
        status: TaskStatus.PENDING,
        dueDateTime: '2026-12-31T14:59:18.081',
        createdDate: '2026-11-03T00:00:00.0000',
      },
    ];
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    mockedAxios.get.mockResolvedValue({
      data: expectedTasks,
    });

    const result = await getAllTasks();

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/tasks'));
    expect(result).toEqual(expectedTasks);
  });

  test('getTask returns task', async () => {
    const expectedTask: Task = {
      id: 2,
      title: 'Test Task 2',
      description: 'This is my second test task',
      status: TaskStatus.PENDING,
      dueDateTime: '2026-12-31T14:59:18.081',
      createdDate: '2026-11-03T20:07:21.5001',
    };
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    mockedAxios.get.mockResolvedValue({
      data: expectedTask,
    });

    const result = await getTask(expectedTask.id);

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining(`/tasks/${expectedTask.id}`));
    expect(result).toEqual(expectedTask);
  });

  test('createTask returns created pending task', async () => {
    const createTaskRequest: CreateTaskRequest = {
      title: 'Test Task 3',
      description: 'This is my third test task',
      dueDateTime: '2026-12-31T14:59:18.081',
    };
    const createdTask: Task = {
      id: 3,
      title: 'Test Task 3',
      description: 'This is my third test task',
      status: TaskStatus.PENDING,
      dueDateTime: '2026-12-31T14:59:18.081',
      createdDate: '2026-11-03T00:00:00.0000',
    };

    const mockedAxios = axios as jest.Mocked<typeof axios>;

    mockedAxios.post.mockResolvedValue({
      data: createdTask,
    });

    const result = await createTask(createTaskRequest);

    expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), createTaskRequest);
    expect(result).toEqual(createdTask);
  });

  test('assignTask returns assigned task', async () => {
    const pendingTaskId = 2;
    const assignedTask: Task = {
      id: 2,
      title: 'Test Task 2',
      description: 'This is my second test task',
      status: TaskStatus.ASSIGNED,
      dueDateTime: '2026-12-31T00:00:00.0000',
      createdDate: '2026-11-03T00:00:00.0000',
    };
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    mockedAxios.patch.mockResolvedValue({
      data: assignedTask,
    });

    const result = await assignTask(pendingTaskId);

    expect(mockedAxios.patch).toHaveBeenCalledWith(expect.stringContaining(`/tasks/${pendingTaskId}/assign`));
    expect(result).toEqual(assignedTask);
  });

  test('unassignTask returns unassigned task', async () => {
    const assignedTaskId = 2;
    const pendingTask: Task = {
      id: 2,
      title: 'Test Task 2',
      description: 'This is my second test task',
      status: TaskStatus.PENDING,
      dueDateTime: '2026-12-31T00:00:00.0000',
      createdDate: '2026-11-03T00:00:00.0000',
    };
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    mockedAxios.patch.mockResolvedValue({
      data: pendingTask,
    });

    const result = await unassignTask(assignedTaskId);

    expect(mockedAxios.patch).toHaveBeenCalledWith(expect.stringContaining(`/tasks/${assignedTaskId}/unassign`));
    expect(result).toEqual(pendingTask);
  });

  test('completeTask returns completed task', async () => {
    const assignedTaskId = 2;
    const completedTask: Task = {
      id: 2,
      title: 'Test Task 2',
      description: 'This is my second test task',
      status: TaskStatus.COMPLETED,
      dueDateTime: '2026-12-31T00:00:00.0000',
      createdDate: '2026-11-03T00:00:00.0000',
    };
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    mockedAxios.patch.mockResolvedValue({
      data: completedTask,
    });

    const result = await completeTask(assignedTaskId);

    expect(mockedAxios.patch).toHaveBeenCalledWith(expect.stringContaining(`/tasks/${assignedTaskId}/complete`));
    expect(result).toEqual(completedTask);
  });

  test('deleteTask deletes task', async () => {
    const deleteTaskId = 2;
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    mockedAxios.delete.mockResolvedValue({} as AxiosResponse);

    const result = await deleteTask(deleteTaskId);

    expect(mockedAxios.delete).toHaveBeenCalledWith(expect.stringContaining(`/tasks/${deleteTaskId}`));
    expect(result).toBeUndefined();
  });
});
