export type Concern = {
  name: string;
  score: number;
};

export type SubCategory = {
  name: string;
  total_score: number;
  my_score: number;
  concern: Array<Concern>;
};

export type Category = {
  name: string;
  total_score: number;
  my_score: number;
  "sub-category": Array<SubCategory>;
};

export type Categories = Array<Category> | undefined;
