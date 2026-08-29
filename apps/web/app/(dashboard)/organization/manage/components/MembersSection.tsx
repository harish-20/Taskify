import Avatar from '@/components/UI/Avatar';
import Badge from '@/components/UI/Badge';
import Spinner from '@/components/UI/Spinner';
import { User } from '@/lib/types/user';

const statusVariantMap: Record<User['status'], 'success' | 'warning' | 'secondary' | 'danger'> = {
  ACTIVE: 'success',
  INVITE_SENT: 'warning',
  VERIFICATION_EMAIL_SENT: 'secondary',
  INVITE_REJECTED: 'danger',
};

interface MembersSectionProps {
  members: User[];
  loading: boolean;
}

const MembersSection: React.FC<MembersSectionProps> = ({ members, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center rounded-xl border border-gray-200 p-8">
        <Spinner />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
        No members yet. Invite someone to get started.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
      {members.map((member) => (
        <div key={member._id} className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={member.name} src={member.avatarUrl} size="sm" />
            <div>
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm">
              {member.role}
            </Badge>
            <Badge variant={statusVariantMap[member.status]} size="sm">
              {member.status.replaceAll('_', ' ')}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembersSection;
