export interface User {
  _id: Types.ObjectId;
  email: string;
  provider: AuthProvider;
  providerId: string;
  name: string;
  avatarUrl?: string;
  status: AccountStatus;
  role: UserRole;
  bio?: string;
  organizationId: Types.ObjectId;
  teamId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
