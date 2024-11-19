import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { IconAugmentedReality, IconBulb, IconCertificate, IconHierarchy3 } from "@tabler/icons-react";
import HorizontalFlow from "../../components/Hierarchy";
import ReactApexChart from "react-apexcharts";
import { radarOptions, radarSeries } from "../../components/Charts/Radar/config";
import { useData } from "../../hooks/useData";
import { columnOptions, userColumnSeries } from "../../components/Charts/Column";
import { useNavigate } from "react-router-dom";
import cx from "classix";
import { TriGradientGenerator } from "../../utils/Gradient";
import { Quadrant } from "../../types/Quadrants";

const gradientList = TriGradientGenerator("#818CF8", "#7DD3FC", "#4ADE80", 100);

function Dashboard() {
  const navigate = useNavigate();

  const { data } = useData();

  const user = useMemo(() => data?.skills_master.user, [data]);

  const quadrants = useMemo(() => data?.skills_master.quadrants, [data]);

  const score = data?.skills_master.categories?.map((category) =>
    Math.round((category.my_score / category.total_score) * 100),
  );

  const [categories, setCategories] = useState(data?.skills_master.categories?.map((category) => category.name));

  const userAnalytics = useMemo(
    () =>
      [...(data?.skills_master.categories || [])]?.sort(
        (a, b) => b.my_score / b.total_score - a.my_score / a.total_score,
      ),
    [data],
  );

  const hierarchy = JSON.parse(localStorage.getItem("hierarchy") ?? "{}");

  const dId = JSON.parse(localStorage.getItem("dId") ?? "{}");

  useEffect(() => {
    setCategories(data?.skills_master.categories?.map((category) => category.name));
  }, [data]);

  useLayoutEffect(() => {
    document.title = "SkillViz | Dashboard";
  }, []);

  return (
    <>
      <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <IconAugmentedReality />
          <h2 className="text-xl">Overview</h2>
        </div>
        <div className="flex justify-between gap-10 rounded-2xl bg-gray-100 px-10 py-5">
          <div className="flex items-center gap-10">
            <span className="inline-flex size-32 items-center justify-center rounded-full bg-gray-500 text-2xl font-medium capitalize leading-none text-white">
              {user?.name.split(" ").map((word) => word.charAt(0))}
            </span>
            <div className="flex flex-col">
              <span className="text-xl">{user?.name}</span>
              <span className="text-xl">{user?.details.designation.name}</span>
              <span className="text-xl">{user?.details.experience} of experience</span>
            </div>
          </div>
          <div className="flex h-72 w-1/3 flex-col gap-2">
            <div className="flex flex-grow flex-wrap">
              {quadrants?.map((quadrant: Quadrant, i: number) => (
                <div
                  key={quadrant.Name}
                  className={cx(
                    "flex w-1/2 flex-col border border-white p-4",
                    i === 0 && "rounded-ss-3xl border-l-0 border-t-0",
                    i === 1 && "rounded-se-3xl border-r-0 border-t-0",
                    i === 2 && "rounded-es-3xl border-b-0 border-l-0",
                    i === 3 && "rounded-ee-3xl border-b-0 border-r-0",
                    quadrant.Total
                      ? `bg-[${gradientList[Math.round((quadrant.Score / quadrant.Total) * 100)]}]`
                      : "bg-[#818cf8]",
                  )}
                >
                  <span className="text-base font-semibold">{quadrant.Name}</span>
                  <span className="flex flex-grow items-center justify-center text-base font-semibold">
                    Score: {quadrant.Score}/{quadrant.Total}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex h-4 w-full items-center justify-between rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-green-400 p-3">
              <span className="text-sm font-semibold text-white drop-shadow-2xl">Low</span>
              <span className="text-sm font-semibold text-white drop-shadow-2xl">High</span>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <IconHierarchy3 />
          <h2 className="text-xl">My Career Path</h2>
        </div>
        <div className="h-96">
          <HorizontalFlow hierarchy={hierarchy} dId={dId} />
        </div>
      </section>
      <section className="grid grid-cols-12 gap-4 rounded-2xl">
        <div className="col-span-6 place-items-center gap-2 rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="flex items-center gap-2 pb-4">
            <IconBulb />
            <h2 className="text-xl">My Top Skills</h2>
          </div>
          <div className="flex max-h-[340px] flex-col gap-2 overflow-auto">
            {userAnalytics?.map((skill) => (
              <div key={skill.name} className="flex justify-between rounded-2xl bg-gray-100 p-4 text-lg">
                <span>{skill.name}</span>
                <span>{Math.round((skill.my_score / skill.total_score) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-6 place-items-center gap-2 rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="flex items-center gap-2 pb-4">
            <IconCertificate />
            <h2 className="text-xl">My Certifications</h2>
          </div>
          <div className="flex max-h-[340px] flex-1 flex-col items-center gap-2 overflow-auto">
            {data?.skills_master?.certifications?.find((certificate) => certificate.acquired) ? (
              data?.skills_master.certifications
                ?.filter((certificate) => certificate.acquired)
                .map((certificate) => (
                  <div key={certificate.c_name} className="w-full rounded-lg bg-gray-100 p-4 text-lg">
                    {certificate.c_name}
                  </div>
                ))
            ) : (
              <div className="flex flex-col gap-4 p-4">
                <span className="text-lg">
                  You don't seem to have any certifications. Here's a tiny inspiration for you.
                </span>
                <blockquote className="relative mt-4">
                  <svg
                    className="absolute -start-8 -top-6 size-16 text-gray-100 dark:text-gray-700"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                      fill="currentColor"
                    ></path>
                  </svg>

                  <div className="relative z-10">
                    <p className="text-gray-800 dark:text-white sm:text-[1.2rem]">
                      <em>
                        In the vast universe, find your own orbit. Define your path, for the stars within you guide your
                        destiny.{" "}
                      </em>
                    </p>
                    <p className="text-[1.4rem]">- Aryabhatta</p>
                  </div>
                </blockquote>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-center rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex flex-col items-center overflow-auto">
          <div className="flex items-center gap-2">
            <IconBulb />
            <h2 className="text-xl">Skills Spider</h2>
          </div>
          <ReactApexChart
            options={radarOptions(categories || [])}
            series={radarSeries(score?.length ? score : [null])}
            type="radar"
            width={1000}
          />
        </div>
        <div className="flex flex-col items-center overflow-auto">
          <div className="flex items-center gap-2">
            <IconBulb />
            <h2 className="text-xl">Skills Distribution</h2>
          </div>
          <ReactApexChart
            options={columnOptions(["My Score", "Total Score"], (category: string) => {
              navigate(`/skills-distribution/${category}`);
            })}
            series={userColumnSeries(data?.skills_master.categories)}
            type="bar"
            width={1100}
          />
        </div>
      </section>
    </>
  );
}

export default Dashboard;
