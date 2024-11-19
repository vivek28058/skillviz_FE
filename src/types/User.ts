export type User = {
  u_id: string;
  name: string;
  isActive: number;
  details: {
    designation: {
      hierarchy_id: string;
      hierarchy_name: string;
      name: string;
    };
    experience: number;
  };
} | undefined;
