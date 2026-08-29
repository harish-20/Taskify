'use client';

import { useState } from 'react';

import Avatar from '@/components/UI/Avatar';
import MultiSelectInput from '@/components/UI/MultiSelectInput';
import Spinner from '@/components/UI/Spinner';
import { addTeamMember, removeTeamMember } from '@/lib/services/api/team';
import { Team } from '@/lib/types/organization';
import { User } from '@/lib/types/user';

interface TeamsSectionProps {
  teams: Team[];
  members: User[];
  loading: boolean;
  onTeamsChanged: () => void;
}

const TeamsSection: React.FC<TeamsSectionProps> = ({ teams, members, loading, onTeamsChanged }) => {
  const [updatingTeamId, setUpdatingTeamId] = useState<string | null>(null);

  const memberOptions = members.map((member) => ({ label: member.name, value: member._id }));

  const handleMembersChange = async (team: Team, nextMemberIds: string[]) => {
    const currentMemberIds = new Set(team.members);
    const nextMemberIdsSet = new Set(nextMemberIds);

    const addedMemberIds = nextMemberIds.filter((id) => !currentMemberIds.has(id));
    const removedMemberIds = team.members.filter((id) => !nextMemberIdsSet.has(id));

    try {
      setUpdatingTeamId(team._id);

      await Promise.all([
        ...addedMemberIds.map((memberId) => addTeamMember(team._id, memberId)),
        ...removedMemberIds.map((memberId) => removeTeamMember(team._id, memberId)),
      ]);

      onTeamsChanged();
    } catch (error) {
      console.error('Failed to update team members:', error);
    } finally {
      setUpdatingTeamId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center rounded-xl border border-gray-200 p-8">
        <Spinner />
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
        No teams yet. Create a team to start organizing your members.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {teams.map((team) => {
        const teamMembers = members.filter((member) => team.members.includes(member._id));

        return (
          <div key={team._id} className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">{team.name}</p>
                {team.description && <p className="text-xs text-gray-500">{team.description}</p>}
              </div>

              <div className="flex -space-x-2">
                {teamMembers.map((member) => (
                  <Avatar
                    key={member._id}
                    name={member.name}
                    src={member.avatarUrl}
                    size="xs"
                    bordered
                  />
                ))}
              </div>
            </div>

            <div className="mt-3">
              <MultiSelectInput
                options={memberOptions}
                selectedValues={team.members}
                onChange={(values) => handleMembersChange(team, values)}
                disabled={updatingTeamId === team._id}
                placeholder="Manage members..."
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamsSection;
