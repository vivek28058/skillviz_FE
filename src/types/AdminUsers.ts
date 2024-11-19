export type AdminUser = {
  First_Name: string;
  Last_Name: string;
  Email: string;
  Designation: string;
  Role: string;
  is_Active: number;
  is_Virgin: number;
  Hierarchy_Map: number;
  Password: string;
};

export type AdminUsers = Array<AdminUser> | undefined;
