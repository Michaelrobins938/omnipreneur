'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Clock, User } from 'lucide-react'
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils'
import { Task } from '@/lib/stores/taskStore'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const priorityColor = getPriorityColor(task.priority)
  const statusColor = getStatusColor(task.status)

  return (
    <Card
      className={`task-card priority-${task.priority.toLowerCase()} transition-all duration-200 ${
        isHovered ? 'shadow-lg scale-[1.02]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-1 ml-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${priorityColor}`}>
              {task.priority}
            </Badge>
            <Badge className={`text-xs ${statusColor}`}>
              {task.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Due {formatDate(task.dueDate)}</span>
            </div>
          )}

          {/* Assigned User */}
          {task.assignedToId && (
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/api/avatar" />
                <AvatarFallback className="text-xs">
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                Assigned
              </span>
            </div>
          )}

          {/* Created Date */}
          <div className="text-xs text-muted-foreground">
            Created {formatDate(task.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 