const pathMap = {
  auth: {
    signin: '/auth/login',
    signup: '/auth/register',
    verifyToken: '/auth/verify',
    me: '/me',
    updateMe: '/me',
    updateAvatar: '/me/avatar',
  },
  organization: {
    create: '/organization',
    getOrganizationUsers: '/organization/users',
    inviteMember: '/organization/invite',
  },
  team: {
    list: '/team',
    create: '/team',
    addMember: (teamId: string) => `/team/${teamId}/members`,
    removeMember: (teamId: string, memberId: string) => `/team/${teamId}/members/${memberId}`,
  },
  board: {
    list: '/board',
    create: '/board',
    byId: (boardId: string) => `/board/${boardId}`,
  },
  task: {
    list: '/task',
    create: '/task',
  },
};

export default pathMap;
