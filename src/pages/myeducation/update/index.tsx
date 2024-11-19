import { IconCalendarDue, IconEdit } from "@tabler/icons-react";
import localforage from "localforage";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../hooks/useData";
import ky from "ky";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import cx from "classix";
import { useImmer } from "use-immer";
import { Education, EducationHigher, EducationPrimary } from "../../../types/Education";
import { useQuery } from "../../../hooks/useQuery";

export const educationForm = [
  {
    type: "School",
    state: "School",
    dataType: "object",
    form: [
      { label: "School Name", type: "input", fieldType: "text", state: "name" },
      { label: "Percentage", type: "input", fieldType: "number", state: "percentage" },
      { label: "CGPA", type: "input", fieldType: "number", state: "cgpa" },
      { label: "Year of Passing", type: "datepicker", fieldType: "date", state: "year_of_passing" },
    ],
  },
  {
    type: "Pre-University",
    state: "PU",
    dataType: "object",
    form: [
      { label: "Pre-University Name", type: "input", fieldType: "text", state: "name" },
      { label: "Percentage", type: "input", fieldType: "number", state: "percentage" },
      { label: "CGPA", type: "input", fieldType: "number", state: "cgpa" },
      { label: "Year of Passing", type: "datepicker", fieldType: "date", state: "year_of_passing" },
    ],
  },
  {
    type: "UG",
    state: "UG",
    dataType: "array",
    form: [
      { label: "University Name", type: "input", fieldType: "text", state: "name" },
      { label: "Course", type: "input", fieldType: "text", state: "course" },
      { label: "Specialization", type: "input", fieldType: "text", state: "specialization" },
      { label: "Percentage", type: "input", fieldType: "number", state: "percentage" },
      { label: "CGPA", type: "input", fieldType: "number", state: "cgpa" },
      { label: "Year of Passing", type: "datepicker", fieldType: "date", state: "year_of_passing" },
    ],
  },
  {
    type: "PG",
    state: "PG",
    dataType: "array",
    form: [
      { label: "University Name", type: "input", fieldType: "text", state: "name" },
      { label: "Course", type: "input", fieldType: "text", state: "course" },
      { label: "Specialization", type: "input", fieldType: "text", state: "specialization" },
      { label: "Percentage", type: "input", fieldType: "number", state: "percentage" },
      { label: "CGPA", type: "input", fieldType: "number", state: "cgpa" },
      { label: "Year of Passing", type: "datepicker", fieldType: "date", state: "year_of_passing" },
    ],
  },
];

function UpdateEducation() {
  const navigate = useNavigate();

  const { data, setData } = useData();

  const { type } = useParams();
  const params = useQuery();

  const educationLevel = params.get("education") ? Number(params.get("education")) : 0;

  const [selectedEducation, setSelectedEducation] = useState(educationLevel);

  const education = data?.skills_master.education;

  const [updateEducation, setUpdateEducation] = useImmer(education);

  const [, setLoading] = useState(false);

  return (
    <section className="flex min-w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex items-center gap-2">
        <IconEdit />
        <h2 className="text-xl capitalize">{type} Your Educational Qualification</h2>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex gap-8">
          <div className="relative max-w-max overflow-auto">
            <h3 className="sticky top-0 bg-white p-2 text-center text-lg">Education</h3>
            <div className="flex flex-col overflow-auto rounded-md border">
              {educationForm?.map((education, i) => (
                <button
                  key={education.type}
                  type="button"
                  className={cx(
                    "inline-flex items-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium capitalize text-primary hover:bg-orange-100 hover:text-secondary disabled:pointer-events-none disabled:opacity-50",
                    i === selectedEducation && "bg-orange-100 text-secondary",
                  )}
                  onClick={() => setSelectedEducation(i)}
                >
                  {education.type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col pt-8">
            {educationForm.map((education, i) => {
              return selectedEducation === i
                ? education.form.map((field) => {
                  return (
                    <div key={field.label}>
                      <label htmlFor={field.label} className="block text-base font-semibold dark:text-white">
                        {field.label}
                      </label>
                      {field.type === "input" ? (
                        <input
                          type={field.fieldType}
                          max="100"
                          id={field.label}
                          value={
                            updateEducation
                              ? education.dataType === "object"
                                ? updateEducation[education.state as keyof Education][field.state]
                                : updateEducation[education.state as keyof Education][0][field.state]
                              : ""
                          }
                          onChange={(e) =>
                            setUpdateEducation((draft: Education | undefined) => {
                              if (draft)
                                if (education.dataType === "object") {
                                  const updatedDraft = draft[education.state as keyof Education] as EducationPrimary;
                                  updatedDraft[field.state as keyof EducationPrimary] = e.target.value;
                                } else {
                                  const updatedDraft = draft[
                                    education.state as keyof Education
                                  ][0] as EducationHigher;
                                  updatedDraft[field.state as keyof EducationHigher] = e.target.value;
                                }
                            })
                          }
                          required
                          className="block w-full min-w-[40rem] rounded-lg border-gray-400 px-4 py-3 text-sm focus:border-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
                        />
                      ) : (
                        <div className="relative">
                          <IconCalendarDue className="absolute left-2 top-2.5 z-10" />
                          <DatePicker
                            selected={new Date()}
                            startDate={new Date()}
                            value={
                              updateEducation
                                ? education.dataType === "object"
                                  ? updateEducation[education.state as keyof Education][field.state]
                                    ? new Date(updateEducation[education.state as keyof Education][field.state])
                                      .getFullYear()
                                      .toString()
                                    : ""
                                  : updateEducation[education.state as keyof Education][0][field.state]
                                    ? new Date(updateEducation[education.state as keyof Education][0][field.state])
                                      .getFullYear()
                                      .toString()
                                    : ""
                                : ""
                            }
                            onChange={(e) =>
                              setUpdateEducation((draft) => {
                                if (draft && e?.getFullYear())
                                  education.dataType === "object"
                                    ? ((draft[education.state as keyof Education] as EducationPrimary)[
                                      field.state as keyof EducationPrimary
                                    ] = e.toJSON())
                                    : ((draft[education.state as keyof Education][0] as EducationHigher)[
                                      field.state as keyof EducationHigher
                                    ] = e.toJSON());
                              })
                            }
                            customInput={<input className="rounded-lg pl-10 focus:border-primary" />}
                            popperPlacement="top"
                            showYearPicker
                            dateFormat="yyyy"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
                : null;
            })}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="flex items-center justify-center rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={() => navigate("/my-education")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={async () => {
              setLoading(true);

              const json = {};

              Object.assign(json, {
                skills_master: {
                  ...data?.skills_master,
                  education: updateEducation,
                },
              });

              const response: { Status: string } = await ky
                .post(
                  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}${import.meta.env.VITE_USERS_EDUCATION_API}/${data?.skills_master.user?.u_id}`,
                  { json },
                )
                .json();
              setLoading(false);

              if (response.Status === "OK") {
                localforage.setItem("userData", { skills_master: { ...data?.skills_master } });
                setData({
                  skills_master: {
                    user: data?.skills_master.user,
                    categories: data?.skills_master.categories,
                    experience: data?.skills_master.experience,
                    education: updateEducation,
                  },
                });
                navigate("/my-education");
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
}

export default UpdateEducation;
