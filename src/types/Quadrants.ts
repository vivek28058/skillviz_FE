export type Quadrant = {
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

export type Quadrants = Array<Quadrant> | undefined;
