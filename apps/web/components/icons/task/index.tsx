import {
  BookOpen,
  Bug,
  Sparkles,
  CheckSquare,
  ChevronDown,
  Minus,
  ChevronUp,
  ChevronsUp,
  Circle,
  CircleDashed,
  Eye,
  CircleCheckBig,
} from 'lucide-react';

export const TaskTypeIcons = {
  story: BookOpen,
  bug: Bug,
  feature: Sparkles,
  task: CheckSquare,
};

export const TaskPriorityIcons = {
  low: ChevronDown,
  medium: Minus,
  high: ChevronUp,
  critical: ChevronsUp,
};

export const TaskStatusIcons = {
  todo: Circle,
  in_progress: CircleDashed,
  review: Eye,
  done: CircleCheckBig,
};
