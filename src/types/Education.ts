export type EducationPrimary = {
  name: string;
  year_of_passing: string;
  percentage: string;
  cgpa: string;
};

export type EducationHigher = {
  name: string;
  year_of_passing: string;
  percentage: string;
  cgpa: string;
  course: string;
  specialization: string;
};

export type Education =
  | {
    School: EducationPrimary;
    PU: EducationPrimary;
    UG: Array<EducationHigher>;
    PG: Array<EducationHigher>;
  }
  | undefined;
