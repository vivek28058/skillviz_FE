import { IconArrowBack, IconBulb } from "@tabler/icons-react";
import ReactApexChart from "react-apexcharts";
import { useParams, useNavigate } from "react-router-dom";
import { adminBarSeries, barOptions, stackedOptions } from "../../../../components/Charts/Bar";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import localforage from "localforage";
import { AdminAnalytics, AdminCategory, AdminSkills, AdminSubCategory } from "../../../../types/AdminAnalytics";

const scores = { 0: "No", 1: "Beginner", 2: "Intermediate", 3: "Advanced", 4: "Expert" };

function AdminSkillsDistribution() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [adminData, setAdminData] = useState<AdminAnalytics | null>();

  const totalEmployees = useMemo(() => Math.ceil((adminData?.total_employees ?? 100) / 100), [adminData]);

  const selectedCategory: AdminCategory | undefined = useMemo(
    () => adminData?.category_aggregates.find((category) => category.name === id),
    [adminData],
  );

  const [horizontal, setHorizontal] = useState<Array<{ name: string | undefined; enabled: boolean }>>(
    selectedCategory?.sub_category.map((subCategory) => ({ name: subCategory.name, enabled: true })) || [],
  );

  const barSeries = (subCategory: AdminSubCategory): ApexAxisChartSeries =>
    Object.entries(scores).map(([key, name]) => ({
      name,
      data: subCategory.skills.map((skill) => Number(skill[key as keyof AdminSkills])),
    }));

  useEffect(() => {
    setHorizontal(
      selectedCategory?.sub_category.map((subCategory) => ({ name: subCategory.name, enabled: true })) || [],
    );
  }, [selectedCategory]);

  useEffect(() => {
    localforage.getItem("adminAnalytics").then((data) => {
      setAdminData(data as AdminAnalytics);
    });
  }, []);

  useEffect(() => { }, [horizontal]);

  useLayoutEffect(() => {
    document.title = "SkillViz | Skills Distribution";
  }, []);

  return (
    <section className="relative m-8 flex flex-wrap justify-center rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <button className="absolute left-4 top-4 rounded-full p-2 hover:bg-gray-200" onClick={() => navigate(-1)}>
        <IconArrowBack />
      </button>
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <IconBulb />
          <h2 className="text-xl font-semibold capitalize">{selectedCategory?.name} Distribution</h2>
        </div>
        <div className="flex w-full flex-col gap-12 p-4">
          {selectedCategory?.sub_category.map((subCategory) => (
            <div
              key={subCategory.name}
              className="flex flex-col gap-8 rounded-[2rem] p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
            >
              <h3 className="rounded-full bg-primary bg-opacity-20 text-center text-md font-semibold capitalize">
                {subCategory.name}
              </h3>
              <div className="flex w-full justify-between overflow-auto">
                <ReactApexChart
                  options={barOptions(totalEmployees, 100, "Scored Employee Distribution", " Employee(s)", 200)}
                  series={adminBarSeries(
                    subCategory.skills.map((skill) => ({
                      x: skill.skill_name ?? "",
                      y: skill[1] + skill[2] + skill[3] + skill[4],
                    })),
                  )}
                  type="bar"
                  width={520}
                  height={subCategory.skills.length > 5 ? subCategory.skills.length * 35 : 200}
                />
                <div className="relative">
                  <button
                    type="button"
                    id={subCategory.name}
                    className="absolute right-[18%] z-30 rounded-xl border border-primary px-3 py-1 hover:bg-primary hover:text-white"
                    onClick={(e) => {
                      const target = e.currentTarget.id;
                      setHorizontal((horizontal) =>
                        horizontal.map((subCategory) =>
                          subCategory.name === target
                            ? {
                              ...subCategory,
                              enabled: !subCategory.enabled,
                            }
                            : subCategory,
                        ),
                      );
                    }}
                  >
                    {horizontal.find((subCat) => subCat.name === subCategory.name)?.enabled ? "Bar" : "Column"}
                  </button>
                  <ReactApexChart
                    options={stackedOptions(
                      subCategory.skills.map((skill) =>
                        subCategory.name === horizontal.find((subCat) => subCat.name === subCategory.name)?.name &&
                          horizontal.find((subCat) => subCat.name === subCategory.name)?.enabled
                          ? skill.skill_name
                          : skill.skill_name.split(" ", 1),
                      ),
                      "Comparative Score Histogram",
                      subCategory.name === horizontal.find((subCat) => subCat.name === subCategory.name)?.name &&
                      horizontal.find((subCat) => subCat.name === subCategory.name)?.enabled,
                    )}
                    series={barSeries(subCategory)}
                    type="bar"
                    width={720}
                    height={
                      horizontal.find((subCat) => subCat.name === subCategory.name)?.enabled
                        ? subCategory.skills.length > 5
                          ? subCategory.skills.length * 35
                          : 200
                        : subCategory.skills.length > 5
                          ? Math.log2(subCategory.skills.length ** 92)
                          : 200
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminSkillsDistribution;
