import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'URGENT':
      return 'text-purple-600 bg-purple-100'
    case 'HIGH':
      return 'text-red-600 bg-red-100'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-100'
    case 'LOW':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'TODO':
      return 'text-gray-600 bg-gray-100'
    case 'IN_PROGRESS':
      return 'text-blue-600 bg-blue-100'
    case 'DONE':
      return 'text-green-600 bg-green-100'
    case 'ARCHIVED':
      return 'text-gray-500 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
} 