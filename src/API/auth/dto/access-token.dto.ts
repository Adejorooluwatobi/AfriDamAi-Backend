import { AdminType, SpecialistType } from "@prisma/client";

export class UserAccessTokenDto {
  id: string;
  accessToken: string;
  isActive: boolean;
  displayName: string;
  role: string;
  refreshToken: string;
  plan: any;
}

export class AdminAccessTokenDto {
  id: string;
  accessToken: string;
  isActive: boolean;
  displayName: string;
  role: string;
  refreshToken: string;
  type: AdminType;
}

export class VendorAccessTokenDto {
  id: string;
  accessToken: string;
  isActive: boolean;
  displayName: string;
  role: string;
  refreshToken: string;
}

export class SpecialistAccessTokenDto {
  id: string;
  accessToken: string;
  isActive: boolean;
  displayName: string;
  role: string;
  refreshToken: string;
  type: SpecialistType;
}
