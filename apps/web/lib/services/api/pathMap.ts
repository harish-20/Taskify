const pathMap = {
  auth: {
    signin: "/auth/login",
    signup: "/auth/register",
    verifyToken: "/auth/verify",
  },
  organization: {
    create: "/organization",
  },
  task: {
    list: "/task",
    create: "/task",
    updateStatus: "/task/status",
  },
};

export default pathMap;
