import { IconCirclePlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../hooks/useData";
import moment from "moment";
import ky from "ky";
import localforage from "localforage";

const tableHeads = ["Company Name", "Designation", "Domain(s)", "Total", "Edit", "Delete"];

function MyExperience() {
  const navigate = useNavigate();

  const { data, setData } = useData();

  const experiences = data?.skills_master.experience;

  useLayoutEffect(() => {
    document.title = "SkillViz | My Experience";
  }, []);

  return (
    <>
      <section className="flex min-w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <IconEdit />
            <h2 className="text-xl">Update Your Experience</h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-x-1 rounded-lg border border-gray-200 p-2 text-sm font-semibold text-gray-500 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
            onClick={() => navigate("/my-experience/update/add")}
          >
            Add More <IconCirclePlus style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <div className="flex flex-col overflow-auto">
          <div className="flex-grow rounded-md">
            <table className="relative w-full border">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {tableHeads.map((head) => (
                    <th
                      key={head}
                      scope="col"
                      className="sticky top-0 bg-gray-50 px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {experiences?.map((experience, idx) => (
                  <tr key={experience.company_name}>
                    <td className="px-6 py-3 text-center text-sm capitalize text-gray-600 dark:text-gray-500">
                      {experience.company_name}
                    </td>
                    <td className="px-6 py-3 text-center text-sm capitalize text-gray-600 dark:text-gray-500">
                      {experience.designation}
                    </td>
                    <td className="px-6 py-3 text-center max-w-96 text-sm capitalize text-gray-600 dark:text-gray-500">
                      {experience.domains?.join(", ")}
                    </td>
                    <td className="px-6 py-3 text-center text-sm capitalize text-gray-600 dark:text-gray-500">
                      {moment.duration(moment(experience.end_date ?? new Date()).diff(experience.start_date)).years()
                        ? `${moment.duration(moment(experience.end_date ?? new Date()).diff(experience.start_date)).years()} years `
                        : null}{" "}
                      {moment.duration(moment(experience.end_date ?? new Date()).diff(experience.start_date)).months()
                        ? `${moment.duration(moment(experience.end_date ?? new Date()).diff(experience.start_date)).months()} months `
                        : null}{" "}
                      {moment.duration(moment(experience.end_date ?? new Date()).diff(experience.start_date)).days()
                        ? `${moment.duration(moment(experience.end_date ?? new Date()).diff(experience.start_date)).days()} days`
                        : null}
                    </td>
                    <td className="px-6 py-3 text-center text-sm capitalize text-gray-600 dark:text-gray-500">
                      <button
                        type="button"
                        className="rounded-full hover:bg-gray-100"
                        onClick={() => navigate(`/my-experience/update/edit?experience=${idx}`)}
                      >
                        <IconEdit />
                      </button>
                    </td>
                    <td className="px-6 py-3 text-center text-sm capitalize text-gray-600 dark:text-gray-500">
                      <button
                        type="button"
                        className="rounded-full hover:bg-gray-100"
                        onClick={async () => {
                          const json = {
                            skills_master: {
                              ...data?.skills_master,
                            },
                          };
                          const deletedXP = json.skills_master.experience?.filter((_, id) => id !== idx);

                          json.skills_master.experience = deletedXP;

                          const response: { Status: string } = await ky
                            .post(
                              `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}${import.meta.env.VITE_USERS_EXPERIENCE_API}/${data?.skills_master.user?.u_id}`,
                              { json },
                            )
                            .json();

                          if (response.Status === "OK") {
                            localforage.setItem("userData", json);
                            setData({ skills_master: { ...json.skills_master } });
                            navigate("/my-experience");
                          }
                        }}
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default MyExperience;
