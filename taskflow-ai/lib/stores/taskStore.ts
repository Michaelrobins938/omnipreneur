import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
  dueDate?: string
  assignedToId?: string
  createdById: string
  teamId: string
  projectId?: string
  createdAt: string
  updatedAt: string
}

interface TaskStore {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const tasks = await response.json()
      set({ tasks, loading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch tasks', loading: false })
    }
  },

  createTask: async (taskData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) throw new Error('Failed to create task')
      const newTask = await response.json()
      set(state => ({ 
        tasks: [...state.tasks, newTask], 
        loading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create task', loading: false })
    }
  },

  updateTask: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update task')
      const updatedTask = await response.json()
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updatedTask } : task
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update task', loading: false })
    }
  },

  updateTaskStatus: async (id, status) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error('Failed to update task status')
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, status } : task
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update task status', loading: false })
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete task')
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete task', loading: false })
    }
  },
})) 