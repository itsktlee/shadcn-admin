import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
} from 'lucide-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
    labelKey: 'tasks.data.labels.bug',
  },
  {
    value: 'feature',
    label: 'Feature',
    labelKey: 'tasks.data.labels.feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
    labelKey: 'tasks.data.labels.documentation',
  },
]

export const statuses = [
  {
    label: 'Backlog',
    labelKey: 'tasks.data.statuses.backlog',
    value: 'backlog' as const,
    icon: HelpCircle,
  },
  {
    label: 'Todo',
    labelKey: 'tasks.data.statuses.todo',
    value: 'todo' as const,
    icon: Circle,
  },
  {
    label: 'In Progress',
    labelKey: 'tasks.data.statuses.inProgress',
    value: 'in progress' as const,
    icon: Timer,
  },
  {
    label: 'Done',
    labelKey: 'tasks.data.statuses.done',
    value: 'done' as const,
    icon: CheckCircle,
  },
  {
    label: 'Canceled',
    labelKey: 'tasks.data.statuses.canceled',
    value: 'canceled' as const,
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: 'Low',
    labelKey: 'tasks.data.priorities.low',
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    labelKey: 'tasks.data.priorities.medium',
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: 'High',
    labelKey: 'tasks.data.priorities.high',
    value: 'high' as const,
    icon: ArrowUp,
  },
  {
    label: 'Critical',
    labelKey: 'tasks.data.priorities.critical',
    value: 'critical' as const,
    icon: AlertCircle,
  },
]
