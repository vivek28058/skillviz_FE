import { IconEdit } from "@tabler/icons-react";
import localforage from "localforage";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useData } from "../../../hooks/useData";
import ky from "ky";
import { useQuery } from "../../../hooks/useQuery";
import cx from "classix";

const experienceForm = [
  { label: "Company Name", type: "input", state: "company" },
  { label: "Designation", type: "input", state: "designation" },
  { label: "Domain", type: "select", state: "domain" },
  { label: "Start Date", type: "datepicker", state: "start" },
  { label: "End Date", type: "datepicker", state: "end" },
];

function UpdateExperience() {
  const navigate = useNavigate();

  const params = useQuery();

  const experienceIdx = params.get("experience");

  const { data, setData } = useData();

  const { type } = useParams();

  const domainList = useMemo(
    () => [
      ...new Set(
        data?.skills_master.categories
          ?.find((category) => category.name === "Business Domain")
          ?.["sub-category"].find((subCategory) => subCategory.name === "Domain")
          ?.concern.map((concern) => concern.name.split(" ")?.[0].toLowerCase()),
      ),
    ],
    [data],
  );

  const [company_name, setCompany] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [domains, setDomains] = useState<Array<string>>([]);
  const [start, setStartDate] = useState<{ startDate: string | null | Date; endDate: string | null | Date }>({
    startDate: null,
    endDate: null,
  });
  const [end, setEndDate] = useState<DateValueType>({ startDate: null, endDate: null });

  const [, setLoading] = useState(false);

  const updateInput = (state: string, value: string) => {
    if (state === "company") setCompany(value);
    if (state === "designation") setDesignation(value);
    if (state === "domain") setDomains(value.split(", "));
  };

  const updateDate = (
    type: string,
    value: { startDate: string | null | Date; endDate: string | null | Date } | null,
  ) => {
    if (value) {
      if (type === "Start Date") setStartDate({ startDate: value?.startDate, endDate: value?.endDate });
      else setEndDate({ startDate: value?.startDate, endDate: value?.endDate });
    }
  };

  useEffect(() => {
    if (experienceIdx) {
      setCompany(data?.skills_master.experience?.[+experienceIdx].company_name ?? "");
      setDesignation(data?.skills_master.experience?.[+experienceIdx].designation ?? "");
      setDomains(data?.skills_master.experience?.[+experienceIdx].domains ?? []);
      setStartDate({
        startDate: data?.skills_master.experience?.[+experienceIdx].start_date ?? "",
        endDate: data?.skills_master.experience?.[+experienceIdx].start_date ?? "",
      });
      setEndDate({
        startDate: data?.skills_master.experience?.[+experienceIdx].end_date ?? "",
        endDate: data?.skills_master.experience?.[+experienceIdx].end_date ?? "",
      });
    }
  }, [data]);

  return (
    <section className="flex min-w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex items-center gap-2">
        <IconEdit />
        <h2 className="text-xl capitalize">{type} Your Experience</h2>
      </div>
      <div className="flex flex-col gap-8 px-16 py-8">
        <div className="flex flex-col gap-4">
          {experienceForm.map((field) => (
            <div key={field.label}>
              <label htmlFor={field.label} className="block text-base font-semibold dark:text-white">
                {field.label}
              </label>
              {field.type === "input" ? (
                <input
                  type="text"
                  id={field.label}
                  value={field.state === "company" ? company_name : designation}
                  onChange={(e) => updateInput(field.state, e.target.value)}
                  required
                  className="block w-full min-w-[40rem] rounded-lg border-gray-400 px-4 py-3 text-sm focus:border-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
                />
              ) : field.type === "select" ? (
                <div>
                  <div className="hs-dropdown relative mx-1 mt-1 [--auto-close:inside] sm:mt-1 sm:inline-flex">
                    <button
                      id="hs-dropdown-auto-close-inside"
                      type="button"
                      className="hs-dropdown-toggle inline-flex w-64 items-center gap-x-2 truncate rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <span
                        className={cx(
                          "w-64 truncate text-start capitalize",
                          domains.length ? "text-primary" : "text-gray-500",
                        )}
                      >
                        {domains.length ? domains.join(", ") : "Select domain(s)"}
                      </span>
                      <svg
                        className="size-2.5 hs-dropdown-open:rotate-180"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <div
                      className="hs-dropdown-menu duration z-50 mt-2 hidden max-h-56 min-w-56 overflow-auto rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] hs-dropdown-open:opacity-100"
                      aria-labelledby="hs-dropdown-auto-close-inside"
                    >
                      {domainList.map((option) => (
                        <div
                          id={option}
                          key={option}
                          className="relative flex cursor-pointer items-start rounded-lg px-3 py-2 hover:bg-gray-100"
                          onClick={(e) => {
                            const selectedDomain = e.currentTarget.id;
                            setDomains((domains) =>
                              domains.includes(selectedDomain)
                                ? domains.filter((domain) => domain !== selectedDomain)
                                : [...domains, selectedDomain],
                            );
                          }}
                        >
                          <div className="mt-1 flex h-5 items-center">
                            <input
                              id={option}
                              name={option}
                              type="checkbox"
                              checked={domains.includes(option)}
                              className="shrink-0 rounded border-gray-200 text-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
                              value={option}
                            />
                          </div>
                          <label htmlFor={option} className="ms-3.5">
                            <span className="mt-1 block cursor-pointer text-sm font-semibold capitalize text-gray-800">
                              {option}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-max">
                  <Datepicker
                    asSingle={true}
                    startFrom={field.label === "End Date" && start.startDate ? new Date(start.startDate) : null}
                    minDate={field.label === "End Date" && start.startDate ? new Date(start.startDate) : null}
                    maxDate={new Date()}
                    value={field.label === "Start Date" ? start : end}
                    displayFormat={"DD/MM/YYYY"}
                    onChange={(e) => updateDate(field.label, e)}
                    useRange={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="flex items-center justify-center rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={() => navigate("/my-experience")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={async () => {
              setLoading(true);

              const json = {
                skills_master: {
                  ...data?.skills_master,
                },
              };

              if (!experienceIdx)
                Object.assign(json, {
                  skills_master: {
                    ...data?.skills_master,
                    experience: [
                      ...(data?.skills_master.experience as []),
                      { company_name, designation, domains, start_date: start?.startDate, end_date: end?.startDate },
                    ],
                  },
                });
              else if (json.skills_master.experience && experienceIdx)
                json.skills_master.experience[+experienceIdx] = {
                  company_name,
                  designation,
                  domains,
                  start_date: start?.startDate,
                  end_date: end?.startDate ? end?.startDate : null,
                };

              const response: { Status: string } = await ky
                .post(
                  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}${import.meta.env.VITE_USERS_EXPERIENCE_API}/${data?.skills_master.user?.u_id}`,
                  { json },
                )
                .json();
              setLoading(false);

              if (response.Status === "OK") {
                localforage.setItem("userData", json);
                setData({ skills_master: { ...json.skills_master } });
                navigate("/my-experience");
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

export default UpdateExperience;
