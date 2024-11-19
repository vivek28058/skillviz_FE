export type AdminSearchResponse = {
  Status: string;
  data:
  | {
    count: number;
    matches: Array<{
      u_id: string;
      name: string;
      isActive: number;
      details: {
        designation: {
          hierarchy_id: number;
          hierarchy_name: string;
          name: string;
        };
      };
      Role: string;
    }>;
  }
};
