import clsx from 'clsx';
import {
  BookOpen,
  Bug,
  Sparkles,
  CheckSquare,
  ChevronDown,
  Equal,
  ChevronUp,
  ChevronsUp,
  Circle,
  CircleDashed,
  Eye,
  CircleCheckBig,
  type LucideProps,
} from 'lucide-react';

export const TaskTypeIcons = {
  story: (props: LucideProps) => (
    <BookOpen {...props} className={clsx('text-violet-500', props.className)} />
  ),

  bug: (props: LucideProps) => <Bug {...props} className={clsx('text-red-500', props.className)} />,

  feature: (props: LucideProps) => (
    <Sparkles {...props} className={clsx('text-amber-500', props.className)} />
  ),

  task: (props: LucideProps) => (
    <CheckSquare {...props} className={clsx('text-blue-500', props.className)} />
  ),
};

export const TaskPriorityIcons = {
  low: (props: LucideProps) => (
    <ChevronDown {...props} className={clsx('text-slate-400', props.className)} />
  ),

  medium: (props: LucideProps) => (
    <Equal {...props} className={clsx('text-blue-500', props.className)} />
  ),

  high: (props: LucideProps) => (
    <ChevronUp {...props} className={clsx('text-orange-500', props.className)} />
  ),

  critical: (props: LucideProps) => (
    <ChevronsUp {...props} className={clsx('text-red-600', props.className)} />
  ),
};

export const TaskStatusIcons = {
  todo: (props: LucideProps) => (
    <Circle {...props} className={clsx('text-slate-400', props.className)} />
  ),

  in_progress: (props: LucideProps) => (
    <CircleDashed {...props} className={clsx('text-blue-500', props.className)} />
  ),

  review: (props: LucideProps) => (
    <Eye {...props} className={clsx('text-violet-500', props.className)} />
  ),

  done: (props: LucideProps) => (
    <CircleCheckBig {...props} className={clsx('text-emerald-500', props.className)} />
  ),
};
