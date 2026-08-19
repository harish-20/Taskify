const pathMap = {
  auth: {
    signin: '/auth/login',
    signup: '/auth/register',
    verifyToken: '/auth/verify',
    me: '/me',
  },
  organization: {
    create: '/organization',
    getOrganizationUsers: '/organization/users',
  },
  task: {
    list: '/task',
    create: '/task',
  },
};

export default pathMap;
