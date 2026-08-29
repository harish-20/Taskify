import { ApiResponse } from '@repo/shared/types';

import pathMap from './pathMap';

import Api from '.';

export const getTeams = async () => {
  const response = await Api.get<ApiResponse>(pathMap.team.list);

  return response.data;
};

export const createTeam = async (teamDetails: {
  name: string;
  description?: string;
  organizationId: string;
  members?: string[];
}) => {
  const response = await Api.post<ApiResponse>(pathMap.team.create, teamDetails);

  return response.data;
};

export const addTeamMember = async (teamId: string, memberId: string) => {
  const response = await Api.post<ApiResponse>(pathMap.team.addMember(teamId), { memberId });

  return response.data;
};

export const removeTeamMember = async (teamId: string, memberId: string) => {
  const response = await Api.delete<ApiResponse>(pathMap.team.removeMember(teamId, memberId));

  return response.data;
};
