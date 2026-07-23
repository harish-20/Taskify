import { Schema, model, Types, Document } from "mongoose";

export interface ITaskCounter extends Document {
  organizationId: Types.ObjectId;
  seq: number;
}

const taskCounterSchema = new Schema<ITaskCounter>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      unique: true,
    },
    seq: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const TaskCounter = model<ITaskCounter>(
  "TaskCounter",
  taskCounterSchema,
);
