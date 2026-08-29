import { Schema, model, Types, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  description?: string;
  organization: Types.ObjectId;
  team?: Types.ObjectId;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
  columns: {
    name: string;
    order: number;
  }[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BoardColumnSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
  },
  { _id: true },
);

const boardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    columns: [BoardColumnSchema],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Board = model<IBoard>("Board", boardSchema);
