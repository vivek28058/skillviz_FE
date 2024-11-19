import { IconCirclePlus, IconEdit } from "@tabler/icons-react";
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { educationForm } from "./update";
import cx from "classix";
import { useData } from "../../hooks/useData";
import { Education } from "../../types/Education";

function MyEducation() {
  const navigate = useNavigate();

  const [selectedEducation, setSelectedEducation] = useState(0);

  const { data } = useData();

  const education = data?.skills_master.education;

  useLayoutEffect(() => {
    document.title = "SkillViz | My Experience";
  }, []);

  return (
    <>
      <section className="flex min-w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex justify-between gap-14">
          <div className="flex items-center gap-2">
            <IconEdit />
            <h2 className="text-xl">Update Your Educational Qualifications</h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-x-1 rounded-lg border border-gray-200 p-2 text-sm font-semibold text-gray-500 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
            onClick={() => navigate(`/my-education/update/add?education=${selectedEducation}`)}
          >
            Add More <IconCirclePlus style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <div className="flex gap-8 overflow-auto">
          <div className="flex flex-col rounded-md border">
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
          <div className="flex-grow rounded-md">
            <table className="relative w-full border">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {educationForm[selectedEducation].form.map((field) => (
                    <th
                      key={field.label}
                      scope="col"
                      className="sticky top-0 bg-gray-50 px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400"
                    >
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  {educationForm[selectedEducation].form.map((field) => (
                    <td
                      key={field.label}
                      className="px-6 py-3 text-center text-sm capitalize text-gray-600 dark:text-gray-500"
                    >
                      {education
                        ? educationForm[selectedEducation].dataType === "object"
                          ? field.fieldType !== "date"
                            ? education[educationForm[selectedEducation].state as keyof Education][field.state]
                            : education[educationForm[selectedEducation].state as keyof Education][field.state]
                              ? new Date(
                                education[educationForm[selectedEducation].state as keyof Education][field.state],
                              ).getFullYear()
                              : null
                          : field.fieldType !== "date"
                            ? education[educationForm[selectedEducation].state as keyof Education][0][field.state]
                            : education[educationForm[selectedEducation].state as keyof Education][0][field.state]
                              ? new Date(
                                education[educationForm[selectedEducation].state as keyof Education][0][field.state],
                              ).getFullYear()
                              : null
                        : null}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default MyEducation;
