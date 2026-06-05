export type AdminRole = "content" | "owner";

export type AdminProfile = {
  user: string;
  password: string;
  role: AdminRole;
  label: string;
};

export function getAdminProfiles(): AdminProfile[] {
  return [
    {
      user: process.env.OWNER_ADMIN_USER || "DilanMM",
      password: process.env.OWNER_ADMIN_PASSWORD || "santifjk",
      role: "owner",
      label: "Administrador total",
    },
    {
      user: process.env.ADMIN_USER || "RealSporting",
      password: process.env.ADMIN_PASSWORD || "RealSporting1985",
      role: "content",
      label: "Administrador de contenido",
    },
  ];
}

export function findAdminProfile(user: string, password: string) {
  const normalizedUser = user.trim();

  return getAdminProfiles().find(
    (profile) => profile.user === normalizedUser && profile.password === password,
  );
}

export function findAdminProfileByPassword(password: string) {
  return getAdminProfiles().find((profile) => profile.password === password);
}
