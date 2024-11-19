export type LoginUserData = {
  First_Name: string;
  Last_Name: string;
  Email: string;
  Designation: string;
  Role: string;
  is_Active: number;
  is_Virgin: number;
  Hierarchy_Map: number;
};

export type LoginResponse = {
  Status: string;
  Data?: LoginUserData;
};
