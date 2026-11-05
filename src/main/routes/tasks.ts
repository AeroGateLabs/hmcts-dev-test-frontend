import {
  assignTask,
  completeTask,
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  unassignTask,
} from '../services/taskService';
import { CreateTaskRequest } from '../types/createTaskRequest';

import { Application } from 'express';

export default function (app: Application): void {
  app.get('/tasks', async (req, res) => {
    try {
      const tasks = await getAllTasks();
      res.render('tasks/list', { tasks });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('tasks/list', {});
    }
  });

  app.get('/tasks/create', async (req, res) => {
    try {
      res.render('tasks/create', {});
    } catch (error) {
      console.error('Error making request:', error);
      res.render('tasks/list', {});
    }
  });

  app.get('/tasks/:id', async (req, res) => {
    try {
      const task = await getTask(Number(req.params.id));
      res.render('tasks/details', { task });
    } catch (error) {
      console.error('Error making request:', error);
      res.status(404).render('tasks/not-found');
    }
  });

  app.post('/tasks', async (req, res) => {
    const request: CreateTaskRequest = req.body;
    try {
      await createTask(request);
      res.redirect('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);

      res.status(400).render('tasks/create', {
        error: 'Unable to create task. Check the details and try again.',
        formData: request,
      });
    }
  });

  app.post('/tasks/:id/assign', async (req, res) => {
    try {
      await assignTask(Number(req.params.id));
      res.redirect('/tasks');
    } catch (error) {
      console.error('Error making request:', error);
      res.redirect('/tasks');
    }
  });

  app.post('/tasks/:id/unassign', async (req, res) => {
    try {
      await unassignTask(Number(req.params.id));
      res.redirect('/tasks');
    } catch (error) {
      console.error('Error making request:', error);
      res.redirect('/tasks');
    }
  });

  app.post('/tasks/:id/complete', async (req, res) => {
    try {
      await completeTask(Number(req.params.id));
      res.redirect('/tasks');
    } catch (error) {
      console.error('Error making request:', error);
      res.redirect('/tasks');
    }
  });

  app.post('/tasks/:id/delete', async (req, res) => {
    try {
      await deleteTask(Number(req.params.id));
      res.redirect('/tasks');
    } catch (error) {
      console.error('Error making request:', error);
      res.redirect('/tasks');
    }
  });
}
