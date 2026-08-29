export interface BoardColumn {
  _id: string;
  name: string;
  order: number;
}

export interface Board {
  _id: string;
  name: string;
  description?: string;
  organization: string;
  members: string[];
  columns: BoardColumn[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
