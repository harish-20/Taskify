import { Schema, model, Types, Document } from "mongoose";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum TaskType {
  STORY = "story",
  BUG = "bug",
  FEATURE = "feature",
  TASK = "task",
}

export interface ITask extends Document {
  ticketId: string;
  title: string;
  description?: string;

  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;

  estimate?: number;
  spentTime: number;
  remainingTime?: number;

  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;

  assignees: Types.ObjectId[];
  watchers: Types.ObjectId[];

  createdBy: Types.ObjectId;
  organizationId: Types.ObjectId;

  tags: string[];

  attachments: {
    fileName: string;
    url: string;
    size: number;
    uploadedBy: Types.ObjectId;
    uploadedAt: Date;
  }[];

  comments: {
    author: Types.ObjectId;
    message: string;
    createdAt: Date;
  }[];

  checklist: {
    title: string;
    completed: boolean;
  }[];

  activity: {
    action: string;
    user: Types.ObjectId;
    oldValue?: string;
    newValue?: string;
    createdAt: Date;
  }[];

  parentTask?: Types.ObjectId;
  subTasks: Types.ObjectId[];

  blockedBy: Types.ObjectId[];
  blocking: Types.ObjectId[];

  position: number;
  color?: string;

  isArchived: boolean;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const AttachmentSchema = new Schema(
  {
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const ChecklistSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { _id: true },
);

const ActivitySchema = new Schema(
  {
    action: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    oldValue: String,
    newValue: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const taskSchema = new Schema<ITask>(
  {
    ticketId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(TaskType),
      default: TaskType.TASK,
    },

    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },

    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },

    estimate: {
      type: Number,
      min: 0,
    },

    spentTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingTime: {
      type: Number,
      min: 0,
    },

    startDate: Date,

    dueDate: Date,

    completedAt: Date,

    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    watchers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    attachments: {
      type: [AttachmentSchema],
      default: [],
    },

    comments: {
      type: [CommentSchema],
      default: [],
    },

    checklist: {
      type: [ChecklistSchema],
      default: [],
    },

    activity: {
      type: [ActivitySchema],
      default: [],
    },

    parentTask: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },

    subTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    blockedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    blocking: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    position: {
      type: Number,
      default: 0,
    },

    color: String,

    isArchived: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ organizationId: 1, status: 1 });
taskSchema.index({ organizationId: 1, ticketId: 1 }, { unique: true });
taskSchema.index({ assignees: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ parentTask: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ dueDate: 1 });

export const Task = model<ITask>("Task", taskSchema);
