export type UserAnalytics = Array<{
  name: string;
  total_score: number;
  my_score: number;
  sub_category: Array<{
    name: string;
    concern: Array<{ name: string; score: number }>;
  }>;
}>;
