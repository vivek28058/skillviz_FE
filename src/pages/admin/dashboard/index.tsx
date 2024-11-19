import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { IconBulb, IconCertificate, IconHierarchy3, IconUserSquare } from "@tabler/icons-react";
import ReactApexChart from "react-apexcharts";
import { adminColumnSeries, columnOptions } from "../../../components/Charts/Column";
import HorizontalFlow from "../../../components/Hierarchy";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";
import { AdminAnalytics } from "../../../types/AdminAnalytics";
import { TriGradientGenerator } from "../../../utils/Gradient";
import { Quadrant } from "../../../types/Quadrants";
import cx from "classix";
import { radarOptions, radarSeries } from "../../../components/Charts/Radar/config";

const skillsHead = ["Skills", "Percentage of Employees"];

const certificateHead = ["Certification", "Percentage of Employees"];

const gradientList = TriGradientGenerator("#818CF8", "#7DD3FC", "#4ADE80", 100);

function AdminDasboard() {
  const hierarchy = JSON.parse(localStorage.getItem("hierarchy") ?? "{}");
  const hierarchyCount = JSON.parse(localStorage.getItem("hierarchyCount") ?? "{}");

  const navigate = useNavigate();

  const [adminData, setAdminData] = useState<AdminAnalytics | null>();

  const quadrants = useMemo(() => adminData?.quadrant_aggregates, [adminData]);

  const score = useMemo(
    () =>
      adminData?.category_aggregates?.map((category) => Math.round((category.my_score / category.total_score) * 100)),
    [adminData],
  );

  const categories = useMemo(
    () => adminData?.category_aggregates.map((category) => category.name.split(" ")),
    [adminData],
  );

  const sortedCertification = useMemo(
    () => adminData?.certification_aggregates.toSorted((a, b) => b.percentage - a.percentage),
    [adminData],
  );

  useEffect(() => {
    localforage.getItem("adminAnalytics").then((data) => {
      setAdminData(data as AdminAnalytics);
    });
  }, []);

  console.debug("hierarchy", hierarchyCount, hierarchy);

  useLayoutEffect(() => {
    document.title = "SkillViz | Admin Dashboard";
  }, []);

  return (
    <section className="flex flex-col gap-4 px-8 py-4">
      <div>
        <h1 className="text-xl font-semibold">Welcome, Admin</h1>
        <span className="text-gray-400">Track workforce insights effectively</span>
      </div>
      <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex gap-4">
          <h1 className="text-md w-max rounded-full border border-gray-300 px-3 py-1 font-semibold">
            Employee Count: {adminData?.total_employees}
          </h1>
          <h1 className="text-md w-max rounded-full border border-gray-300 px-3 py-1 font-semibold">
            Admin Count: {adminData?.total_admins}
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col rounded-2xl border">
              <div className="flex items-center justify-center gap-1 p-3">
                <IconBulb />
                <h1 className="text-xl font-semibold">Top Skills</h1>
              </div>
              <div className="flex max-h-[350px] flex-1 overflow-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr className="relative z-10 divide-x divide-gray-200 dark:divide-gray-700">
                      {skillsHead.map((head) => (
                        <th
                          key={head}
                          scope="col"
                          className="sticky top-0 bg-gray-100 px-6 py-3 text-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="relative divide-y divide-gray-200 dark:divide-gray-700">
                    {adminData?.top_5_skills.map((skill, i) => (
                      <tr key={i} className="divide-x divide-gray-200 dark:divide-gray-700">
                        {skillsHead.map((_, i) => (
                          <td
                            key={i}
                            className={"text-md h-16 px-4 py-2 text-center capitalize text-gray-600 dark:text-gray-500"}
                          >
                            {i ? `${skill.percentage}%` : skill.name}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-1 flex-col rounded-2xl border">
              <div className="flex items-center justify-center gap-1 p-3">
                <IconCertificate />
                <h1 className="text-xl font-semibold">Employee Certifications</h1>
              </div>
              <div className="flex max-h-[350px] flex-1 overflow-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr className="relative z-10 divide-x divide-gray-200 dark:divide-gray-700">
                      {certificateHead.map((head) => (
                        <th
                          key={head}
                          scope="col"
                          className="sticky top-0 bg-gray-100 px-6 py-3 text-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="relative divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedCertification?.map((certificate, i) => (
                      <tr key={i} className="divide-x divide-gray-200 dark:divide-gray-700">
                        {certificateHead.map((_, i) => (
                          <td
                            key={i}
                            className={cx(
                              "text-md h-16 cursor-pointer px-4 py-2 text-center capitalize text-gray-600 dark:text-gray-500",
                              !Boolean(i) && "hover:bg-gray-200",
                            )}
                            onClick={() => navigate(`/admin/search?certificate=${certificate.name}`)}
                          >
                            {i ? `${certificate.percentage.toFixed(2)}%` : certificate.name}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col rounded-2xl border border-gray-200">
            <div className="flex items-center justify-center gap-1 p-3">
              <IconUserSquare />
              <h1 className="text-xl font-semibold">Employee Skills</h1>
            </div>
            <ReactApexChart
              options={columnOptions(["Actual", "Expected"], (category: string) => {
                navigate(`/admin/skills-distribution/${category}`);
              })}
              series={adminColumnSeries(adminData?.chart_ac_ex_data)}
              type="bar"
              width="100%"
              height={450}
            />
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <IconHierarchy3 />
          <h2 className="text-xl font-semibold">Career Path</h2>
        </div>
        <div className="h-96">
          <HorizontalFlow hierarchy={hierarchy} count={hierarchyCount} />
        </div>
      </section>
      <section className="flex flex-wrap justify-center gap-12 rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex basis-4/12 flex-col items-center gap-2">
          <h1 className="h-max w-max px-6 py-2 text-xl font-semibold">Quadrant Heatmap</h1>
          <div className="flex min-h-80 flex-grow flex-wrap">
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
        <div className="flex flex-col items-center overflow-auto">
          <div className="flex items-center gap-2">
            <IconBulb />
            <h1 className="h-max w-max px-6 py-2 text-xl font-semibold">Skills Spider</h1>
          </div>
          <ReactApexChart
            options={radarOptions(categories || [], 200)}
            series={radarSeries(score?.length ? score : [null])}
            type="radar"
            width={600}
            height={500}
          />
        </div>
      </section>
    </section>
  );
}

export default AdminDasboard;
