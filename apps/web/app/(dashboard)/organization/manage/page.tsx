'use client';

import { UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import MembersSection from './components/MembersSection';
import TeamsSection from './components/TeamsSection';

import Button from '@/components/UI/Button';
import Title from '@/components/UI/Title';
import { getOrganizationUsers } from '@/lib/services/api/organization';
import { getTeams } from '@/lib/services/api/team';
import useModalStore from '@/lib/store/modal';
import { Team } from '@/lib/types/organization';
import { User } from '@/lib/types/user';

const ManageOrganizationPage = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const openModal = useModalStore((state) => state.openModal);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await getOrganizationUsers();
      setMembers((response.data as User[]) || []);
    } catch (error) {
      console.error('Failed to fetch organization members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchTeams = async () => {
    try {
      setLoadingTeams(true);
      const response = await getTeams();
      setTeams((response.data as Team[]) || []);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchTeams();
  }, []);

  return (
    <div className="w-full flex flex-col gap-10 p-6">
      <div className="flex items-center justify-between">
        <Title size="md">Manage Organization</Title>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users size={18} />
            Members
          </h2>
          <Button size="sm" onClick={() => openModal('invite-member', { onInvited: fetchMembers })}>
            <UserPlus size={16} className="mr-2" />
            Invite Member
          </Button>
        </div>

        <MembersSection members={members} loading={loadingMembers} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users size={18} />
            Teams
          </h2>
          <Button
            size="sm"
            onClick={() =>
              openModal('create-team', { organizationUsers: members, onCreated: fetchTeams })
            }
          >
            Create Team
          </Button>
        </div>

        <TeamsSection
          teams={teams}
          members={members}
          loading={loadingTeams}
          onTeamsChanged={fetchTeams}
        />
      </div>
    </div>
  );
};

export default ManageOrganizationPage;
