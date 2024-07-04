export const shouldCurrentUserEditTargetUser = (
  currentUserRole: string,
  targetUserRole: string
): boolean => {
  if (currentUserRole === "admin") return true;
  return targetUserRole !== "admin";
};

export const getPossibleUserRoles = (isUserAdmin: boolean) => {
  const normalUserRoles = [
    {
      label: "Member",
      value: "member",
    },
    {
      label: "Developer",
      value: "developer",
    },
  ];

  const roles = isUserAdmin
    ? [
        {
          label: "Admin",
          value: "admin",
        },
        ...normalUserRoles,
      ]
    : normalUserRoles;

  return roles;
};
