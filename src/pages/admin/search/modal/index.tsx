import { IconArrowBack, IconAugmentedReality, IconBulb, IconCertificate } from "@tabler/icons-react";
import { UserData } from "../../../../types/UserData";
import ReactApexChart from "react-apexcharts";
import { useEffect, useMemo, useState } from "react";
import { radarOptions, radarSeries } from "../../../../components/Charts/Radar/config";
import { columnOptions, userColumnSeries } from "../../../../components/Charts/Column";
import { Quadrant } from "../../../../types/Quadrants";
import cx from "classix";
import { TriGradientGenerator } from "../../../../utils/Gradient";
import { barOptions, userBarSeries } from "../../../../components/Charts/Bar";
import { Category } from "../../../../types/Categories";

const gradientList = TriGradientGenerator("#818CF8", "#7DD3FC", "#4ADE80", 100);

export const SearchModal = (props: { data: UserData | undefined }) => {
  const userName = props?.data?.skills_master?.user?.name;

  const quadrants = props.data?.skills_master.quadrants;

  const categoriesData = props?.data?.skills_master?.categories;

  const score = categoriesData?.map((category) => Math.round((category.my_score / category.total_score) * 100));

  const [categories, setCategories] = useState(categoriesData?.map((category) => category.name));

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const userAnalytics = useMemo(
    () => [...(categoriesData || [])]?.sort((a, b) => b.my_score / b.total_score - a.my_score / a.total_score),
    [props?.data],
  );

  useEffect(() => {
    setCategories(categoriesData?.map((category) => category.name));
  }, [props?.data]);

  return (
    <div
      id="hs-vertically-centered-scrollable-modal"
      className="hs-overlay pointer-events-non fixed start-0 top-0 z-[80] hidden size-full overflow-y-auto overflow-x-hidden"
    >
      <div className="m-3 mt-0 flex h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] w-11/12 items-center opacity-0 transition-all ease-out hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 sm:mx-auto">
        <div className="pointer-events-auto flex max-h-full w-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-md font-bold text-gray-800">{userName}'s Profile</h3>
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
              data-hs-overlay="#hs-vertically-centered-scrollable-modal"
            >
              <span className="sr-only">Close</span>
              <svg
                className="size-4 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto p-4">
            {selectedCategory ? (
              <section className="relative flex flex-wrap justify-center rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <button
                  className="absolute left-4 top-4 rounded-full p-2 hover:bg-gray-200"
                  onClick={() => setSelectedCategory(null)}
                >
                  <IconArrowBack />
                </button>
                <div className="flex w-full flex-col items-center gap-6">
                  <div className="flex items-center gap-2">
                    <IconBulb />
                    <h2 className="text-xl capitalize">{selectedCategory?.name} Distribution</h2>
                  </div>
                  <div className="flex w-full flex-col gap-12 p-4">
                    {selectedCategory?.["sub-category"].map((subCategory) => (
                      <div
                        key={subCategory.name}
                        className="flex flex-col gap-8 rounded-[2rem] p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                      >
                        <h3 className="text-center text-lg capitalize">{subCategory.name} Scores</h3>
                        <ReactApexChart
                          options={barOptions(4, 1, "", "", 450, [
                            "No",
                            "Beginner",
                            "Intermediate",
                            "Advanced",
                            "Expert",
                          ])}
                          series={userBarSeries(subCategory)}
                          type="bar"
                          width="100%"
                          height={subCategory.concern.length > 5 ? subCategory.concern.length * 35 : 200}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <div className="space-y-4">
                <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                  <div className="flex items-center gap-2">
                    <IconAugmentedReality />
                    <h2 className="text-xl">Overview</h2>
                  </div>
                  <div className="flex justify-between gap-10 rounded-2xl bg-gray-100 px-10 py-5">
                    <div className="flex items-center gap-10">
                      <span className="inline-flex size-32 items-center justify-center rounded-full bg-gray-500 text-xl font-medium capitalize leading-none text-white">
                        {userName?.split(" ").map((word) => word.charAt(0))}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-lg">{userName}</span>
                        <span className="text-lg">{props?.data?.skills_master?.user?.details?.designation?.name}</span>
                        <span className="text-lg">
                          {props?.data?.skills_master?.user?.details?.experience} of experience
                        </span>
                      </div>
                    </div>
                    <div className="flex h-80 w-1/3 flex-col gap-2">
                      <div className="flex flex-grow flex-wrap">
                        {quadrants?.map((quadrant: Quadrant, i: number) => (
                          <div
                            className={cx(
                              "flex w-1/2 flex-col border border-white p-4",
                              i === 0 && "rounded-ss-3xl border-l-0 border-t-0",
                              i === 1 && "rounded-se-3xl border-r-0 border-t-0",
                              i === 2 && "rounded-es-3xl border-b-0 border-l-0",
                              i === 3 && "rounded-ee-3xl border-b-0 border-r-0",
                              `bg-[${gradientList[Math.round((quadrant.Score / quadrant.Total) * 100)]}]`,
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
                <section className="grid grid-cols-12 gap-4 rounded-2xl">
                  <div className="col-span-6 place-items-center gap-2 rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                    <div className="flex items-center gap-2 pb-4">
                      <IconBulb />
                      <h2 className="text-xl">{userName}'s Top Skills</h2>
                    </div>
                    <div className="flex max-h-[340px] flex-col gap-2 overflow-auto">
                      {userAnalytics?.map((skill) => (
                        <div key={skill.name} className="flex justify-between rounded-2xl bg-gray-100 p-4 text-sm">
                          <span>{skill.name}</span>
                          <span>{Math.round((skill.my_score / skill.total_score) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-6 place-items-center gap-2 rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                    <div className="flex items-center gap-2 pb-4">
                      <IconCertificate />
                      <h2 className="text-xl">{userName}'s Certifications</h2>
                    </div>
                    <div className="flex max-h-[340px] flex-1 flex-col items-center gap-2 overflow-auto">
                      {props?.data?.skills_master?.certifications?.find((certificate) => certificate?.acquired) ? (
                        props?.data?.skills_master?.certifications
                          ?.filter((certificate) => certificate?.acquired)
                          .map((certificate) => (
                            <div key={certificate?.c_name} className="w-full rounded-lg bg-gray-100 p-4 text-sm">
                              {certificate?.c_name}
                            </div>
                          ))
                      ) : (
                        <div className="flex flex-col gap-4 p-4">
                          <span className="text-base">{userName} doesn't seem to have any certifications</span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                <section className="flex flex-col justify-center rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                  <div className="flex flex-col items-center overflow-auto">
                    <div className="flex items-center gap-2">
                      <IconBulb />
                      <h2 className="text-xl">{userName}'s Skills Spider</h2>
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
                      <h2 className="text-xl">{userName}'s Skills Distribution</h2>
                    </div>
                    <ReactApexChart
                      options={columnOptions([`${userName}'s Score`, "Total Score"], (category: string) => {
                        setSelectedCategory(categoriesData?.find((cat) => cat.name === category) ?? null);
                      })}
                      series={userColumnSeries(categoriesData)}
                      type="bar"
                      width={1200}
                    />
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
