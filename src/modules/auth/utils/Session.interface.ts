import RoleEnum from "@modules/users/shared/enums/Role.enum";

export interface AuthResponse {
  user: UserPublic,
  token: string,
}

interface UserPublic {
  name: string;
  lastName: string;
  email: string;
  role: RoleEnum
}