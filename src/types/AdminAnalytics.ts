export type AdminSkills = {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  skill_total: number;
  skill_score: number;
  skill_name: string;
  skill_sc: string;
  skill_c: string;
};

export type AdminSubCategory = {
  name: string;
  total_score: string;
  my_score: string;
  skills: Array<AdminSkills>;
};

export type AdminCategory = {
  name: string;
  total_score: number;
  my_score: number;
  sub_category: Array<AdminSubCategory>;
};

export type AdminQuadrants = {
  "0": number;
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  Name: string;
  Score: number;
  Total: number;
  SubCategories: Array<string>;
};

export type AdminAnalytics =
  | {
    top_5_skills: Array<{
      name: string;
      percentage: string;
      rank: number;
    }>;
    chart_ac_ex_data: Array<{ name: string; actual_score: number; total_score: number }>;
    certification_aggregates: Array<{ name: string; total: number; actual: number; percentage: number }>;
    category_aggregates: Array<AdminCategory>;
    quadrant_aggregates: Array<AdminQuadrants>;
    last_updated: number;
    total_employees: number;
    total_admins: number;
  }
  | undefined;
