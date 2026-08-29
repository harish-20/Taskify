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
      <div className="flex min-h-40 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
        <Spinner />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <p className="text-sm font-medium text-gray-700">No members yet</p>
        <p className="mt-1 text-sm text-gray-500">Invite someone to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member) => (
        <div
          key={member._id}
          className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
        >
          {/* User */}
          <div className="flex items-center gap-3">
            <Avatar name={member.name} src={member.avatarUrl} size="sm" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">{member.name}</p>

              <p className="truncate text-xs text-gray-500">{member.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-100" />

          {/* Metadata */}
          <div className="flex items-center justify-between gap-2">
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
