export type AuthProvider = 'local' | 'google' | 'github' | 'linkedin';
export type AccountStatus =
  | 'INVITE_SENT'
  | 'VERIFICATION_EMAIL_SENT'
  | 'ACTIVE'
  | 'INVITE_REJECTED';
export type UserRole = 'admin' | 'manager' | 'lead' | 'member';

export interface User {
  _id: string;
  email: string;
  provider: AuthProvider;
  providerId: string;
  name: string;
  avatarUrl?: string;
  status: AccountStatus;
  role: UserRole;
  bio?: string;
  organizationId: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}
