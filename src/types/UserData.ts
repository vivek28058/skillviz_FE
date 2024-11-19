import type { Categories } from "./Categories";
import { Certification } from "./Certificate";
import { Education } from "./Education";
import { Experience } from "./Experience";
import { Quadrants } from "./Quadrants";
import { User } from "./User";

export type UserData = {
  skills_master: {
    user?: User;
    categories?: Categories;
    experience?: Experience;
    education?: Education;
    certifications?: Certification;
    quadrants?: Quadrants;
  };
};
